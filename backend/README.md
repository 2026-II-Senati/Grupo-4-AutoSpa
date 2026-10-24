# Backend de AutoSpa

Este backend ofrece una ruta sencilla para comprobar que el servidor está activo.

## Requisitos

- Node.js 24.22.1
- npm 11.19.1

## Instalar y arrancar

Abre una terminal en la carpeta `backend/`. Si es la primera vez que preparas el proyecto, instala las dependencias:

```bash
npm ci
```

Inicia el servidor con:

```bash
npm start
```

El servidor queda escuchando en el puerto `3001`. Mantén abierta la terminal mientras lo usas.

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

El backend recibe solicitudes HTTP en el puerto `3001`. El frontend podrá consultar sus rutas mediante HTTP; la configuración para conectar React con este servidor se realizará en la tarea de integración correspondiente.

## Detener el servidor

En la terminal donde ejecutaste `npm start`, pulsa `Ctrl+C`.
