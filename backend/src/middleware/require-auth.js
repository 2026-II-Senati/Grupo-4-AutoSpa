import { User } from '../models/index.js';
import { SESSION_COOKIE_NAME, clearSessionCookie } from '../session.js';

function unauthorized(response) {
  response.clearCookie(SESSION_COOKIE_NAME, clearSessionCookie);
  return response.status(401).json({
    error: {
      code: 'AUTHENTICATION_REQUIRED',
      message: 'Inicia sesión para continuar.',
      details: [],
    },
  });
}

export async function requireAuth(request, response, next) {
  try {
    const userId = request.session?.userId;
    if (!userId) {
      return unauthorized(response);
    }

    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'isActive'],
    });

    if (!user || !user.isActive) {
      if (request.session) {
        await new Promise((resolve, reject) => {
          request.session.destroy((error) => (error ? reject(error) : resolve()));
        });
      }
      return unauthorized(response);
    }

    request.user = { id: user.id, name: user.name, email: user.email };
    return next();
  } catch (error) {
    return next(error);
  }
}
