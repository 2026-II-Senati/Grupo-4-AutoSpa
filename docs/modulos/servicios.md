# Administración de servicios — PFA-18

Este módulo administra el catálogo de servicios con persistencia en MySQL. Las rutas administrativas usan el middleware compartido `requireAuth` y una sesión válida.

## Rutas

- `GET /api/services/manage`: lista activos e inactivos, ordenados por `id ASC`.
- `POST /api/services`: crea un servicio activo. Recibe `name`, `description` opcional y `price` decimal con dos decimales.
- `PATCH /api/services/:id`: modifica parcialmente `name`, `description`, `price` o `isActive`.
- `GET /api/services`: se conserva sin cambios y devuelve solo servicios activos para las órdenes.

Las tres rutas administrativas exigen una sesión válida. Sin sesión responden `401 AUTHENTICATION_REQUIRED`.

## Respuestas y validación

Las respuestas exitosas usan `{ "data": ... }` y contienen únicamente `id`, `name`, `description`, `price` e `isActive`; nunca incluyen `createdAt` ni `updatedAt`. Los precios son cadenas con dos decimales. Los datos inválidos responden `422 VALIDATION_ERROR`, un ID inexistente responde `404 SERVICE_NOT_FOUND`, una sesión ausente `401 AUTHENTICATION_REQUIRED` y no existe eliminación física.

## Ejemplos

Crear un servicio:

```json
{ "name": "Lavado completo", "description": "Lavado exterior e interior.", "price": "35.00" }
```

Editar datos o disponibilidad:

```json
{ "price": "38.00", "isActive": false }
```

`POST` crea siempre el servicio activo. `PATCH` acepta cambios parciales en `name`, `description`, `price` e `isActive`. El nombre se recorta a 1–100 caracteres, la descripción admite hasta 255 caracteres y el precio debe estar entre `0.01` y `99999999.99` con dos decimales. Se rechazan campos desconocidos y no se exige unicidad de nombres.

`GET /api/services` es la consulta pública usada por el registro de órdenes: devuelve solo servicios activos. `GET /api/services/manage` es la consulta administrativa autenticada: devuelve activos e inactivos, ordenados por `id ASC`.



## Comprobación básica

1. Iniciar sesión mediante `/api/auth/login`.
2. Consultar `GET /api/services/manage` y verificar `200` y los cinco campos permitidos.
3. Crear un servicio y verificar `201`.
4. Desactivarlo con `PATCH`, comprobar que desaparece de `GET /api/services`, y reactivarlo.
5. Repetir una consulta administrativa sin cookie y verificar `401`.
6. Editar nombre o precio de un servicio usado por una orden y comprobar que la orden conserva `serviceName` y `servicePrice` históricos.
r
