import { Op } from 'sequelize';
import { Order, OrderStatusChange, ACTIVE_ORDER_STATUSES } from '../models/index.js';
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

export function findOrderForUpdate(id, transaction) {
  return Order.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
}

export async function saveStatusChange(order, { fromStatus, status, userId, reason, changedAt }, transaction) {
  order.status = status;
  order.updatedAt = changedAt;
  await order.save({ transaction, fields: ['status', 'updatedAt'] });
  await OrderStatusChange.create({ orderId: order.id, fromStatus, toStatus: status, changedByUserId: userId, changedAt, reason }, { transaction });
  return order;
}
