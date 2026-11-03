import { sequelize } from '../db/sequelize.js';
import { Order, ORDER_STATUSES, ACTIVE_ORDER_STATUSES } from './order.model.js';
import { Service } from './service.model.js';
import { OrderStatusChange } from './order-status-change.model.js';

// Un servicio tiene cero o muchas órdenes; cada orden tiene exactamente un servicio.
Service.hasMany(Order, { foreignKey: 'serviceId', as: 'orders' });
Order.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });
Order.hasMany(OrderStatusChange, { foreignKey: 'orderId', as: 'statusChanges' });
OrderStatusChange.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

export { sequelize, Service, Order, OrderStatusChange, ORDER_STATUSES, ACTIVE_ORDER_STATUSES };
