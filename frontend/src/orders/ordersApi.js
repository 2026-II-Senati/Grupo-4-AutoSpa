const API_URL = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}/api${path}`, {
      ...options,
      headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Comprueba que el backend esté disponible.');
  }

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body.message || body.error || (response.status === 409
      ? 'La placa ya tiene una orden activa.'
      : `No se pudo completar la solicitud (HTTP ${response.status}).`);
    throw new Error(message);
  }
  return body;
}

export async function getServices() {
  const result = await request('/services');
  return Array.isArray(result) ? result : result.services || [];
}

export async function getOrders() {
  const result = await request('/orders');
  return Array.isArray(result) ? result : result.orders || [];
}

export function createOrder(order) {
  return request('/orders', { method: 'POST', body: JSON.stringify(order) });
}

export function getApiErrorMessage(error) {
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado. Inténtalo nuevamente.';
}
