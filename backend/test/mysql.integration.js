
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import express from 'express';
import mysql from 'mysql2/promise';

if (existsSync(new URL('../.env', import.meta.url))) {
  process.loadEnvFile(new URL('../.env', import.meta.url));
}

// Siempre crear un esquema nuevo y exclusivo.
// Nunca reutilizar, reiniciar ni eliminar bases de datos existentes.
const database = `autospa_pfa13_test_${randomBytes(8).toString('hex')}`;

Object.assign(process.env, {
  DB_NAME: database,
  DB_LOGGING: 'false',
  PORT: '0',
});

test('real MySQL and HTTP integration in a new exclusive schema', async (t) => {
  // 1. Crear el esquema temporal con el usuario administrador.
  const admin = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_TEST_ADMIN_USER,
    password: process.env.DB_TEST_ADMIN_PASSWORD,
  });

  try {
    await admin.query(
      `CREATE DATABASE \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci`
    );

    await admin.query(
      `GRANT ALL PRIVILEGES ON \`${database}\`.* TO 'autospa_app'@'localhost'`
    );
  } finally {
    await admin.end();
  }

  console.log(`Exclusive test schema retained: ${database}`);

  // 2. Importar modelos y utilidades.
  const { sequelize, Service, Order, User } =
    await import('../src/models/index.js');

  const { migrations } =
    await import('../src/db/migrations/index.js');

  const { hashPassword } =
    await import('../src/services/password-hash.js');

  let server;
  let cookie;

  const originalListen = express.application.listen;

  t.after(async () => {
    express.application.listen = originalListen;

    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }

    await sequelize.close();
  });

  // 3. Ejecutar migraciones en el esquema temporal.
  for (const migration of migrations) {
    await migration.up({ context: sequelize });
  }

  // 4. Crear un usuario de prueba con contraseña cifrada.
  const password = 'integration-test-password';

  const user = await User.create({
    name: 'Integration Test',
    email: 'integration@example.test',
    passwordHash: await hashPassword(password),
    isActive: true,
  });

  // 5. Capturar el servidor HTTP sin abrir un puerto fijo.
  express.application.listen = function (...args) {
    server = originalListen.apply(this, args);
    return server;
  };

  await import('../src/server.js');

  if (!server.listening) {
    await new Promise((resolve) => server.once('listening', resolve));
  }

  const base = `http://127.0.0.1:${server.address().port}/api`;

  // 6. Función común para enviar solicitudes con la sesión.
  async function request(path, options = {}) {
    const headers = new Headers(options.headers || {});

    if (cookie) {
      headers.set('Cookie', cookie);
    }

    const response = await fetch(base + path, {
      ...options,
      headers,
    });

    return {
      status: response.status,
      body: await response.json(),
    };
  }

  const post = (body) =>
    request('/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

  function error(result, status, code, message, details = []) {
    assert.deepEqual(result, {
      status,
      body: {
        error: {
          code,
          message,
          details,
        },
      },
    });
  }

  // 7. Iniciar sesión y conservar la cookie autospa.sid.
  const loginResponse = await fetch(base + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: user.email,
      password,
    }),
  });

  assert.equal(loginResponse.status, 200);

  cookie = loginResponse.headers.get('set-cookie')?.split(';', 1)[0];

  assert.ok(cookie, 'El login debe devolver una cookie de sesión.');

  // 8. Comprobar autenticación y disponibilidad.
  await t.test('startup, health and empty lists', async () => {
    assert.deepEqual(await request('/health'), {
      status: 200,
      body: {
        message: 'Backend de AutoSpa disponible',
        status: 'ok',
      },
    });

    assert.equal(
      (await request('/auth/me')).status,
      200,
      'La sesión debe identificar al usuario de prueba.'
    );

    for (const path of ['/services', '/orders']) {
      assert.deepEqual(await request(path), {
        status: 200,
        body: { data: [] },
      });
    }
  });

  let service;

  // 9. Comprobar catálogo de servicios.
  await t.test('active services, nullable description, types and id order', async () => {
    service = await Service.create({
      name: 'Original',
      description: null,
      price: '20.00',
    });

    await Service.create({
      name: 'Inactive',
      price: '30.00',
      isActive: false,
    });

    const last = await Service.create({
      name: 'Premium',
      description: 'Exterior',
      price: '45.50',
    });

    assert.deepEqual(await request('/services'), {
      status: 200,
      body: {
        data: [
          {
            id: service.id,
            name: 'Original',
            description: null,
            price: '20.00',
          },
          {
            id: last.id,
            name: 'Premium',
            description: 'Exterior',
            price: '45.50',
          },
        ],
      },
    });
  });

  // 10. Datos completos de una orden.
  const valid = {
    plate: ' abc-123 ',
    customerName: ' Ana ',
    customerPhone: null,
    serviceId: service.id,

    vehicleBrand: 'Toyota',
    vehicleModel: 'Yaris',
    vehicleType: 'automovil',
    vehicleSize: 'pequeno',
    dirtLevel: 'bajo',

    extraVacuum: true,
    extraWaxing: false,
    engineCleaning: true,

    discountAmount: 5,
  };

  let created;

  await t.test('POST then GET: pricing, vehicle data and historical snapshot', async () => {
    const result = await post(valid);

    assert.equal(result.status, 201);

    created = result.body.data;

    assert.deepEqual(Object.keys(created), [
      'id',
      'plate',
      'customerName',
      'customerPhone',
      'vehicleBrand',
      'vehicleModel',
      'vehicleType',
      'vehicleSize',
      'dirtLevel',
      'extraVacuum',
      'extraWaxing',
      'engineCleaning',
      'serviceId',
      'serviceName',
      'servicePrice',
      'discountAmount',
      'finalPrice',
      'status',
      'createdAt',
      'updatedAt',
    ]);

    assert.equal(created.plate, 'ABC123');
    assert.equal(created.customerName, 'Ana');
    assert.equal(created.customerPhone, null);

    assert.equal(created.vehicleBrand, 'Toyota');
    assert.equal(created.vehicleModel, 'Yaris');
    assert.equal(created.vehicleType, 'automovil');
    assert.equal(created.vehicleSize, 'pequeno');
    assert.equal(created.dirtLevel, 'bajo');

    assert.equal(created.extraVacuum, true);
    assert.equal(created.extraWaxing, false);
    assert.equal(created.engineCleaning, true);

    assert.equal(created.servicePrice, '20.00');
    assert.equal(created.discountAmount, '5.00');
    assert.equal(created.finalPrice, '15.00');

    assert.equal(created.status, 'waiting');

    for (const key of ['createdAt', 'updatedAt']) {
      assert.equal(new Date(created[key]).toISOString(), created[key]);
    }

    // Cambiar el catálogo no debe alterar el precio histórico.
    await service.update({
      name: 'Changed',
      price: '99.99',
    });

    assert.deepEqual(await request('/orders'), {
      status: 200,
      body: { data: [created] },
    });
  });

  // 11. Comprobar estados activos e históricos.
  await t.test('active states only, historical fields and createdAt/id ordering', async () => {
    const timestamp = new Date('2026-01-01T00:00:00Z');
    const rows = [];

    for (const [index, status] of [
      'washing',
      'ready',
      'delivered',
      'cancelled',
    ].entries()) {
      rows.push(
        await Order.create({
          plate: `TST00${index}`,
          customerName: 'Test',
          customerPhone: null,

          serviceId: service.id,
          serviceName: 'Historic',
          servicePrice: '12.30',
          discountAmount: '0.00',
          finalPrice: '12.30',

          status,
          createdAt: timestamp,
          updatedAt: timestamp,
        })
      );
    }

    const result = await request('/orders');

    assert.equal(result.status, 200);

    assert.deepEqual(
      result.body.data.map((row) => row.id),
      [rows[0].id, rows[1].id, created.id]
    );

    assert.equal(result.body.data[0].serviceName, 'Historic');
    assert.equal(result.body.data[0].servicePrice, '12.30');
    assert.equal(result.body.data[0].discountAmount, '0.00');
    assert.equal(result.body.data[0].finalPrice, '12.30');
  });

  // 12. Validaciones, conflictos y errores HTTP.
  await t.test('POST validation, media type, parser, unavailable service and active plate conflict', async () => {
    for (const body of [
      {},
      { ...valid, serviceId: '1' },
      { ...valid, status: 'ready' },
    ]) {
      const result = await post(body);

      assert.equal(result.status, 422);
      assert.equal(result.body.error.code, 'VALIDATION_ERROR');
      assert.ok(result.body.error.details.length);
    }

    error(
      await request('/orders', {
        method: 'POST',
        body: '{}',
      }),
      415,
      'UNSUPPORTED_MEDIA_TYPE',
      'Usa Content-Type: application/json.'
    );

    error(
      await request('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{',
      }),
      400,
      'INVALID_JSON',
      'El cuerpo de la solicitud no contiene JSON válido.'
    );

    for (const serviceId of [2, 4294967295]) {
      const message = 'El servicio seleccionado no está disponible.';

      error(
        await post({ ...valid, serviceId }),
        422,
        'SERVICE_UNAVAILABLE',
        message,
        [{ field: 'serviceId', message }]
      );
    }

    const conflictMessage = 'La placa ya tiene una orden activa.';

    error(
      await post(valid),
      409,
      'ACTIVE_ORDER_EXISTS',
      conflictMessage,
      [{ field: 'plate', message: conflictMessage }]
    );

    const concurrent = await Promise.all([
      post({ ...valid, plate: 'CON123' }),
      post({ ...valid, plate: 'CON123' }),
    ]);

    assert.deepEqual(
      concurrent.map((result) => result.status).sort(),
      [201, 409]
    );

    assert.equal(
      await Order.count({ where: { plate: 'CON123' } }),
      1
    );
  });

  // 13. Error SQL real, sin filtrar detalles internos.
  await t.test('real SQL failure returns 500 without leaking SQL', async () => {
    await sequelize.query(
      'RENAME TABLE orders TO orders_test_hidden'
    );

    try {
      error(
        await request('/orders'),
        500,
        'INTERNAL_ERROR',
        'No se pudo completar la operación. Inténtalo nuevamente.'
      );
    } finally {
      await sequelize.query(
        'RENAME TABLE orders_test_hidden TO orders'
      );
    }
  });

  // 14. Pérdida de conexión aislada al proceso de prueba.
  await t.test('real connection loss returns 503 for both queries', async () => {
    await sequelize.connectionManager.pool.destroyAllNow();

    const originalPort = sequelize.connectionManager.config.port;

    sequelize.connectionManager.config.port = 1;

    try {
      for (const path of ['/services', '/orders']) {
        error(
          await request(path),
          503,
          'TEMPORARILY_UNAVAILABLE',
          'El servicio no está disponible temporalmente. Inténtalo nuevamente.'
        );
      }
    } finally {
      sequelize.connectionManager.config.port = originalPort;
    }
  });
});
