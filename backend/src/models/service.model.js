import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js';

// Tabla services (docs/modelo-datos.md, sección 3). La estructura real la crean las migraciones.
export const Service = sequelize.define(
  'Service',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.STRING(255), allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: { type: DataTypes.DATE(3), allowNull: false },
    updatedAt: { type: DataTypes.DATE(3), allowNull: false },
  },
  { tableName: 'services' },
);
