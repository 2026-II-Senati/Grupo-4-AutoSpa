import { Op } from 'sequelize';
import { ACTIVE_ORDER_STATUSES } from '../config/order-statuses.js';
import { Order } from '../models/index.js';

function presentOrder(order) {
  return {
    id: Number(order.id),
    licensePlate: order.licensePlate,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    serviceId: Number(order.serviceId),
    serviceName: order.serviceName,
    price: Number(order.servicePrice),
    status: order.status,
    enteredAt: new Date(order.enteredAt).toISOString(),
  };
}

export async function findActiveOrders() {
  const orders = await Order.findAll({
    attributes: [
      'id',
      'licensePlate',
      'customerName',
      'customerPhone',
      'serviceId',
      'serviceName',
      'servicePrice',
      'status',
      'enteredAt',
    ],
    where: { status: { [Op.in]: [...ACTIVE_ORDER_STATUSES] } },
    order: [['enteredAt', 'ASC'], ['id', 'ASC']],
    raw: true,
  });

  return orders.map(presentOrder);
}
