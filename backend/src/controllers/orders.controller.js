import { validateOrder } from '../validators/orders.validator.js';
import { registerOrder, listActiveOrders, updateOrderStatus } from '../services/orders.service.js';
import { validateOrderStatus } from '../validators/order-status.validator.js';

export async function createOrder(req, res, next) {
  try {
    if (!Number.isInteger(req.user?.id) || req.user.id < 1) return unauthorized(res);
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

    const order = await registerOrder(data, req.user.id);

    return res.status(201).json({
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

function unauthorized(res) {
  return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Inicia sesión para realizar esta operación.', details: [] } });
}

export async function patchOrderStatus(req, res, next) {
  try {
    if (!Number.isInteger(req.user?.id) || req.user.id < 1) return unauthorized(res);
    if (!/^[1-9][0-9]*$/.test(req.params.id) || Number(req.params.id) > 4294967295) {
      return res.status(422).json({ error: { code: 'VALIDATION_ERROR', message: 'Revisa los datos de la orden.', details: [{ field: 'id', message: 'Indica un identificador válido.' }] } });
    }
    const { data, errors } = validateOrderStatus(req.body);
    if (errors.length) return res.status(422).json({ error: { code: 'VALIDATION_ERROR', message: 'Revisa los datos de la orden.', details: errors } });
    return res.status(200).json({ data: await updateOrderStatus(Number(req.params.id), data, req.user.id) });
  } catch (error) { next(error); }
}

export async function getActiveOrders(_request, response, next) {
  try {
    const orders = await listActiveOrders();
    response.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
}
