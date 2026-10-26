import { createDemoOrder, getDemoOrders, getDemoServices } from './mockOrdersApi.js';

const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true'
  || (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API !== 'false');

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`/api${path}`, {
      ...options,
      headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Comprueba que el backend esté disponible.');
  }

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body.error?.message || body.message || (response.status === 409
      ? 'La placa ya tiene una orden activa.'
      : `No se pudo completar la solicitud (HTTP ${response.status}).`);
    throw new Error(message);
  }
  return body.data;
}

export function getServices() {
  return useMockApi ? getDemoServices() : request('/services');
}

export function getOrders() {
  return useMockApi ? getDemoOrders() : request('/orders');
}

export function createOrder(order) {
  return useMockApi
    ? createDemoOrder(order)
    : request('/orders', { method: 'POST', body: JSON.stringify(order) });
}

export function isUsingMockApi() {
  return useMockApi;
}

export function getApiErrorMessage(error) {
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado. Inténtalo nuevamente.';
}
