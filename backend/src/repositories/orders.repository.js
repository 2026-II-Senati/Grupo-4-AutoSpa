import { Op } from 'sequelize';
import { Order, ACTIVE_ORDER_STATUSES } from '../models/index.js';
import { presentOrder } from '../services/order-response.js';

export async function findActiveOrders() {
  const orders = await Order.findAll({
    attributes: [
      'id',
      'plate',
      'customerName',
      'customerPhone',
      'serviceId',
      'serviceName',
      'servicePrice',
      'status',
      'createdAt',
      'updatedAt',
    ],
    where: { status: { [Op.in]: [...ACTIVE_ORDER_STATUSES] } },
    order: [['createdAt', 'ASC'], ['id', 'ASC']],
    raw: true,
  });

  return orders.map(presentOrder);
}
