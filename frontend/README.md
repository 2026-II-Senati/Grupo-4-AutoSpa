# AutoSpa — Frontend

Interfaz inicial de AutoSpa construida con React, JavaScript y Vite. Presenta el menú de órdenes activas, historial, servicios y precios, y resumen operativo. La comprobación de conexión está deshabilitada porque todavía no hay un backend conectado; la interfaz indica que la conexión está pendiente.

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

## Estructura principal

- `src/App.jsx`: título, navegación, tarjetas de acceso y estado pendiente de conexión.
- `src/styles.css`: presentación visual y adaptación a pantallas pequeñas.
- `src/main.jsx`: punto de entrada de React.

Para cambiar los nombres u orden de las secciones, edita el arreglo `menuItems` en `src/App.jsx`; el menú lateral y las tarjetas se generan a partir de ese arreglo. No se simula una respuesta del servidor.
