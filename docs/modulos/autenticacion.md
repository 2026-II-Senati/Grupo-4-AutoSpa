# Autenticación del personal

La autenticación usa sesiones de servidor con la cookie `autospa.sid` (`HttpOnly`, `SameSite=Lax`). La firma se configura en `backend/.env` con `SESSION_SECRET` (mínimo 32 caracteres); no se debe compartir ni guardar el valor real en Git. En producción, el cookie se marca `Secure`. Las sesiones se guardan en memoria: se invalidan al reiniciar el backend y no se comparten entre varias instancias.

Las cuentas las crea el equipo localmente, no hay registro público. Ejecuta las migraciones desde `backend/`:

```powershell
npm run db:migrate
```

Para crear un usuario de prueba en PowerShell, proporciona los datos solo a la sesión local. La contraseña se solicita como entrada segura y no se guarda en el repositorio:

```powershell
$env:AUTOSPA_USER_NAME = Read-Host "Nombre"
$env:AUTOSPA_USER_EMAIL = Read-Host "Correo"
$securePassword = Read-Host "Contraseña de prueba" -AsSecureString
$env:AUTOSPA_USER_PASSWORD = (New-Object System.Net.NetworkCredential("", $securePassword)).Password
try {
    npm run user:create
} finally {
    Remove-Item Env:AUTOSPA_USER_NAME, Env:AUTOSPA_USER_EMAIL, Env:AUTOSPA_USER_PASSWORD -ErrorAction SilentlyContinue
    Remove-Variable securePassword -ErrorAction SilentlyContinue
}
```

El correo se recorta y se convierte a minúsculas. La contraseña se guarda únicamente como hash scrypt. La API nunca devuelve el hash.

## Endpoints

- `POST /api/auth/login`: recibe `{"email":"personal@example.com","password":"..."}`. Normaliza el correo, pero comprueba la contraseña sin modificarla. Devuelve HTTP 200 con `{"data":{"id":1,"name":"Usuario","email":"personal@example.com"}}` y establece la cookie de sesión. Credenciales incorrectas y cuentas inactivas reciben HTTP 401 (`INVALID_CREDENTIALS`).
- `GET /api/auth/me`: requiere sesión; devuelve el usuario de sesión con `id`, `name` y `email`. Sin sesión recibe HTTP 401.
- `POST /api/auth/logout`: destruye la sesión y devuelve HTTP 200 con `{"data":null}`.
- `GET /api/orders`: ruta existente protegida de demostración. Sin sesión recibe HTTP 401 (`AUTHENTICATION_REQUIRED`).

## Comprobación con curl

Desde PowerShell, mantén la cookie en un archivo local para las solicitudes autenticadas:

```powershell
curl.exe -i -c cookies.txt -H "Content-Type: application/json" `
  -d '{"email":"personal@example.com","password":"contraseña-local"}' `
  http://localhost:3001/api/auth/login
curl.exe -i -b cookies.txt http://localhost:3001/api/auth/me
curl.exe -i -b cookies.txt http://localhost:3001/api/orders
curl.exe -i -b cookies.txt -X POST http://localhost:3001/api/auth/logout
curl.exe -i -b cookies.txt http://localhost:3001/api/orders
```

La última solicitud debe responder HTTP 401. El archivo `cookies.txt` y la contraseña son locales; no los agregues al repositorio.

## Protección de rutas

Importa el middleware compartido `requireAuth` de `backend/src/middleware/require-auth.js`. Valida que haya una sesión con un usuario activo y expone únicamente `id`, `name` y `email` en `req.user`; la identidad no se toma del cuerpo, parámetros ni cabeceras enviadas por el cliente.

```js
import { requireAuth } from '../middleware/require-auth.js';

router.get('/operacion', requireAuth, (req, res) => {
  res.json({ data: { userId: req.user.id } });
});
```
