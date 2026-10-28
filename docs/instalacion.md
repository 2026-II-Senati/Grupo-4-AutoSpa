# Instalación y ejecución local de AutoSpa

Esta guía explica cómo preparar y ejecutar la versión actual de AutoSpa en una computadora de desarrollo. El proyecto se compone de dos aplicaciones independientes: el frontend desarrollado con React y Vite, y el backend construido con Node.js y Express.

El backend utiliza una base de datos MySQL 8.0.16 o posterior. Antes de iniciarlo, configura la conexión y prepara la base siguiendo la sección **Base de datos** de [`backend/README.md`](../backend/README.md).

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

## Configurar la base de datos

AutoSpa utiliza MySQL 8.0.16 o posterior con el motor InnoDB. Antes de iniciar el backend, debes configurar la conexión y preparar las tablas.

### 1. Configurar las variables de entorno

Abre una terminal de PowerShell desde la raíz del repositorio y ejecuta:

```powershell
cd backend
Copy-Item .env.example .env
```

Abre `backend/.env` en Visual Studio Code y completa las variables con los datos de tu instalación local de MySQL:

- `DB_HOST`: normalmente `127.0.0.1`.
- `DB_PORT`: normalmente `3306`.
- `DB_NAME`: `autospa`.
- `DB_USER`: usuario de MySQL.
- `DB_PASSWORD`: contraseña de ese usuario.
- `DB_LOGGING`: utiliza `true` para mostrar las consultas SQL o `false` para ocultarlas.

No subas el archivo `backend/.env` a GitHub, porque contiene credenciales privadas.

### 2. Preparar el usuario y la base de datos

Si todavía no tienes un usuario para AutoSpa, puedes crear uno desde MySQL Workbench o el cliente de MySQL con una cuenta administradora. Cambia la contraseña de ejemplo por una propia:

```sql
CREATE USER IF NOT EXISTS 'autospa_app'@'localhost'
IDENTIFIED BY 'tu_contrasena';

GRANT ALL PRIVILEGES ON autospa.*
TO 'autospa_app'@'localhost';
```

Configura ese usuario y contraseña en `backend/.env`. Si MySQL rechaza la conexión debido al host utilizado, revisa la configuración del usuario y los permisos correspondientes.

### 3. Crear las tablas y cargar los datos iniciales

Desde la carpeta `backend/`, ejecuta los siguientes comandos en orden:

```powershell
npm ci
npm run db:create
npm run db:check
npm run db:migrate
npm run db:seed
npm run db:status
```

Estos comandos instalan las dependencias, crean la base de datos si corresponde, comprueban la conexión, aplican las migraciones y cargan los datos de demostración.

El comando `npm run db:status` permite revisar las migraciones y los datos iniciales aplicados y pendientes.

Si tu usuario no tiene permiso para crear bases de datos, solicita a un administrador que cree `autospa` y luego continúa con las migraciones.

**Precaución:** no ejecutes `npm run db:reset` en una base de datos que contenga información que debas conservar, porque elimina y vuelve a crear las tablas y los datos de demostración.

### 4. Iniciar el backend

Una vez preparada la base de datos, inicia el servidor desde `backend/`:

```powershell
npm start
```

Comprueba que la terminal indique que la conexión con MySQL se realizó correctamente. Después, abre `http://localhost:3001/api/health` en el navegador para verificar que el backend responde.



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
