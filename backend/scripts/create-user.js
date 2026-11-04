import { User } from '../src/models/index.js';
import { hashPassword } from '../src/services/password-hash.js';
import { sequelize } from '../src/db/sequelize.js';

const name = (process.env.AUTOSPA_USER_NAME ?? '').trim();
const email = (process.env.AUTOSPA_USER_EMAIL ?? '').trim().toLowerCase();
const password = process.env.AUTOSPA_USER_PASSWORD;

if (
  name.length === 0 ||
  name.length > 100 ||
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
  email.length > 254 ||
  typeof password !== 'string' ||
  password.length === 0
) {
  console.error(
    'Define AUTOSPA_USER_NAME, AUTOSPA_USER_EMAIL y AUTOSPA_USER_PASSWORD válidos en el entorno.',
  );
  process.exitCode = 1;
} else {
  try {
    const user = await User.create({
      name,
      email,
      passwordHash: await hashPassword(password),
      isActive: true,
    });
    console.log(`Usuario ${user.id} creado para ${user.email}.`);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.error('Ya existe una cuenta con ese correo.');
    } else {
      console.error(`No se pudo crear el usuario: ${error.message}`);
    }
    process.exitCode = 1;
  }
}

await sequelize.close();
