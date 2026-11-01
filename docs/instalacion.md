# Instalación y ejecución local de AutoSpa

Los resultados reales se mantienen en [comprobaciones](comprobaciones.md). Una instrucción no acredita su ejecución.

## 1. Requisitos y clon

- Git, Node.js 24.22.1, npm 11.19.1 y navegador.
- **MySQL Server ejecutándose**, 8.0.16 o posterior, InnoDB: instalado localmente o levantado con Docker Compose ([sección 8](#8-base-de-datos-con-docker-compose)). Workbench es un cliente gráfico; no sustituye al servidor. MariaDB no está admitido.
- Usuario MySQL con permisos para una base de desarrollo/pruebas. Crear una base requiere permiso o intervención del administrador.
- Docker Compose disponible solo para MySQL (`compose.yaml` en la raíz). Backend y frontend siguen ejecutándose con npm.

```powershell
node -v
npm -v
git clone https://github.com/2026-II-Senati/Grupo-4-AutoSpa.git
cd Grupo-4-AutoSpa
git switch develop
git pull --ff-only origin develop
```

Para reproducir un PR, usar su rama/commit en lugar de develop y registrar `git rev-parse HEAD`. No cambiar de rama con trabajo ajeno.

## 2. Dependencias

Desde la raíz:

```powershell
npm --prefix backend ci
npm --prefix frontend ci
```

Cada aplicación tiene lockfile. No subir node_modules ni frontend/dist.

## 3. Entorno y MySQL

La fuente de instrucciones sobre usuario, permisos y migraciones es [Backend: Base de datos](../backend/README.md#base-de-datos). No publicar credenciales en capturas, logs o PR.

Desde la raíz, crear el entorno **solo si no existe**:

```powershell
if (-not (Test-Path -LiteralPath backend/.env)) {
    Copy-Item -LiteralPath backend/.env.example -Destination backend/.env
}
```

Editar localmente DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_LOGGING y PORT. No sobrescribir un .env existente. Las variables del proceso prevalecen sobre el archivo; revisar valores heredados sin publicar secretos.

Para comprobaciones elegir una base **nueva y exclusiva**, por ejemplo `autospa_pr12_<identificador>`, y permisos sobre ese nombre según la guía del backend. No reutilizar datos que deban conservarse.

Desde backend/, con el usuario configurado:

```powershell
npm run db:create
npm run db:check
npm run db:migrate
npm run db:seed
npm run db:status
```

db:create crea la base configurada si no existe. Si no tiene permiso, el administrador debe crearla antes de db:check. En una instalación nueva con demostración, status debe mostrar dos migraciones y dos seeders aplicados, sin pendientes.

**No usar db:reset como reparación automática.** Elimina datos y recrea tablas. Se limita a bases de desarrollo prescindibles cuya pérdida se haya aceptado. Ante datos previos o error de seeder, revisar el estado y elegir una base nueva. No ejecutar undo/reset sobre bases existentes durante estas comprobaciones.

## 4. Modo A: Vite y API separados

Terminal 1 desde la raíz:

```powershell
cd backend
npm start
```

Terminal 2 desde la raíz:

```powershell
cd frontend
$env:VITE_USE_MOCK_API = 'false'
npm run dev
```

Abrir **la interfaz** en http://localhost:3000. Vite usa 3000 con --strictPort y reenvía /api a http://localhost:3001 según frontend/vite.config.js.

Consultar **la API** en http://localhost:3001/api/health, /api/services y /api/orders. Health devuelve HTTP 200 y `{"message":"Backend de AutoSpa disponible"}`; las consultas usan data según [api.md](api.md).

El botón «Comprobar conexión» aparece al abrir otra sección del menú, como «Historial». Esas secciones muestran una bienvenida; no implementan todavía historial ni administración del catálogo.

## 5. Modo B: aplicación compilada desde Express

Con dependencias de ambas carpetas y BD preparadas, desde backend/:

```powershell
$env:VITE_USE_MOCK_API = 'false'
npm run start:app
```

Compila React y arranca Express. Abrir **la interfaz** en http://localhost:3001/; la API usa el mismo origen con prefijo /api. No hace falta Vite activo.

Alternativa: `npm run build` en frontend/ y `npm start` en backend/. Express también sirve cualquier build existente con npm start; sin build permite usar la API, pero no acredita que la raíz entregue la interfaz. Reconstruir tras cambiar frontend o variables Vite.

npm run preview previsualiza el build en 3000; **no tiene proxy API** configurado. No usarlo como modo integrado. El mock se activa solo con VITE_USE_MOCK_API=true; desactivarlo al iniciar Vite o compilar para estas pruebas.

## 6. Comprobación y problemas

```powershell
curl.exe -i http://localhost:3001/api/health
curl.exe -i http://localhost:3001/api/services
curl.exe -i http://localhost:3001/api/orders
```

Desde backend/: npm test usa mocks; npm run test:mysql crea y conserva un esquema aleatorio nuevo con migraciones. Requiere permiso para crear bases. No equivale a probar visualmente React.

- MySQL sin respuesta: iniciar el servicio y revisar host/puerto. Si falla la conexión al arrancar, Express se detiene.
- Permisos/base inexistente: revisar usuario, host y DB_NAME sin mostrar contraseñas.
- Puerto ocupado: identificar antes de detener procesos. PORT cambia el backend; ajustar también el proxy Vite. No detener procesos ajenos.
- npm ci falla: comprobar carpeta/lockfile. Node/npm no reconocido: revisar instalación y PATH.
- Detener solo procesos de prueba con Ctrl+C en cada terminal. Cerrar el navegador no los detiene.

## 7. Validación desde un clon nuevo y base vacía

1. Clonar en otra carpeta y registrar rama, commit, SO, Node, npm y MySQL.
2. Instalar ambos lockfiles, preparar un entorno privado sin sobrescrituras y una base exclusiva vacía.
3. Ejecutar creación, check, migraciones, seeders y status; guardar salidas sin secretos.
4. Arrancar ambos modos y comprobar HTTP de interfaz/API. Con navegador, ejecutar CP-01 a CP-12 de la [guía](comprobaciones.md).
5. Registrar resultado obtenido/evidencia sin convertir API o build en aprobación visual.
6. Otro integrante debe repetir y confirmar su resultado. Esa reproducción queda **Pendiente** hasta su confirmación; Castillo revisa el ticket.

El [registro](comprobaciones.md#4-registro-de-resultados) informa qué se ejecutó en esta revisión.

## 8. Base de datos con Docker Compose

Alternativa a instalar MySQL: `compose.yaml` levanta **solo MySQL 8.4.9** (imagen `mysql:8.4.9`) con un volumen con nombre. Backend y frontend siguen con npm (secciones 4 y 5).

**Requisitos:** Docker Desktop iniciado («Engine running»; en Windows requiere WSL 2).

```powershell
docker --version
docker compose version
```

**Dos archivos de entorno, no confundirlos.** Ninguno se sube al repositorio:

| Archivo | Lo lee | Contenido |
| --- | --- | --- |
| `.env` (raíz) | Docker Compose | `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD` |
| `backend/.env` | Backend | `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` |

Usuario y contraseña de la aplicación deben coincidir en ambos. El backend nunca usa `root`.

**Arrancar.** Desde la raíz, crear el entorno solo si no existe, cambiar las contraseñas y levantar el servicio:

```powershell
if (-not (Test-Path -LiteralPath .env)) {
    Copy-Item -LiteralPath .env.example -Destination .env
}
docker compose up -d
```

El primer arranque crea la base `MYSQL_DATABASE` y el usuario `MYSQL_USER` con permisos solo sobre ella. Publica el puerto `127.0.0.1:3307` (configurable con `MYSQL_PORT`) para no interferir con un MySQL local en 3306.

**Verificar disponibilidad.**

```powershell
docker compose ps
docker compose logs mysql
```

`STATUS` debe indicar `healthy`: el healthcheck (`mysqladmin ping`) confirma que MySQL responde, **no** las credenciales de la aplicación. Esas se confirman con `npm run db:check` desde el backend.

**Conectar el backend.** En `backend/.env`: `DB_HOST=127.0.0.1`, `DB_PORT=3307` (o el valor de `MYSQL_PORT`), y `DB_NAME`, `DB_USER` y `DB_PASSWORD` iguales a los del `.env` de la raíz. Desde backend/:

```powershell
npm run db:check
npm run db:migrate
npm run db:seed
npm run db:status
```

No hace falta `db:create`: el contenedor ya crea la base. Si una migración o seeder ya estaba aplicado, la salida no lo vuelve a listar.

**Detener y conservar datos.**

```powershell
docker compose stop    # detiene MySQL; conserva datos
docker compose start   # lo reanuda con las mismas tablas y datos
docker compose down    # elimina el contenedor; el volumen se conserva
```

> ⚠️ `docker compose down -v` **elimina el volumen y todos sus datos**. Usarlo solo para empezar con una base vacía; después repetir migraciones y seeders.

**Problemas frecuentes.** Puerto 3307 ocupado: cambiar `MYSQL_PORT` y el mismo valor en `DB_PORT`, y repetir `docker compose up -d`. Credenciales rechazadas: la contraseña de `backend/.env` no coincide con `MYSQL_PASSWORD`; el contenedor conserva la del primer arranque. `docker` sin respuesta: abrir Docker Desktop y esperar «Engine running».
