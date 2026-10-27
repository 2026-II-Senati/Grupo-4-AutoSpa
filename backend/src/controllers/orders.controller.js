import { validateOrder } from '../validators/orders.validator.js';

export async function createOrder(req, res, next) {
  try {
    const { data, errors } = validateOrder(req.body);

    if (errors.length > 0) {
      return res.status(422).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Revisa los datos de la orden.',
          details: errors,
        },
      });
    }


    return res.status(503).json({
      error: {
        code: 'TEMPORARILY_UNAVAILABLE',
        message:
          'El servicio no está disponible temporalmente. Inténtalo nuevamente.',
        details: [],
      },
    });
  } catch (error) {
    next(error);
  }
}