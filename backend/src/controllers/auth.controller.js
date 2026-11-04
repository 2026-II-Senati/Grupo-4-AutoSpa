import { authenticateUser, presentUser } from '../services/auth.service.js';
import { SESSION_COOKIE_NAME, clearSessionCookie } from '../session.js';

function regenerateSession(session) {
  return new Promise((resolve, reject) => {
    session.regenerate((error) => (error ? reject(error) : resolve()));
  });
}

function saveSession(session) {
  return new Promise((resolve, reject) => {
    session.save((error) => (error ? reject(error) : resolve()));
  });
}

export async function login(request, response, next) {
  try {
    const user = await authenticateUser(request.body?.email, request.body?.password);
    if (!user) {
      return response.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Correo o contraseña incorrectos.',
          details: [],
        },
      });
    }

    await regenerateSession(request.session);
    request.session.userId = user.id;
    await saveSession(request.session);

    return response.status(200).json({ data: user });
  } catch (error) {
    return next(error);
  }
}

export function me(request, response) {
  return response.status(200).json({ data: presentUser(request.user) });
}

export async function logout(request, response, next) {
  try {
    if (request.session) {
      await new Promise((resolve, reject) => {
        request.session.destroy((error) => (error ? reject(error) : resolve()));
      });
    }

    response.clearCookie(SESSION_COOKIE_NAME, clearSessionCookie);
    return response.status(200).json({ data: null });
  } catch (error) {
    return next(error);
  }
}
