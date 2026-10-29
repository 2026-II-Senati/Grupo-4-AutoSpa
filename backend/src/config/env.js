import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Carga backend/.env si existe. Las variables ya definidas en el sistema tienen prioridad.
const envPath = fileURLToPath(new URL('../../.env', import.meta.url));
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

const REQUIRED_DB_VARIABLES = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];

const missing = REQUIRED_DB_VARIABLES.filter((name) => process.env[name] === undefined);
if (missing.length > 0) {
  console.error(
    `Faltan variables de entorno de la base de datos: ${missing.join(', ')}. ` +
      'Copia backend/.env.example como backend/.env y completa los valores.',
  );
  process.exit(1);
}

const dbPort = Number(process.env.DB_PORT);
if (!Number.isInteger(dbPort) || dbPort <= 0) {
  console.error('DB_PORT debe ser un número de puerto válido, por ejemplo 3306.');
  process.exit(1);
}

export const config = {
  port: Number(process.env.PORT ?? 3001),
  db: {
    host: process.env.DB_HOST,
    port: dbPort,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: process.env.DB_LOGGING === 'true',
  },
};
