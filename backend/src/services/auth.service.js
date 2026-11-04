import { User } from '../models/index.js';
import { verifyPassword } from './password-hash.js';

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export async function authenticateUser(email, password) {
  if (typeof email !== 'string' || typeof password !== 'string') {
    return null;
  }

  const user = await User.findOne({
    attributes: ['id', 'name', 'email', 'passwordHash', 'isActive'],
    where: { email: normalizeEmail(email) },
  });

  if (!user || !user.isActive || !(await verifyPassword(password, user.passwordHash))) {
    return null;
  }

  return presentUser(user);
}

export function presentUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}
