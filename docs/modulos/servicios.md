# Administración de servicios — PFA-18

Esta copia local implementa exclusivamente la administración del catálogo de servicios.

## Rutas

- `GET /api/services/manage`: lista activos e inactivos, ordenados por `id ASC`.
- `POST /api/services`: crea un servicio activo. Recibe `name`, `description` opcional y `price` decimal con dos decimales.
- `PATCH /api/services/:id`: modifica parcialmente `name`, `description`, `price` o `isActive`.
- `GET /api/services`: se conserva sin cambios y devuelve solo servicios activos para las órdenes.

Las tres rutas administrativas exige una sesión válida mediante el middleware compartido. Sin sesión responden `401 UNAUTHORIZED`.

## Respuestas y validación

Las respuestas exitosas usan `{ "data": ... }`; los precios son cadenas con dos decimales. Los datos inválidos responden `422 VALIDATION_ERROR`, un ID inexistente responde `404 SERVICE_NOT_FOUND` y no existe eliminación física.



La prueba integrada debe comprobar creación, edición, activación, desactivación, validaciones, rechazo sin sesión y conservación de `serviceName`/`servicePrice` en órdenes históricas. La protección completa con sesión real queda pendiente de integrar el middleware de autenticación de PFA-19.
r