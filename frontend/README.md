# AutoSpa — Frontend

Interfaz de AutoSpa construida con React, JavaScript y Vite. Incluye el registro y listado de órdenes, además de la comprobación de conexión con `GET /api/health`.

## Requisitos

- Node.js `24.22.1`
- npm `11.19.1`

Comprueba las versiones antes de instalar:

```bash
node -v
npm -v
```

## Instalación

Desde esta carpeta (`frontend/`), instala las dependencias bloqueadas:

```bash
npm ci
```

## Comandos

```bash
npm run dev      # Inicia Vite en http://localhost:3000
npm run build    # Genera la compilación de producción en dist/
npm run preview  # Sirve la compilación local en el puerto 3000
```

El servidor de desarrollo usa el puerto `3000` y falla si ya está ocupado, para que la dirección documentada no cambie silenciosamente.

## Comprobación de conexión con el backend

Para comprobar la conexión deben ejecutarse el backend y el frontend al mismo tiempo.

### Iniciar el backend

Desde la raíz del repositorio, abre una terminal:

```bash
cd backend
npm ci
npm start
```

El backend escucha en `http://localhost:3001`. Vite reenvía las solicitudes `/api/...` a ese servidor mediante el proxy de `vite.config.js`; en el uso local no hace falta configurar `VITE_API_URL`.

### Iniciar el frontend

En otra terminal, desde `frontend/`:

```bash
npm ci
npm run dev
```

Abre `http://localhost:3000`. En modo desarrollo, la pantalla usa por defecto servicios de demostración y guarda las órdenes en `localStorage` para que sigan apareciendo después de recargar. Estos datos no se envían al backend ni se guardan en MySQL.

Cuando estén disponibles `GET /api/services`, `GET /api/orders` y `POST /api/orders`, configura `VITE_USE_MOCK_API=false` en `frontend/.env.local` y reinicia Vite. El proxy de `vite.config.js` enviará las solicitudes al backend. El formato de esas rutas está descrito en `../docs/api.md`.

## Estructura principal

- `src/App.jsx`: navegación y selección de sección.
- `src/orders/`: formulario, listado y comunicación HTTP de órdenes.
- `src/styles.css`: presentación visual y adaptación a pantallas pequeñas.
- `src/main.jsx`: punto de entrada de React.

Para cambiar los nombres u orden de las secciones, edita el arreglo `menuItems` en `src/App.jsx`; el menú lateral se genera a partir de ese arreglo.
