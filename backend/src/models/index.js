import { sequelize } from '../db/sequelize.js';
import { Order, ORDER_STATUSES, ACTIVE_ORDER_STATUSES } from './order.model.js';
import { Service } from './service.model.js';

// Un servicio tiene cero o muchas órdenes; cada orden tiene exactamente un servicio.
Service.hasMany(Order, { foreignKey: 'serviceId', as: 'orders' });
Order.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });

export { sequelize, Service, Order, ORDER_STATUSES, ACTIVE_ORDER_STATUSES };
