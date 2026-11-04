import assert from 'node:assert/strict';
import { test } from 'node:test';
import express from 'express';
import { Op } from 'sequelize';

// No database connection in this suite. Override configuration before model imports.
Object.assign(process.env, {
  DB_HOST: '127.0.0.1', DB_PORT: '3306', DB_NAME: 'autospa_mock_tests',
  DB_USER: 'unused', DB_PASSWORD: '', DB_LOGGING: 'false', PORT: '0',
  SESSION_SECRET: 'test-session-secret-with-more-than-32-characters',
});
const { sequelize, Service, Order, User } = await import('../src/models/index.js');
const { presentOrder } = await import('../src/services/order-response.js');
const { hashPassword } = await import('../src/services/password-hash.js');

test('HTTP queries and shared error handler (mocks, without MySQL)', async (t) => {
  const originals = {
    authenticate: sequelize.authenticate, query: sequelize.query,
    services: Service.findAll, orders: Order.findAll, userFindOne: User.findOne,
    userFindByPk: User.findByPk, listen: express.application.listen,
  };
  let server;
  let cookie;
  sequelize.authenticate = async () => {};
  sequelize.query = async () => [[{ version: '8.0.46' }]];
  express.application.listen = function (...args) {
    server = originals.listen.apply(this, args);
    return server;
  };
  t.after(async () => {
    express.application.listen = originals.listen;
    Service.findAll = originals.services;
    Order.findAll = originals.orders;
    User.findOne = originals.userFindOne;
    User.findByPk = originals.userFindByPk;
    sequelize.authenticate = originals.authenticate;
    sequelize.query = originals.query;
    await new Promise((resolve) => server.close(resolve));
    await sequelize.close();
  });
  await import('../src/server.js');
  if (!server.listening) await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api`;
  async function get(path) {
    const response = await fetch(base + path, { headers: cookie ? { cookie } : {} });
    return { status: response.status, body: await response.json() };
  }
  async function patch(path, body) {
    const response = await fetch(base + path, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return { status: response.status, body: await response.json() };
  }
  async function post(path, body, includeCookie = false) {
    const headers = { 'content-type': 'application/json' };
    if (includeCookie && cookie) headers.cookie = cookie;
    return fetch(base + path, { method: 'POST', headers, body: JSON.stringify(body) });
  }

  await t.test('authentication: invalid credentials, login, me, protected route and logout', async () => {
    const password = ' secret ';
    const passwordHash = await hashPassword(password);
    User.findOne = async (options) => {
      assert.equal(options.where.email, 'personal@example.com');
      return {
        id: 1, name: 'Usuario de prueba', email: 'personal@example.com',
        passwordHash, isActive: true,
      };
    };
    User.findByPk = async (id) => {
      assert.equal(id, 1);
      return { id: 1, name: 'Usuario de prueba', email: 'personal@example.com', isActive: true };
    };

    assert.deepEqual(await get('/orders'), {
      status: 401,
      body: { error: { code: 'AUTHENTICATION_REQUIRED', message: 'Inicia sesión para continuar.', details: [] } },
    });

    const invalid = await post('/auth/login', {
      email: ' Personal@Example.com ', password: 'wrong',
    });
    assert.equal(invalid.status, 401);
    assert.equal((await invalid.json()).error.code, 'INVALID_CREDENTIALS');

    User.findOne = async () => ({
      id: 1, name: 'Usuario de prueba', email: 'personal@example.com',
      passwordHash, isActive: false,
    });
    const inactive = await post('/auth/login', {
      email: 'personal@example.com', password,
    });
    assert.equal(inactive.status, 401);
    User.findOne = async () => ({
      id: 1, name: 'Usuario de prueba', email: 'personal@example.com',
      passwordHash, isActive: true,
    });

    const login = await post('/auth/login', {
      email: ' Personal@Example.com ', password,
    });
    assert.equal(login.status, 200);
    assert.deepEqual(await login.json(), {
      data: { id: 1, name: 'Usuario de prueba', email: 'personal@example.com' },
    });
    const setCookie = login.headers.get('set-cookie');
    assert.match(setCookie, /HttpOnly/i);
    cookie = setCookie.split(';', 1)[0];

    assert.deepEqual(await get('/auth/me'), {
      status: 200,
      body: { data: { id: 1, name: 'Usuario de prueba', email: 'personal@example.com' } },
    });
    Order.findAll = async () => [];
    assert.equal((await get('/orders')).status, 200);

    const logout = await post('/auth/logout', null, true);
    assert.equal(logout.status, 200);
    assert.deepEqual(await logout.json(), { data: null });
    assert.equal((await get('/orders')).status, 401);
    const newLogin = await post('/auth/login', {
      email: 'personal@example.com', password,
    });
    assert.equal(newLogin.status, 200);
    cookie = newLogin.headers.get('set-cookie').split(';', 1)[0];
  });

  await t.test('services: projection, active filter, sort and decimal string', async () => {
    Service.findAll = async (options) => {
      assert.deepEqual(options, {
        attributes: ['id', 'name', 'description', 'price'],
        where: { isActive: true }, order: [['id', 'ASC']], raw: true,
      });
      return [{ id: 2, name: 'Lavado', description: null, price: '20.00' }];
    };
    assert.deepEqual(await get('/services'), {
      status: 200, body: { data: [{ id: 2, name: 'Lavado', description: null, price: '20.00' }] },
    });
  });
  await t.test('orders: real attributes, active states, stable order and historical values', async () => {
    const row = {
      id: 7, plate: 'ABC123', customerName: 'Ana', customerPhone: null,
      serviceId: 2, serviceName: 'Original', servicePrice: '20.00', status: 'ready',
      createdAt: new Date('2026-10-01T10:00:00Z'), updatedAt: new Date('2026-10-01T11:00:00Z'),
    };
    Order.findAll = async (options) => {
      assert.deepEqual(options.where.status[Op.in], ['waiting', 'washing', 'ready']);
      assert.deepEqual(options.order, [['createdAt', 'ASC'], ['id', 'ASC']]);
      assert.deepEqual(options.attributes, Object.keys(row));
      assert.equal(options.include, undefined);
      assert.equal(options.raw, true);
      return [row];
    };
    assert.deepEqual(await get('/orders'), { status: 200, body: { data: [presentOrder(row)] } });
  });
  await t.test('empty queries and unchanged health', async () => {
    Service.findAll = Order.findAll = async () => [];
    for (const path of ['/services', '/orders']) {
      assert.deepEqual(await get(path), { status: 200, body: { data: [] } });
    }
    assert.deepEqual(await get('/health'), {
      status: 200, body: { message: 'Backend de AutoSpa disponible' },
    });
  });
  await t.test('status changes reject requests without an authenticated user', async () => {
    assert.deepEqual(await patch('/orders/1/status', { expectedStatus: 'waiting', status: 'washing' }), {
      status: 401,
      body: { error: { code: 'AUTHENTICATION_REQUIRED', message: 'Inicia sesión para continuar.', details: [] } },
    });
  });
  await t.test('temporary and unexpected errors have exact contract (injected errors)', async () => {
    for (const [code, status, apiCode, message] of [
      ['ECONNREFUSED', 503, 'TEMPORARILY_UNAVAILABLE', 'El servicio no está disponible temporalmente. Inténtalo nuevamente.'],
      ['ER_LOCK_DEADLOCK', 503, 'TEMPORARILY_UNAVAILABLE', 'El servicio no está disponible temporalmente. Inténtalo nuevamente.'],
      ['UNEXPECTED', 500, 'INTERNAL_ERROR', 'No se pudo completar la operación. Inténtalo nuevamente.'],
    ]) {
      Service.findAll = Order.findAll = async () => { throw Object.assign(new Error('private SQL'), { original: { code } }); };
      for (const path of ['/services', '/orders']) {
        assert.deepEqual(await get(path), { status, body: { error: { code: apiCode, message, details: [] } } });
      }
    }
  });
});
