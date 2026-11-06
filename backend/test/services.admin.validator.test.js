import test from 'node:test';
import assert from 'node:assert/strict';
import { validateServiceCreate, validateServicePatch } from '../src/validators/services.validator.js';

test('PFA-18 acepta un servicio válido y lo inicia activo en el servicio', () => {
  const result = validateServiceCreate({ name: ' Lavado completo ', description: '', price: '35.00' });
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.value, { name: 'Lavado completo', description: null, price: '35.00' });
});

test('PFA-18 rechaza campos desconocidos y precios inválidos', () => {
  const result = validateServiceCreate({ name: 'x', price: '0.00', extra: true });
  assert.equal(result.errors.length, 2);
  assert.equal(result.errors[0].field, 'extra');
  assert.equal(result.errors[1].field, 'price');
});

test('PFA-18 permite PATCH parcial de disponibilidad', () => {
  const result = validateServicePatch({ isActive: false });
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.value, { isActive: false });
});

test('PFA-18 exige al menos un campo y valida isActive', () => {
  assert.equal(validateServicePatch({}).errors[0].field, 'body');
  assert.equal(validateServicePatch({ isActive: 'false' }).errors[0].field, 'isActive');
});
