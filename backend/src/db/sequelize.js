import { Sequelize } from 'sequelize';
import { config } from '../config/env.js';

// Única instancia de Sequelize del backend.
// timezone '+00:00': las fechas se guardan y se leen en UTC, como indica docs/modelo-datos.md.
export const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: 'mysql',
  timezone: '+00:00',
  logging: config.db.logging ? console.log : false,
  define: {
    underscored: true,
    timestamps: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci',
  },
  dialectOptions: {
    charset: 'utf8mb4',
    // DECIMAL llega como string ("20.00") para no perder precisión en los importes.
    decimalNumbers: false,
  },
  pool: { max: 5, min: 0, idle: 10000 },
});
