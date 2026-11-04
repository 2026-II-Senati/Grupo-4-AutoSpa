export const SESSION_COOKIE_NAME = 'autospa.sid';

export const clearSessionCookie = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};
