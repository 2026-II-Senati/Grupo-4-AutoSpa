export function requireAuth(req, _res, next) {
  if (!req.user && !req.auth?.user) { const error = new Error('La sesión no es válida.'); error.httpStatus = 401; error.apiCode = 'UNAUTHORIZED'; return next(error); }
  return next();
}
