# PFA-13 — Consultar servicios disponibles y órdenes activas

La rama integra la persistencia de PFA-11 y el registro de PFA-12. Las consultas usan MySQL y conservan `POST /api/orders` con sus validaciones, transacción y protección de placa activa.

## Contrato

La fuente de verdad es [docs/api.md](../docs/api.md); el diseño y las copias históricas se explican en [modelo-datos.md](../docs/modelo-datos.md).

- `GET /api/services`: solo servicios activos, ordenados por `id ASC`. Campos: `id`, `name`, `description` (string o null) y `price` (string decimal con dos posiciones).
- `GET /api/orders`: solo `waiting`, `washing` y `ready`, ordenados por `createdAt ASC, id ASC`. Campos: `id`, `plate`, `customerName`, `customerPhone` (string o null), `serviceId`, `serviceName`, `servicePrice`, `status`, `createdAt` y `updatedAt`.
- `serviceName` y `servicePrice` se leen de la orden, sin unir el catálogo actual. `servicePrice` es string decimal con dos posiciones y las fechas son ISO 8601 UTC con `Z`.
- Ambas consultas responden HTTP 200 con `{"data":[...]}`; sin resultados, `{"data":[]}`.
- POST y GET comparten la representación de orden. El registro sigue respondiendo HTTP 201 después del commit.
- `/api/health` conserva HTTP 200 con `{"message":"Backend de AutoSpa disponible"}`.

Ejemplo de servicios:

```json
{"data":[{"id":1,"name":"Lavado básico","description":null,"price":"20.00"}]}
```

Los errores usan `{"error":{"code":"...","message":"...","details":[]}}`. Las consultas devuelven HTTP 503 / `TEMPORARILY_UNAVAILABLE` ante indisponibilidad temporal de BD, o HTTP 500 / `INTERNAL_ERROR` ante un fallo inesperado. Los mensajes exactos y los errores del POST están en el contrato; no se devuelven SQL ni credenciales.

No se añaden autenticación, paginación, historial, cambios de estado ni otras operaciones CRUD.

## Preparación y ejecución

Requisitos del proyecto: Node.js 24.22.1, npm 11.19.1 y MySQL 8.0.16 o posterior. Sigue [Backend: instalación y base de datos](README.md#base-de-datos) para configurar el entorno y las migraciones. Las dependencias y los comandos de migraciones existentes se conservan.

Desde `backend/`:

```powershell
npm ci
npm run db:check
npm start
```

Con el servidor iniciado, consulta `/api/services` y `/api/orders` en el puerto configurado (3001 por defecto). Consulta [el contrato](../docs/api.md) para ejemplos completos de POST y GET.

## Pruebas reproducibles

```powershell
npm test
npm run test:mysql
```

- `npm test`: HTTP con modelos y conexión simulados. Comprueba proyecciones, filtros, orden, respuestas vacías, health y formato exacto de errores 500/503. No acredita integración MySQL.
- `npm run test:mysql`: usa las credenciales del entorno o `backend/.env`, pero sustituye `DB_NAME` por un nombre aleatorio `autospa_pfa13_test_*`. Necesita permiso para crear una base nueva y aplica allí las migraciones reales; no ejecuta reset, seeders ni elimina bases. Conserva el esquema y muestra su nombre al terminar para revisión.
- La integración arranca el servidor real en un puerto efímero. Comprueba servicios activos/inactivos, campos y tipos, estados activos/finales, orden estable, listas vacías, POST→GET idénticos, copia histórica tras editar el catálogo, JSON/tipo de contenido, validaciones, servicio no disponible, placa duplicada y dos POST concurrentes con exactamente un 201 y un 409.
- Para el 500 real se renombra y restaura una tabla exclusivamente en el esquema nuevo. Para el 503 se vacía el pool de ese proceso y se dirige su conexión a un puerto inaccesible; no se detiene el servicio MySQL compartido.

Validación local del 28 de octubre de 2026: `npm ci` completado (0 vulnerabilidades reportadas), `npm run db:check` correcto con MySQL 8.0.46, `npm test` con 5 comprobaciones aprobadas y `npm run test:mysql` con 8 aprobadas. El arranque y health se comprobaron desde la suite real. No quedan casos de integración MySQL pendientes del alcance de PFA-13.
