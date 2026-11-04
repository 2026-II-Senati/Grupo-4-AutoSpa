import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js';

export const OrderStatusChange = sequelize.define('OrderStatusChange', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  orderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  fromStatus: { type: DataTypes.STRING(20), allowNull: false },
  toStatus: { type: DataTypes.STRING(20), allowNull: false },
  changedByUserId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  changedAt: { type: DataTypes.DATE(3), allowNull: false },
  reason: { type: DataTypes.STRING(255), allowNull: true },
}, { tableName: 'order_status_changes', timestamps: false });
