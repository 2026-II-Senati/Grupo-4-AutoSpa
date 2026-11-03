function detail(field, message) { return { field, message }; }

export function validateServiceCreate(body) {
  const details = [];
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { errors: [detail('body', 'Envía un objeto JSON con los datos del servicio.')] };
  const allowed = new Set(['name', 'description', 'price']);
  for (const key of Object.keys(body)) if (!allowed.has(key)) details.push(detail(key, 'Este campo no está permitido.'));
  if (typeof body.name !== 'string' || body.name.trim().length < 1 || body.name.trim().length > 100) details.push(detail('name', 'El nombre debe tener entre 1 y 100 caracteres.'));
  if (body.description !== undefined && body.description !== null && (typeof body.description !== 'string' || body.description.length > 255)) details.push(detail('description', 'La descripción admite hasta 255 caracteres.'));
  if (typeof body.price !== 'string' || !/^\d{1,8}\.\d{2}$/.test(body.price) || Number(body.price) < 0.01 || Number(body.price) > 99999999.99) details.push(detail('price', 'El precio debe ser decimal con dos decimales entre 0.01 y 99999999.99.'));
  return { errors: details, value: { name: body.name?.trim(), description: body.description === '' || body.description === undefined ? null : body.description, price: body.price } };
}

export function validateServicePatch(body) {
  const allowed = new Set(['name', 'description', 'price', 'isActive']);
  const details = [];
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { errors: [detail('body', 'Envía un objeto JSON con los cambios.')] };
  if (!Object.keys(body).length) details.push(detail('body', 'Envía al menos un campo permitido.'));
  for (const key of Object.keys(body)) if (!allowed.has(key)) details.push(detail(key, 'Este campo no está permitido.'));
  if ('name' in body && (typeof body.name !== 'string' || body.name.trim().length < 1 || body.name.trim().length > 100)) details.push(detail('name', 'El nombre debe tener entre 1 y 100 caracteres.'));
  if ('description' in body && body.description !== null && (typeof body.description !== 'string' || body.description.length > 255)) details.push(detail('description', 'La descripción admite hasta 255 caracteres.'));
  if ('price' in body && (typeof body.price !== 'string' || !/^\d{1,8}\.\d{2}$/.test(body.price) || Number(body.price) < 0.01 || Number(body.price) > 99999999.99)) details.push(detail('price', 'El precio debe ser decimal con dos decimales entre 0.01 y 99999999.99.'));
  if ('isActive' in body && typeof body.isActive !== 'boolean') details.push(detail('isActive', 'isActive debe ser booleano.'));
  const value = { ...body }; if ('name' in value) value.name = value.name.trim(); if (value.description === '') value.description = null;
  return { errors: details, value };
}
