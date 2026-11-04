import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateOrderStatus, isAllowedOrderTransition } from '../src/validators/order-status.validator.js';

test('status transitions only allow the next state or waiting cancellation', () => {
  for (const [from, to] of [['waiting', 'washing'], ['waiting', 'cancelled'], ['washing', 'ready'], ['ready', 'delivered']]) assert.equal(isAllowedOrderTransition(from, to), true);
  for (const [from, to] of [['waiting', 'ready'], ['washing', 'waiting'], ['ready', 'cancelled'], ['delivered', 'waiting'], ['cancelled', 'washing']]) assert.equal(isAllowedOrderTransition(from, to), false);
});

test('status validation trims cancellation reason and enforces the request schema', () => {
  assert.deepEqual(validateOrderStatus({ expectedStatus: 'waiting', status: 'cancelled', reason: ' retiro ' }).data, { expectedStatus: 'waiting', status: 'cancelled', reason: 'retiro' });
  for (const body of [
    { expectedStatus: 'waiting', status: 'cancelled' },
    { expectedStatus: 'waiting', status: 'cancelled', reason: '  ' },
    { expectedStatus: 'waiting', status: 'cancelled', reason: 'x'.repeat(256) },
    { expectedStatus: 'waiting', status: 'washing', reason: 'sobrante' },
    { expectedStatus: 'waiting', status: 'washing', changedByUserId: 1 },
    { expectedStatus: 1, status: 'washing' },
  ]) assert.ok(validateOrderStatus(body).errors.length > 0);
});
