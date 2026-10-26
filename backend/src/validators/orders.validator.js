export function validateOrder(body) {
  const errors = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {
      data: null,
      errors: [{ field: 'body', message: 'El cuerpo de la petición debe ser un objeto JSON válido' }]
    };
  }

  const allowedFields = ['plate', 'customerName', 'customerPhone', 'serviceId'];
  const receivedFields = Object.keys(body);

  for (const field of receivedFields) {
    if (!allowedFields.includes(field)) {
      errors.push({ field, message: `El campo '${field}' no está permitido` });
    }
  }

  let normalizedPlate = null;
  let normalizedName = null;
  let normalizedPhone = null;
  let normalizedServiceId = null;

+  if (body.plate === undefined || body.plate === null || typeof body.plate !== 'string' || body.plate.trim() === '') {
    errors.push({ field: 'plate', message: 'La placa es obligatoria y debe ser un texto no vacío' });
  } else {
    normalizedPlate = body.plate.trim().toUpperCase();
  }

  if (body.customerName === undefined || body.customerName === null || typeof body.customerName !== 'string') {
    errors.push({ field: 'customerName', message: 'El nombre del cliente es obligatorio' });
  } else {
    const trimmedName = body.customerName.trim();
    if (trimmedName.length < 1 || trimmedName.length > 100) {
      errors.push({ field: 'customerName', message: 'El nombre del cliente debe tener entre 1 y 100 caracteres' });
    } else {
      normalizedName = trimmedName;
    }
  }

  if (body.customerPhone === undefined || body.customerPhone === null) {
    normalizedPhone = null;
  } else if (typeof body.customerPhone === 'string') {
    const trimmedPhone = body.customerPhone.trim();
    normalizedPhone = trimmedPhone === '' ? null : trimmedPhone;
  } else {
    errors.push({ field: 'customerPhone', message: 'El teléfono del cliente debe ser un texto' });
  }

  if (body.serviceId === undefined || body.serviceId === null) {
    errors.push({ field: 'serviceId', message: 'El ID del servicio es obligatorio' });
  } else {
    const serviceId = Number(body.serviceId);
    if (!Number.isInteger(serviceId) || serviceId <= 0 || serviceId > 4294967295) {
      errors.push({ field: 'serviceId', message: 'El ID del servicio debe ser un número entero positivo válido' });
    } else {
      normalizedServiceId = serviceId;
    }
  }

  if (errors.length > 0) {
    return { data: null, errors };
  }

  return {
    data: {
      plate: normalizedPlate,
      customerName: normalizedName,
      customerPhone: normalizedPhone,
      serviceId: normalizedServiceId
    },
    errors: []
  };
}