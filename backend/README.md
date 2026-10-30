# Backend de AutoSpa

API de servicios y órdenes con persistencia MySQL; también sirve el frontend compilado. Rutas y respuestas: [contrato API](../docs/api.md). Preparación completa y modos de ejecución: [instalación](../docs/instalacion.md).

## Requisitos

- Node.js 24.22.1
- npm 11.19.1

- MySQL 8.0.16 o posterior (motor InnoDB). Versiones anteriores y MariaDB no aplican todas las restricciones `CHECK` del modelo.

MySQL Server debe estar instalado y ejecutándose. Workbench es una herramienta cliente; abrirlo no inicia necesariamente el servidor. El arranque rechaza MariaDB.

## Instalar y arrancar

Abre una terminal en la carpeta `backend/`. Si es la primera vez que preparas el proyecto, instala las dependencias:

```bash
npm ci
```

Antes de iniciar el servidor, prepara la base de datos siguiendo la sección [Base de datos](#base-de-datos). El backend comprueba la conexión al arrancar; si MySQL no responde, muestra el motivo y se detiene.

Para iniciar únicamente la API, ejecuta:

```bash
npm start
```

El servidor usa `PORT` (3001 por defecto). `npm start` también sirve `frontend/dist/` si ya existe; sin build, se puede consultar la API pero no abrir la interfaz en la raíz.

### Iniciar frontend y API en un solo servidor

Instala las dependencias del frontend una vez desde `frontend/`:

```bash
npm ci
```

Luego vuelve a `backend/` y ejecuta:

```bash
npm run start:app
```

Este comando construye React y Express sirve la interfaz y los endpoints desde el mismo origen: `http://localhost:3001`. Mantén abierta la terminal mientras lo usas.

## Consultar el backend

Con el servidor en marcha, envía una solicitud HTTP `GET` a:

```text
http://localhost:3001/api/health
```

Puedes abrir esa dirección en el navegador o consultarla con Postman. La respuesta esperada es HTTP 200 y este JSON:

```json
{"message":"Backend de AutoSpa disponible"}
```

## Comunicación con el frontend

La interfaz llama las rutas relativas `/api/services`, `/api/orders` y `/api/health`, así que funciona desde el mismo origen cuando se inicia con `npm run start:app`. Durante desarrollo, Vite también puede ejecutarse en `http://localhost:3000` y reenviar `/api` al backend en `3001`.

## Detener el servidor

En la terminal donde ejecutaste `npm start`, pulsa `Ctrl+C`.

## Base de datos

El backend usa **MySQL** con **Sequelize** (modelos en `src/models/`) y **Umzug** para ejecutar migraciones y datos iniciales. El diseño de las tablas está en [`docs/modelo-datos.md`](../docs/modelo-datos.md). En este sprint se crean las tablas `services` y `orders`.

### 1. Configurar la conexión

Crea el archivo solo si no existe y edita los valores localmente, sin sobrescribir una configuración previa:

```powershell
if (-not (Test-Path -LiteralPath .env)) {
    Copy-Item -LiteralPath .env.example -Destination .env
}
```

| Variable | Descripción |
| --- | --- |
| `DB_HOST` / `DB_PORT` | Servidor y puerto de MySQL (normalmente `127.0.0.1` y `3306`) |
| `DB_NAME` | Nombre de la base del proyecto (`autospa`) |
| `DB_USER` / `DB_PASSWORD` | Usuario y contraseña de MySQL |
| `DB_LOGGING` | `true` para ver en consola las consultas SQL |
| `PORT` | Puerto HTTP, 3001 por defecto; ajustar el proxy Vite si se cambia |

Las variables del proceso tienen prioridad sobre `.env`. Para pruebas usar un `DB_NAME` nuevo y exclusivo, y permisos sobre ese nombre.

`backend/.env` contiene tu contraseña: está excluido por `.gitignore` y **no debe subirse**. Si cambias una variable, actualiza también `.env.example` con un valor de ejemplo.

### 2. Crear el usuario de MySQL (una sola vez)

Recomendado: un usuario propio para el proyecto en lugar de `root`. Ejecuta en MySQL Workbench o en el cliente `mysql` como administrador, cambiando la contraseña:

```sql
CREATE USER IF NOT EXISTS 'autospa_app'@'localhost' IDENTIFIED BY 'tu_contrasena';
GRANT ALL PRIVILEGES ON autospa.* TO 'autospa_app'@'localhost';
```

Escribe ese usuario y contraseña en `backend/.env`. El nombre `autospa` es un ejemplo: para una base exclusiva, sustituirlo por el mismo `DB_NAME` en CREATE DATABASE y GRANT. El administrador puede crear la base y conceder permisos solo sobre ella; no se necesitan permisos globales para ejecutar migraciones. Revisar el host de la cuenta si la conexión se rechaza, antes de crear otra cuenta.

### 3. Preparar una base vacía y cargar los datos iniciales

Desde `backend/`:

```bash
npm run db:create    # crea la base autospa (utf8mb4) si no existe
npm run db:check     # comprueba conexión y versión antes de migrar
npm run db:migrate   # crea las tablas services y orders
npm run db:seed      # carga servicios y órdenes de demostración
```

Comprueba el resultado con:

```bash
npm run db:status
```

Debe listar las dos migraciones y los dos grupos de datos iniciales como aplicados, sin pendientes. Luego inicia el backend con `npm start`; la consola muestra `Conectado a MySQL ...`.

> `npm run db:create` necesita permiso para crear bases. Si tu usuario no lo tiene, crea la base como administrador con
> `CREATE DATABASE autospa CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;` y continúa con `db:migrate`.

Usar el nombre configurado en DB_NAME. Para comprobar una instalación limpia, preparar una base nueva; no aplicar seeders sobre datos que deban conservarse. Véase [validación desde un clon nuevo](../docs/instalacion.md#7-validación-desde-un-clon-nuevo-y-base-vacía).

### Otros comandos

| Comando | Qué hace |
| --- | --- |
| `npm run db:check` | Comprueba la conexión y muestra la versión de MySQL |
| `npm run db:status` | Lista migraciones y datos iniciales aplicados y pendientes |
| `npm run db:reset` | Retira datos iniciales, elimina las tablas y las vuelve a crear con los datos de demostración. **Borra los datos locales** |
| `npm run db:migrate:undo` | Revierte la última migración |
| `npm run db:seed:undo` | Retira los datos de demostración |

Las migraciones aplicadas se registran en la tabla `sequelize_meta` y los datos iniciales en `sequelize_seeds`, por eso cada comando solo ejecuta lo pendiente. Para cambiar la estructura, agrega una migración nueva en `src/db/migrations/` y regístrala en su `index.js`; no modifiques migraciones ya integradas en `develop`.

`db:reset` no es una reparación automática: elimina datos y se limita a bases de desarrollo prescindibles cuya pérdida se haya aceptado. No usar reset ni undo sobre bases existentes durante la validación.

### Datos de demostración

Todos los datos son ficticios.

| Servicio | Precio (PEN) | Estado |
| --- | --- | --- |
| Lavado básico | 20.00 | Activo |
| Lavado premium | 45.00 | Activo |
| Encerado | 35.00 | Activo |
| Lavado de motor | 30.00 | Inactivo |
| Aspirado express | 15.00 | Inactivo |

Órdenes: `ABC123` entregada y luego en espera (una placa se reutiliza tras una orden final), `XYZ789` en lavado y `B4R456` entregada con un servicio hoy inactivo (la orden conserva el nombre y precio acordados).

### Reglas que aplica la base de datos

- Importes en `DECIMAL(10,2)`, mayores que cero; Sequelize los devuelve como texto (`"20.00"`) para no perder precisión.
- Fechas `DATETIME(3)` en UTC (conexión configurada con `timezone: '+00:00'`).
- `orders.service_name` y `orders.service_price` copian el servicio al crear la orden; editar el catálogo no cambia órdenes existentes.
- `orders.service_id` referencia `services.id` con `ON DELETE RESTRICT`: no se puede borrar un servicio usado en órdenes; se desactiva con `is_active = false`.
- **Una sola orden activa por placa:** la columna generada `active_plate` vale la placa cuando el estado es `waiting`, `washing` o `ready`, y `NULL` en `delivered` o `cancelled`. El índice único `uq_orders_active_plate` rechaza una segunda orden activa de la misma placa, aun con registros simultáneos. El endpoint de registro debe traducir ese error a `409 ACTIVE_ORDER_EXISTS` (ver `docs/api.md`).
- `CHECK` de formato de placa (`ABC123`), teléfono (`+` opcional y 7–15 dígitos), estados permitidos y nombres no vacíos.

### Problemas frecuentes

| Mensaje | Solución |
| --- | --- |
| `Faltan variables de entorno...` | Falta `backend/.env`. Cópialo desde `.env.example` |
| `el servidor MySQL no responde` | Inicia el servicio MySQL (Windows: `services.msc` → MySQL80 → Iniciar) |
| `usuario o contraseña incorrectos` | Revisa `DB_USER` y `DB_PASSWORD` |
| `la base de datos "autospa" no existe` | Ejecuta `npm run db:create` |
| `ER_CHECK_CONSTRAINT_VIOLATED` o `ER_DUP_ENTRY` al cargar datos | Revisar `db:status` y los datos existentes. Para repetir la instalación, elegir una base nueva; no ejecutar reset automáticamente |

Los mensajes de error indican servidor, base y usuario, pero nunca la contraseña.

## Pruebas

`npm test` usa mocks; `npm run test:mysql` usa MySQL real en un esquema nuevo aleatorio que conserva al terminar. Necesita permiso para crear esa base. No equivalen a un recorrido visual. Resultados y pendientes: [guía de comprobaciones](../docs/comprobaciones.md).
