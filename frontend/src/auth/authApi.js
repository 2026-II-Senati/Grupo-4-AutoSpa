async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`/api/auth${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Comprueba que el backend esté disponible.');
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(body?.error?.message || `No se pudo completar la solicitud (HTTP ${response.status}).`);
    error.status = response.status;
    throw error;
  }

  if (!body || !Object.hasOwn(body, 'data')) {
    throw new Error('El servidor devolvió una respuesta inválida.');
  }

  return body.data;
}

export function getCurrentUser() {
  return request('/me');
}

export function login(credentials) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function logout() {
  return request('/logout', { method: 'POST' });
}
