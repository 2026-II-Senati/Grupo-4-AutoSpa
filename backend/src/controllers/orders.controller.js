import { validateOrder } from '../validators/orders.validator.js';
import { registerOrder } from '../services/orders.service.js';

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

    const order = await registerOrder(data);

    return res.status(201).json({
      data: order,
    });
  } catch (error) {
    next(error);
  }
}