const STATUSES = ['waiting', 'washing', 'ready', 'delivered', 'cancelled'];
const NEXT = { waiting: ['washing', 'cancelled'], washing: ['ready'], ready: ['delivered'] };

export function validateOrderStatus(body) {
  const errors = [];
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { data: null, errors: [{ field: 'body', message: 'Envía un objeto JSON con el estado esperado y el nuevo estado.' }] };
  for (const field of Object.keys(body)) if (!['expectedStatus', 'status', 'reason'].includes(field)) errors.push({ field, message: 'Este campo no está permitido.' });
  for (const field of ['expectedStatus', 'status']) if (typeof body[field] !== 'string' || !STATUSES.includes(body[field])) errors.push({ field, message: 'Indica un estado válido.' });
  let reason = null;
  if (body.status === 'cancelled') {
    if (typeof body.reason !== 'string') errors.push({ field: 'reason', message: 'El motivo es obligatorio para cancelar.' });
    else { reason = body.reason.trim(); if ([...reason].length < 1 || [...reason].length > 255) errors.push({ field: 'reason', message: 'El motivo debe tener entre 1 y 255 caracteres.' }); }
  } else if (Object.hasOwn(body, 'reason')) errors.push({ field: 'reason', message: 'El motivo solo se permite al cancelar.' });
  if (errors.length) return { data: null, errors: errors.sort((a, b) => a.field.localeCompare(b.field)) };
  return { data: { expectedStatus: body.expectedStatus, status: body.status, reason }, errors };
}

export function isAllowedOrderTransition(from, to) { return NEXT[from]?.includes(to) ?? false; }
