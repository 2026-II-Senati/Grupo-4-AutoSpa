import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js';

export const ORDER_STATUSES = ['waiting', 'washing', 'ready', 'delivered', 'cancelled'];
export const ACTIVE_ORDER_STATUSES = ['waiting', 'washing', 'ready'];

// Tabla orders (docs/modelo-datos.md, sección 4).
// serviceName y servicePrice son copias del servicio al crear la orden: no cambian si se edita el catálogo.
// La columna active_plate la calcula MySQL (columna generada); no se define aquí ni se escribe desde Node.
export const Order = sequelize.define(
  'Order',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    plate: { type: DataTypes.STRING(6), allowNull: false },
    customerName: { type: DataTypes.STRING(100), allowNull: false },
    customerPhone: { type: DataTypes.STRING(16), allowNull: true },
    serviceId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    serviceName: { type: DataTypes.STRING(100), allowNull: false },
    servicePrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'waiting',
      validate: { isIn: [ORDER_STATUSES] },
    },
    createdAt: { type: DataTypes.DATE(3), allowNull: false },
    updatedAt: { type: DataTypes.DATE(3), allowNull: false },
  },
  { tableName: 'orders' },
);
