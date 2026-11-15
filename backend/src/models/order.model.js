
import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js';

export const ORDER_STATUSES = ['waiting', 'washing', 'ready', 'delivered', 'cancelled'];
export const ACTIVE_ORDER_STATUSES = ['waiting', 'washing', 'ready'];

// Los datos del servicio son copias históricas.
// active_plate la genera MySQL y no se define aquí.
export const Order = sequelize.define(
  'Order',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    plate: { type: DataTypes.STRING(6), allowNull: false },
    customerName: { type: DataTypes.STRING(100), allowNull: false },
    customerPhone: { type: DataTypes.STRING(16), allowNull: true },

    vehicleBrand: { type: DataTypes.STRING(80), allowNull: true },
    vehicleModel: { type: DataTypes.STRING(80), allowNull: true },
    vehicleType: { type: DataTypes.STRING(20), allowNull: true },
    vehicleSize: { type: DataTypes.STRING(10), allowNull: true },
    dirtLevel: { type: DataTypes.STRING(10), allowNull: true },

    serviceId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    serviceName: { type: DataTypes.STRING(100), allowNull: false },
    servicePrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    finalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },

    extraVacuum: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    extraWaxing: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    engineCleaning: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    createdByUserId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
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
