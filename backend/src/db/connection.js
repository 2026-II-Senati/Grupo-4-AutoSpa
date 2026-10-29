import { config } from '../config/env.js';
import { sequelize } from './sequelize.js';

const MINIMUM_MYSQL_VERSION = [8, 0, 16];

// Traduce el error de conexión a un mensaje claro. Nunca incluye la contraseña.
export function describeConnectionError(error) {
  const code = error?.parent?.code ?? error?.original?.code ?? error?.code;
  const reasons = {
    ECONNREFUSED: 'el servidor MySQL no responde. Comprueba que MySQL esté encendido y que DB_HOST y DB_PORT sean correctos.',
    ENOTFOUND: 'no se encontró el servidor indicado en DB_HOST.',
    ETIMEDOUT: 'se agotó el tiempo de espera al conectar con MySQL.',
    ER_ACCESS_DENIED_ERROR: 'usuario o contraseña incorrectos. Revisa DB_USER y DB_PASSWORD en backend/.env.',
    ER_BAD_DB_ERROR: `la base de datos "${config.db.name}" no existe. Ejecuta: npm run db:create`,
    ER_DBACCESS_DENIED_ERROR: `el usuario "${config.db.user}" no tiene permisos sobre la base "${config.db.name}".`,
  };
  const reason = reasons[code] ?? `error ${code ?? error?.name ?? 'desconocido'}.`;
  const text =
    `No se pudo conectar a MySQL (${config.db.host}:${config.db.port}, base "${config.db.name}", ` +
    `usuario "${config.db.user}"): ${reason}`;

  // Protección adicional: si por algún motivo el texto incluyera la contraseña, se oculta.
  return config.db.password ? text.split(config.db.password).join('****') : text;
}

function isSupportedVersion(versionText) {
  if (/mariadb/i.test(versionText)) return false;
  const parts = versionText.split(/[.-]/).slice(0, 3).map(Number);
  for (let i = 0; i < 3; i += 1) {
    if (parts[i] > MINIMUM_MYSQL_VERSION[i]) return true;
    if (parts[i] < MINIMUM_MYSQL_VERSION[i]) return false;
  }
  return true;
}

export async function verifyDatabaseConnection() {
  let version;

  try {
    await sequelize.authenticate();

    const [rows] = await sequelize.query(
      'SELECT VERSION() AS version',
    );

    version = rows[0].version;
  } catch (error) {
    throw new Error(describeConnectionError(error));
  }

  // Fuera del catch para conservar el mensaje de incompatibilidad.
  if (!isSupportedVersion(version)) {
    throw new Error(
      `Motor o versión no compatible: ${version}. ` +
      'AutoSpa requiere MySQL 8.0.16 o posterior. ' +
      'MariaDB no está admitido en este proyecto.',
    );
  }

  return version;
}