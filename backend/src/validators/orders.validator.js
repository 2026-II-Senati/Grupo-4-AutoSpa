
const VEHICLE_TYPES = [
  'automovil',
  'suv',
  'camioneta',
  'furgoneta',
  'motocicleta',
];

const VEHICLE_SIZES = ['pequeno', 'mediano', 'grande'];
const DIRT_LEVELS = ['bajo', 'medio', 'alto'];

function optionalText(value, field, maxLength, errors) {
  if (value === undefined || value === null || value === '') return null;

  if (typeof value !== 'string' || value.trim() === '') {
    errors.push({ field, message: 'Ingresa un valor de texto válido.' });
    return null;
  }

  const normalized = value.trim();

  if ([...normalized].length > maxLength) {
    errors.push({
      field,
      message: `Este campo admite hasta ${maxLength} caracteres.`,
    });
    return null;
  }

  return normalized;
}

function optionalEnum(value, field, allowed, errors) {
  if (value === undefined || value === null || value === '') return null;

  if (typeof value !== 'string' || !allowed.includes(value)) {
    errors.push({ field, message: 'Selecciona una opción válida.' });
    return null;
  }

  return value;
}

function optionalBoolean(value, field, errors) {
  if (value === undefined) return false;

  if (typeof value !== 'boolean') {
    errors.push({ field, message: 'Este campo debe ser verdadero o falso.' });
    return false;
  }

  return value;
}


function optionalDiscount(value, errors) {
  if (value === undefined || value === null || value === '') return 0;

  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < 0 ||
    !/^\d+(\.\d{1,2})?$/.test(String(value))
  ) {
    errors.push({
      field: 'discountAmount',
      message: 'El descuento debe ser un importe válido con máximo dos decimales.',
    });
    return 0;
  }

  return value;
}


export function validateOrder(body) {
  const errors = [];

  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return {
      data: null,
      errors: [{
        field: 'body',
        message: 'Envía un objeto JSON con los datos de la orden.',
      }],
    };
  }

  const allowedFields = [
    'plate',
    'customerName',
    'customerPhone',
    'serviceId',
    'vehicleBrand',
    'vehicleModel',
    'vehicleType',
    'vehicleSize',
    'dirtLevel',
    'extraVacuum',
    'extraWaxing',
    'engineCleaning',
    'discountAmount',
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
    customerName = body.customerName.trim();

    if ([...customerName].length > 100) {
      errors.push({
        field: 'customerName',
        message: 'El nombre del cliente admite hasta 100 caracteres.',
      });
    }
  }

  if (body.customerPhone !== undefined && body.customerPhone !== null) {
    if (typeof body.customerPhone !== 'string') {
      errors.push({
        field: 'customerPhone',
        message: 'Ingresa un teléfono válido.',
      });
    } else {
      const value = body.customerPhone.trim();

      if (value !== '') {
        if (/^\+?[0-9]{7,15}$/.test(value)) {
          customerPhone = value;
        } else {
          errors.push({
            field: 'customerPhone',
            message: 'Ingresa un teléfono de 7 a 15 dígitos.',
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

  const vehicleBrand = optionalText(body.vehicleBrand, 'vehicleBrand', 80, errors);
  const vehicleModel = optionalText(body.vehicleModel, 'vehicleModel', 80, errors);
  const vehicleType = optionalEnum(body.vehicleType, 'vehicleType', VEHICLE_TYPES, errors);
  const vehicleSize = optionalEnum(body.vehicleSize, 'vehicleSize', VEHICLE_SIZES, errors);
  const dirtLevel = optionalEnum(body.dirtLevel, 'dirtLevel', DIRT_LEVELS, errors);

  const extraVacuum = optionalBoolean(body.extraVacuum, 'extraVacuum', errors);
  const extraWaxing = optionalBoolean(body.extraWaxing, 'extraWaxing', errors);
  const engineCleaning = optionalBoolean(body.engineCleaning, 'engineCleaning', errors);
  const discountAmount = optionalDiscount(body.discountAmount, errors);

  errors.sort((a, b) =>
    a.field < b.field ? -1 : a.field > b.field ? 1 : 0,
  );

  if (errors.length > 0) return { data: null, errors };

  return {
    data: {
      plate,
      customerName,
      customerPhone,
      serviceId: body.serviceId,
      vehicleBrand,
      vehicleModel,
      vehicleType,
      vehicleSize,
      dirtLevel,
      extraVacuum,
      extraWaxing,
      engineCleaning,
      discountAmount,
    },
    errors: [],
  };
}
