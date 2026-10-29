import assert from 'node:assert/strict';
import { test } from 'node:test';
import { existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import express from 'express';
import mysql from 'mysql2/promise';

if (existsSync(new URL('../.env', import.meta.url))) process.loadEnvFile(new URL('../.env', import.meta.url));
// Always create a fresh schema. Never reuse, reset, seed or drop an existing database.
const database = `autospa_pfa13_test_${randomBytes(8).toString('hex')}`;
Object.assign(process.env, { DB_NAME: database, DB_LOGGING: 'false', PORT: '0' });

test('real MySQL and HTTP integration in a new exclusive schema', async (t) => {
  const admin = await mysql.createConnection({
    host: process.env.DB_HOST, port: Number(process.env.DB_PORT),
    user: process.env.DB_USER, password: process.env.DB_PASSWORD,
  });
  await admin.query(`CREATE DATABASE \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci`);
  await admin.end();
  console.log(`Exclusive test schema retained: ${database}`);
  const { sequelize, Service, Order } = await import('../src/models/index.js');
  const { migrations } = await import('../src/db/migrations/index.js');
  let server;
  const originalListen = express.application.listen;
  t.after(async () => {
    express.application.listen = originalListen;
    if (server) await new Promise((resolve) => server.close(resolve));
    await sequelize.close();
  });
  for (const migration of migrations) await migration.up({ context: sequelize });
  express.application.listen = function (...args) {
    server = originalListen.apply(this, args);
    return server;
  };
  await import('../src/server.js');
  if (!server.listening) await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api`;
  async function request(path, options) {
    const response = await fetch(base + path, options);
    return { status: response.status, body: await response.json() };
  }
  const post = (body) => request('/orders', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  function error(result, status, code, message, details = []) {
    assert.deepEqual(result, { status, body: { error: { code, message, details } } });
  }
  await t.test('startup, health and empty lists', async () => {
    assert.deepEqual(await request('/health'), { status: 200, body: { message: 'Backend de AutoSpa disponible' } });
    for (const path of ['/services', '/orders']) {
      assert.deepEqual(await request(path), { status: 200, body: { data: [] } });
    }
  });
  let service;
  await t.test('active services, nullable description, types and id order', async () => {
    service = await Service.create({ name: 'Original', description: null, price: '20.00' });
    await Service.create({ name: 'Inactive', price: '30.00', isActive: false });
    const last = await Service.create({ name: 'Premium', description: 'Exterior', price: '45.50' });
    assert.deepEqual(await request('/services'), { status: 200, body: { data: [
      { id: service.id, name: 'Original', description: null, price: '20.00' },
      { id: last.id, name: 'Premium', description: 'Exterior', price: '45.50' },
    ] } });
  });
  const valid = { plate: ' abc-123 ', customerName: ' Ana ', serviceId: 1 };
  let created;
  await t.test('POST then GET: identical object and historical values after catalog update', async () => {
    const result = await post(valid);
    assert.equal(result.status, 201);
    created = result.body.data;
    assert.deepEqual(Object.keys(created), ['id', 'plate', 'customerName', 'customerPhone', 'serviceId', 'serviceName', 'servicePrice', 'status', 'createdAt', 'updatedAt']);
    assert.equal(created.plate, 'ABC123');
    assert.equal(created.customerName, 'Ana');
    assert.equal(created.customerPhone, null);
    assert.equal(created.servicePrice, '20.00');
    assert.equal(created.status, 'waiting');
    for (const key of ['createdAt', 'updatedAt']) assert.equal(new Date(created[key]).toISOString(), created[key]);
    await service.update({ name: 'Changed', price: '99.99' });
    assert.deepEqual(await request('/orders'), { status: 200, body: { data: [created] } });
  });
  await t.test('active states only, historical fields and createdAt/id ordering', async () => {
    const timestamp = new Date('2026-01-01T00:00:00Z');
    const rows = [];
    for (const [index, status] of ['washing', 'ready', 'delivered', 'cancelled'].entries()) {
      rows.push(await Order.create({ plate: `TST00${index}`, customerName: 'Test', customerPhone: null,
        serviceId: service.id, serviceName: 'Historic', servicePrice: '12.30', status,
        createdAt: timestamp, updatedAt: timestamp }));
    }
    const result = await request('/orders');
    assert.equal(result.status, 200);
    assert.deepEqual(result.body.data.map((row) => row.id), [rows[0].id, rows[1].id, created.id]);
    assert.equal(result.body.data[0].serviceName, 'Historic');
    assert.equal(result.body.data[0].servicePrice, '12.30');
  });
  await t.test('POST validation, media type, parser, unavailable service and active plate conflict', async () => {
    for (const body of [{}, { ...valid, serviceId: '1' }, { ...valid, status: 'ready' }]) {
      const result = await post(body);
      assert.equal(result.status, 422);
      assert.equal(result.body.error.code, 'VALIDATION_ERROR');
      assert.ok(result.body.error.details.length);
    }
    error(await request('/orders', { method: 'POST', body: '{}' }), 415, 'UNSUPPORTED_MEDIA_TYPE', 'Usa Content-Type: application/json.');
    error(await request('/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' }), 400, 'INVALID_JSON', 'El cuerpo de la solicitud no contiene JSON válido.');
    for (const serviceId of [2, 4294967295]) {
      const message = 'El servicio seleccionado no está disponible.';
      error(await post({ ...valid, serviceId }), 422, 'SERVICE_UNAVAILABLE', message, [{ field: 'serviceId', message }]);
    }
    const message = 'La placa ya tiene una orden activa.';
    error(await post(valid), 409, 'ACTIVE_ORDER_EXISTS', message, [{ field: 'plate', message }]);
    const concurrent = await Promise.all([post({ ...valid, plate: 'CON123' }), post({ ...valid, plate: 'CON123' })]);
    assert.deepEqual(concurrent.map((r) => r.status).sort(), [201, 409]);
    assert.equal(await Order.count({ where: { plate: 'CON123' } }), 1);
  });
  await t.test('real SQL failure returns 500 without leaking SQL', async () => {
    await sequelize.query('RENAME TABLE orders TO orders_test_hidden');
    try {
      error(await request('/orders'), 500, 'INTERNAL_ERROR', 'No se pudo completar la operación. Inténtalo nuevamente.');
    } finally {
      await sequelize.query('RENAME TABLE orders_test_hidden TO orders');
    }
  });
  await t.test('real connection loss returns 503 for both queries', async () => {
    // Isolate failure to this process; never stop the shared MySQL service.
    await sequelize.connectionManager.pool.destroyAllNow();
    const originalPort = sequelize.connectionManager.config.port;
    sequelize.connectionManager.config.port = 1;
    try {
      for (const path of ['/services', '/orders']) {
        error(await request(path), 503, 'TEMPORARILY_UNAVAILABLE', 'El servicio no está disponible temporalmente. Inténtalo nuevamente.');
      }
    } finally {
      sequelize.connectionManager.config.port = originalPort;
    }
  });
});
