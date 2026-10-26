import { listActiveOrders } from '../services/orders.service.js';

export async function getActiveOrders(_request, response, next) {
  try {
    const orders = await listActiveOrders();
    response.status(200).json(orders);
  } catch (error) {
    next(error);
  }
}
