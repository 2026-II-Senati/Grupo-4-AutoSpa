# Instalación y ejecución local de AutoSpa

Esta guía explica cómo preparar y ejecutar la versión actual de AutoSpa en una computadora de desarrollo. El proyecto se compone de dos aplicaciones independientes: el frontend desarrollado con React y Vite, y el backend construido con Node.js y Express.

El backend utiliza una base de datos MySQL 8.0.16 o posterior. Puedes usar un MySQL instalado en tu computadora o levantarlo con Docker (sección [Base de datos con Docker](#base-de-datos-con-docker)). En ambos casos, prepara la base siguiendo la sección **Base de datos** de [`backend/README.md`](../backend/README.md).

## Requisitos

Antes de comenzar, comprueba que tienes instaladas las siguientes herramientas:

- Git.
- Node.js `24.22.1`.
- npm `11.19.1`.
- Un navegador web actualizado.

Abre una terminal y verifica las versiones de Node.js y npm:

```bash
node -v
npm -v
```

Los resultados esperados son:

```text
v24.22.1
11.19.1
```

Si utilizas otras versiones, cambia primero a las acordadas por el equipo antes de instalar las dependencias.

## Obtener el proyecto

Clona el repositorio y entra en su carpeta:

```bash
git clone https://github.com/2026-II-Senati/Grupo-4-AutoSpa.git
cd Grupo-4-AutoSpa
```

La versión de trabajo del equipo se encuentra en `develop`:

```bash
git switch develop
git pull --ff-only origin develop
```

## Instalar las dependencias

El frontend y el backend tienen dependencias independientes. Por ello, `npm ci` debe ejecutarse una vez dentro de cada carpeta.

### Backend

Desde la raíz del repositorio:

```bash
cd backend
npm ci
```

### Frontend

Regresa a la raíz, entra en el frontend e instala sus dependencias:

```bash
cd ../frontend
npm ci
```

El comando `npm ci` utiliza los archivos `package-lock.json` del repositorio para instalar las versiones registradas por el equipo. Las carpetas `node_modules` se generan localmente y no deben subirse a GitHub.

## Base de datos con Docker

Con Docker no hace falta instalar MySQL en tu computadora. `compose.yaml` (en la raíz) levanta **solo MySQL 8.4.9**; el backend y el frontend se siguen ejecutando con npm.

### Requisitos

- Docker Desktop iniciado (en Windows necesita WSL 2). Debe mostrar **Engine running**.
- Comprobar en una terminal:

```bash
docker --version
docker compose version
```

### Dos archivos .env distintos

| Archivo | Lo usa | Qué contiene |
| --- | --- | --- |
| `.env` (raíz) | Docker Compose | Puerto publicado, base, usuario y contraseñas del contenedor |
| `backend/.env` | Backend (Node) | Cómo conectarse a ese MySQL: host, puerto, usuario y contraseña |

Ninguno se sube a GitHub. El usuario y la contraseña de la aplicación deben ser **los mismos** en los dos. El backend nunca usa `root`.

### 1. Configurar y arrancar MySQL

Desde la raíz del repositorio:

```powershell
Copy-Item .env.example .env
```

Edita `.env` y cambia `MYSQL_PASSWORD` y `MYSQL_ROOT_PASSWORD`. Luego inicia el contenedor:

```bash
docker compose up -d
```

La primera vez descarga la imagen y crea la base `autospa` y el usuario `autospa_app` con permisos solo sobre esa base.

### 2. Comprobar que MySQL está disponible

```bash
docker compose ps
```

La columna `STATUS` debe indicar `healthy`. Si dice `health: starting`, espera unos segundos y repite. Para ver los mensajes de MySQL:

```bash
docker compose logs mysql
```

### 3. Conectar el backend

En `backend/.env` usa el puerto publicado (por defecto `3307`) y el usuario de la aplicación:

```text
DB_HOST=127.0.0.1
DB_PORT=3307
DB_NAME=autospa
DB_USER=autospa_app
DB_PASSWORD=la misma contraseña que MYSQL_PASSWORD
```

Después, desde `backend/`:

```bash
npm run db:check
npm run db:migrate
npm run db:seed
npm start
```

`db:check` debe responder `Conexión correcta: MySQL 8.4.9`. No hace falta `npm run db:create`: el contenedor ya crea la base.

### 4. Detener y volver a iniciar

```bash
docker compose stop     # detiene MySQL y conserva los datos
docker compose start    # lo vuelve a iniciar con las mismas tablas y datos
docker compose down     # elimina el contenedor; los datos siguen en el volumen
```

Los datos se guardan en el volumen con nombre `autospa_mysql-data`, por eso sobreviven a `stop`, `start` y `down`.

> ⚠️ `docker compose down -v` **elimina también el volumen y todos sus datos**. Úsalo solo si quieres empezar con una base vacía; después tendrás que repetir `db:migrate` y `db:seed`.

### Problemas frecuentes con Docker

- **El puerto 3307 está ocupado:** cambia `MYSQL_PORT` en el `.env` de la raíz y el mismo número en `DB_PORT` de `backend/.env`, y ejecuta `docker compose up -d` de nuevo.
- **`usuario o contraseña incorrectos` en el backend:** la contraseña de `backend/.env` no coincide con `MYSQL_PASSWORD`. Si cambiaste la contraseña después del primer arranque, el contenedor conserva la anterior: usa la original o reinicia con `docker compose down -v` (borra los datos).
- **`docker` no se reconoce o no responde:** abre Docker Desktop y espera a que indique **Engine running**.

## Ejecutar el proyecto

El backend y el frontend deben mantenerse activos al mismo tiempo. Para ello, abre dos terminales en la carpeta raíz del repositorio.

### Terminal 1: iniciar el backend

```bash
cd backend
npm start
```

El servidor quedará disponible en el puerto `3001`. Mantén esta terminal abierta mientras utilizas el proyecto.

Para comprobarlo, abre en el navegador:

```text
http://localhost:3001/api/health
```

La respuesta esperada es HTTP 200 con el siguiente contenido:

```json
{"message":"Backend de AutoSpa disponible"}
```

También puedes realizar la comprobación desde PowerShell:

```powershell
curl.exe -i http://localhost:3001/api/health
```

### Terminal 2: iniciar el frontend

Sin cerrar el backend, abre una segunda terminal y ejecuta:

```bash
cd frontend
npm run dev
```

Después, abre en el navegador:

```text
http://localhost:3000
```

La pantalla debe mostrar el inicio de AutoSpa, el menú principal y el botón de comprobación de conexión disponible en la versión actual del frontend.

## Detener el proyecto

Cada aplicación se detiene desde la terminal en la que está ejecutándose.

1. Selecciona la terminal del frontend y presiona `Ctrl+C`.
2. Selecciona la terminal del backend y presiona `Ctrl+C`.
3. Si la terminal solicita una confirmación, respóndela para finalizar el proceso.

Cerrar únicamente la pestaña del navegador no detiene los servidores.

## Comprobaciones adicionales

Para verificar que el frontend puede generar una compilación de producción, detén su servidor y ejecuta dentro de `frontend/`:

```bash
npm run build
```

La compilación debe terminar sin errores. El directorio `dist/` generado por este comando es local y no debe añadirse al repositorio.

## Solución de problemas frecuentes

### El comando node o npm no se reconoce

Cierra y vuelve a abrir la terminal después de instalar Node.js. Si el problema continúa, comprueba que la instalación de Node.js se encuentre incluida en la variable `PATH` del sistema.

### npm ci indica que no encuentra package-lock.json

Verifica que la terminal esté ubicada en `backend/` o `frontend/`. Cada aplicación contiene su propio `package.json` y `package-lock.json`.

### El puerto 3000 o 3001 está ocupado

Comprueba si el frontend o backend ya está ejecutándose en otra terminal. Detén el proceso anterior con `Ctrl+C` y vuelve a ejecutar el comando correspondiente. No cambies los puertos, porque el proyecto y su documentación utilizan las direcciones acordadas por el equipo.

### El frontend abre, pero el backend no responde

Comprueba que la primera terminal continúe ejecutando `npm start` y abre directamente `http://localhost:3001/api/health`. Si esa dirección no devuelve el JSON esperado, revisa el mensaje mostrado en la terminal del backend.

### La instalación funciona en una carpeta, pero falla en la otra

Las dependencias del frontend y backend se instalan por separado. Ejecuta `npm ci` dentro de la carpeta que presenta el problema.

## Validación desde una copia nueva

Antes de aprobar esta guía, otro integrante debe comprobarla desde un clon nuevo del repositorio y registrar en el PR:

- Sistema operativo utilizado.
- Resultado de `node -v` y `npm -v`.
- Confirmación de que `npm ci` funcionó en `backend/` y `frontend/`.
- Confirmación de que el backend respondió en el puerto 3001.
- Confirmación de que el frontend abrió en el puerto 3000.
- Cualquier instrucción que haya sido necesario corregir.

La guía se considera validada cuando otra persona puede preparar y ejecutar ambas aplicaciones siguiendo únicamente estas instrucciones.
