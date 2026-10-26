import { validateOrder } from '../validators/orders.validator.js';

export async function createOrder(req, res) {
  try {
    const { data, errors } = validateOrder(req.body);

    if (errors && errors.length > 0) {
      return res.status(422).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Revisa los datos de la orden.',
          details: errors
        }
      });
    }


    return res.status(503).json({
      error: {
        code: 'TEMPORARILY_UNAVAILABLE',
        message: 'El servicio de registro de órdenes no está disponible temporalmente.'
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Ocurrió un error inesperado en el servidor.'
      }
    });
  }
}