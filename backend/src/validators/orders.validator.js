export function validateOrder(body) {
  const errors = [];

  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return {
      data: null,
      errors: [
        {
          field: 'body',
          message: 'Envía un objeto JSON con los datos de la orden.',
        },
      ],
    };
  }

  const allowedFields = [
    'plate',
    'customerName',
    'customerPhone',
    'serviceId',
  ];

  for (const field of Object.keys(body)) {
    if (!allowedFields.includes(field)) {
      errors.push({
        field,
        message: 'Este campo no está permitido.',
      });
    }
  }

  let plate = null;
  let customerName = null;
  let customerPhone = null;

  if (typeof body.plate === 'string') {
    const value = body.plate.trim().toUpperCase();

    if (/^[A-Z0-9]{3}-?[0-9]{3}$/.test(value)) {
      plate = value.replace('-', '');
    }
  }

  if (plate === null) {
    errors.push({
      field: 'plate',
      message: 'Ingresa una placa válida de seis caracteres.',
    });
  }

  if (
    typeof body.customerName !== 'string' ||
    body.customerName.trim() === ''
  ) {
    errors.push({
      field: 'customerName',
      message: 'Ingresa el nombre del cliente.',
    });
  } else {
    const value = body.customerName.trim();

    if ([...value].length > 100) {
      errors.push({
        field: 'customerName',
        message: 'El nombre del cliente admite hasta 100 caracteres.',
      });
    } else {
      customerName = value;
    }
  }

  if (body.customerPhone !== undefined && body.customerPhone !== null) {
    if (typeof body.customerPhone !== 'string') {
      errors.push({
        field: 'customerPhone',
        message:
          'Ingresa un teléfono de 7 a 15 dígitos, con + inicial opcional.',
      });
    } else {
      const value = body.customerPhone.trim();

      if (value !== '') {
        if (/^\+?[0-9]{7,15}$/.test(value)) {
          customerPhone = value;
        } else {
          errors.push({
            field: 'customerPhone',
            message:
              'Ingresa un teléfono de 7 a 15 dígitos, con + inicial opcional.',
          });
        }
      }
    }
  }

  if (
    typeof body.serviceId !== 'number' ||
    !Number.isInteger(body.serviceId) ||
    body.serviceId < 1 ||
    body.serviceId > 4294967295
  ) {
    errors.push({
      field: 'serviceId',
      message: 'Selecciona un servicio válido.',
    });
  }

  errors.sort((a, b) =>
    a.field < b.field ? -1 : a.field > b.field ? 1 : 0,
  );

  if (errors.length > 0) {
    return { data: null, errors };
  }

  return {
    data: {
      plate,
      customerName,
      customerPhone,
      serviceId: body.serviceId,
    },
    errors: [],
  };
}