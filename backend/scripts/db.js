// Comandos para preparar la base de datos de AutoSpa. Se usan mediante npm run db:...
// Ver backend/README.md, sección "Base de datos".
import { Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';
import { config } from '../src/config/env.js';
import { describeConnectionError, verifyDatabaseConnection } from '../src/db/connection.js';
import { migrations } from '../src/db/migrations/index.js';
import { seeders } from '../src/db/seeders/index.js';
import { sequelize } from '../src/db/sequelize.js';

const logger = { info: () => {}, warn: console.warn, error: console.error, debug: () => {} };

function createRunner(list, tableName) {
  return new Umzug({
    migrations: list.map(({ name, up, down }) => ({
      name,
      up: () => up({ context: sequelize }),
      down: () => down({ context: sequelize }),
    })),
    context: sequelize,
    storage: new SequelizeStorage({ sequelize, tableName }),
    logger,
  });
}

const migrator = createRunner(migrations, 'sequelize_meta');
const seeder = createRunner(seeders, 'sequelize_seeds');

function printNames(title, items) {
  console.log(title);
  if (items.length === 0) console.log('  (ninguna)');
  for (const item of items) console.log(`  - ${item.name}`);
}

async function createDatabase() {
  // Se conecta sin elegir base para poder crearla.
  const admin = new Sequelize('', config.db.user, config.db.password, {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    logging: false,
  });
  try {
    await admin.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.db.name.replaceAll('`', '')}\` ` +
        'CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci',
    );
    console.log(`Base de datos "${config.db.name}" lista.`);
  } catch (error) {
    throw new Error(describeConnectionError(error));
  } finally {
    await admin.close();
  }
}

const commands = {
  async create() {
    await createDatabase();
  },
  async check() {
    const version = await verifyDatabaseConnection();
    console.log(`Conexión correcta: MySQL ${version}, base "${config.db.name}".`);
  },
  async migrate() {
    await verifyDatabaseConnection();
    printNames('Migraciones aplicadas:', await migrator.up());
  },
  async 'migrate:undo'() {
    await verifyDatabaseConnection();
    printNames('Migración revertida:', await migrator.down());
  },
  async seed() {
    await verifyDatabaseConnection();
    printNames('Datos iniciales cargados:', await seeder.up());
  },
  async 'seed:undo'() {
    await verifyDatabaseConnection();
    printNames('Datos iniciales retirados:', await seeder.down({ to: 0 }));
  },
  async reset() {
    // Deja la base vacía y vuelve a crear tablas y datos iniciales.
    await verifyDatabaseConnection();
    printNames('Datos iniciales retirados:', await seeder.down({ to: 0 }));
    printNames('Migraciones revertidas:', await migrator.down({ to: 0 }));
    printNames('Migraciones aplicadas:', await migrator.up());
    printNames('Datos iniciales cargados:', await seeder.up());
  },
  async status() {
    await verifyDatabaseConnection();
    printNames('Migraciones aplicadas:', await migrator.executed());
    printNames('Migraciones pendientes:', await migrator.pending());
    printNames('Datos iniciales cargados:', await seeder.executed());
    printNames('Datos iniciales pendientes:', await seeder.pending());
  },
};

const commandName = process.argv[2];
const command = commands[commandName];

if (!command) {
  console.error(`Comando desconocido: ${commandName ?? '(vacío)'}. Opciones: ${Object.keys(commands).join(', ')}`);
  process.exit(1);
}

try {
  await command();
} catch (error) {
  // Los errores de SQL se muestran con su código, sin datos de conexión.
  const sqlCode = error?.parent?.code ?? error?.original?.code;
  const detail = sqlCode ? ` (${sqlCode}: ${error.parent?.sqlMessage ?? error.message})` : '';
  console.error(`Error en "${commandName}": ${error.message}${detail}`);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
