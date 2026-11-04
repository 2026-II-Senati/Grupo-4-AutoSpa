# Órdenes: avance de estado y auditoría

## Endpoint

`PATCH /api/orders/:id/status` requiere una sesión autenticada. El middleware de autenticación debe proporcionar el usuario activo en `req.user.id`. Ese ID es la única fuente del responsable; los campos de usuario enviados en el cuerpo se rechazan.

Avance:

```http
PATCH /api/orders/42/status
Content-Type: application/json
Cookie: <sesión real obtenida mediante login>

{"expectedStatus":"waiting","status":"washing"}
```

Cancelación:

```json
{"expectedStatus":"waiting","status":"cancelled","reason":"El cliente solicita retirarse."}
```

Una respuesta correcta es `200 { "data": { ...orden existente... } }`; conserva exactamente los campos públicos de la respuesta previa de órdenes. El motivo no se duplica en la orden.

## Transiciones

| Estado actual | Siguiente estado |
| --- | --- |
| waiting | washing o cancelled |
| washing | ready |
| ready | delivered |
| delivered / cancelled | ninguno |

Se exige `expectedStatus` y debe coincidir con el estado bloqueado en la base. Se rechazan saltos, retrocesos, reaperturas y cambios en estados finales. La cancelación solo es válida desde `waiting` y requiere un motivo de 1 a 255 caracteres después de recortar espacios exteriores. `reason` no se admite para los otros cambios.

## Errores

Los errores usan `{ "error": { "code", "message", "details" } }`.

| HTTP | code | Caso |
| --- | --- | --- |
| 401 | UNAUTHORIZED | Sesión ausente o inválida |
| 404 | ORDER_NOT_FOUND | ID inexistente |
| 409 | ORDER_STATUS_CONFLICT | El estado no coincide con `expectedStatus` |
| 409 | INVALID_STATUS_TRANSITION | El par de estados no está permitido |
| 422 | VALIDATION_ERROR | Cuerpo, tipos, propiedades o motivo inválidos |

## Auditoría y concurrencia

La operación bloquea la orden con `SELECT ... FOR UPDATE`, comprueba el estado, actualiza estado y `updated_at` e inserta un único evento en la misma transacción. El evento conserva `from_status`, `to_status`, `changed_by_user_id`, `changed_at` UTC generado por el servidor y `reason` solo para cancelaciones. Si falla el evento, la transacción revierte la actualización. Solicitudes concurrentes con el mismo estado esperado se serializan: la primera puede confirmar y la siguiente obtiene `ORDER_STATUS_CONFLICT`.

Las tablas de auditoría y creador tienen FK restrictivas a `users`; las órdenes antiguas permanecen con `created_by_user_id = NULL`. Las órdenes nuevas guardan el usuario autenticado al crearse. Las órdenes entregadas y canceladas dejan de ser activas por la columna generada `active_plate`, lo que libera la placa para otra visita.

## Migraciones

Se agregan `20261103000001-add-orders-created-by-user` y `20261103000002-create-order-status-changes`. Ejecutar primero la migración de `users` entregada por el ticket de autenticación y luego `npm run db:migrate`. Las migraciones originales no se modifican. La primera deja NULL en las órdenes existentes y añade FK/índice del creador; la segunda crea eventos, FK, índices y CHECK de pares de transición y motivo.

Este checkout de develop todavía no contiene el middleware ni la migración de `users`: hasta integrar esa dependencia, las operaciones autenticadas responden 401 y las migraciones de este ticket no se pueden aplicar de manera integrada.

## Comprobación

Con el servidor, MySQL, migraciones y login reales disponibles:

```sh
curl -i -b cookies.txt -X PATCH http://localhost:3000/api/orders/42/status \
  -H 'Content-Type: application/json' \
  -d '{"expectedStatus":"waiting","status":"washing"}'

curl -i -b cookies.txt -X PATCH http://localhost:3000/api/orders/43/status \
  -H 'Content-Type: application/json' \
  -d '{"expectedStatus":"waiting","status":"cancelled","reason":"El cliente solicita retirarse."}'
```

Comprobar el responsable y el recorrido persistido:

```sql
SELECT id, order_id, from_status, to_status, changed_by_user_id, changed_at, reason
FROM order_status_changes
WHERE order_id = 42
ORDER BY changed_at, id;
```

Enviar dos PATCH en paralelo para el mismo ID y `expectedStatus`: se espera un éxito y un conflicto, con exactamente un evento. `npm test` cubre las transiciones permitidas y la validación de cuerpo/motivo. Los casos de concurrencia, rollback ante error SQL y persistencia requieren MySQL y sesión real.

La interfaz de seguimiento y la consulta de historial quedan pendientes de sus tickets respectivos.
