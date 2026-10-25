# Contrato inicial de la API de AutoSpa

## 1. Convenciones compartidas

- Base local del backend: `http://localhost:3001`. React usa rutas relativas `/api/...` mediante el proxy de Vite.
- Solicitudes y respuestas JSON, UTF-8. POST exige `Content-Type: application/json`.
- Nombres camelCase; IDs como enteros positivos; importes PEN como strings con dos decimales; fechas ISO 8601 UTC.
- Éxito: `{"data": ...}`. Error: `{"error":{"code":"...","message":"...","details":[]}}`.
- details siempre es una lista de objetos field/message; vacía cuando el error no corresponde a un campo.
- La interfaz decide el comportamiento por HTTP y code; message se muestra al usuario.
- Las consultas devuelven todos los registros del alcance inicial, sin paginación ni filtros opcionales. No truncar silenciosamente. Paginación e historial se añadirán mediante otro contrato.
- No se implementa autenticación en este sprint; estas rutas se destinan al entorno de desarrollo. El acceso del personal se abordará en su ticket.
- `GET /api/health` conserva su respuesta actual HTTP 200: `{"message":"Backend de AutoSpa disponible"}`, sin envolver en data.

## 2. GET /api/services

Devuelve únicamente servicios activos, ordenados por id ASC. No recibe cuerpo ni parámetros.
HTTP 200:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Lavado básico",
      "description": "Lavado exterior",
      "price": "20.00"
    }
  ]
}
```

Campos: id integer; name string; description string o null; price string decimal.
Sin servicios: HTTP 200, `{"data":[]}`. Los inactivos no aparecen; no hace falta exponer isActive en esta consulta.
Los ejemplos son ficticios y no afirman que esos servicios existan en el repositorio.

## 3. POST /api/orders

Crea una visita con un único servicio. Solicitud:

```http
POST /api/orders
Content-Type: application/json
```

```json
{
  "plate": "abc-123",
  "customerName": "Juan Pérez",
  "customerPhone": "+51987654321",
  "serviceId": 1
}
```

| Campo         | Tipo JSON     | Obligatorio | Regla                                                            |
| ------------- | ------------- | ----------- | ---------------------------------------------------------------- |
| plate         | string        | Sí          | Formato y normalización del modelo; salida ABC123                |
| customerName  | string        | Sí          | Trim, 1–100 caracteres                                           |
| customerPhone | string o null | No          | Omitido/vacío = null; signo + opcional y 7–15 dígitos            |
| serviceId     | number entero | Sí          | 1–4294967295; servicio existente y activo; no aceptar string "1" |

El cuerpo debe ser un objeto JSON, no array ni null. Rechazar campos desconocidos con 422. En particular no aceptar id, status, serviceName, servicePrice ni fechas: los calcula el servidor. No aceptar varios servicios.

Se aplica primero la validación del cuerpo; luego se comprueba el servicio; después se inserta con garantía de placa única activa. Si hay varios problemas de campos, devolverlos en details. Si el servicio no está disponible y la placa también está ocupada, prevalece SERVICE_UNAVAILABLE.

HTTP 201, después de COMMIT:

```json
{
  "data": {
    "id": 42,
    "plate": "ABC123",
    "customerName": "Juan Pérez",
    "customerPhone": "+51987654321",
    "serviceId": 1,
    "serviceName": "Lavado básico",
    "servicePrice": "20.00",
    "status": "waiting",
    "createdAt": "2026-10-25T18:30:00.000Z",
    "updatedAt": "2026-10-25T18:30:00.000Z"
  }
}
```

HTTP 201 es la señal de éxito; la interfaz puede mostrar “Orden registrada correctamente.”. No requiere otro campo message.
No se define GET por ID en este sprint ni se anuncia una URL de recurso inexistente.

El objeto de orden de esta respuesta es exactamente el mismo utilizado por GET /api/orders.
customerPhone puede ser null; el resto de los campos del objeto no son nulos.
Los precios y nombres corresponden a lo conservado en la orden aunque el catálogo cambie.

## 4. GET /api/orders

Devuelve únicamente órdenes activas: waiting, washing y ready. Orden estable por created_at ASC y, ante empate, id ASC (atención de la más antigua primero). No recibe cuerpo ni parámetros.
HTTP 200:

```json
{
  "data": [
    {
      "id": 42,
      "plate": "ABC123",
      "customerName": "Juan Pérez",
      "customerPhone": "+51987654321",
      "serviceId": 1,
      "serviceName": "Lavado básico",
      "servicePrice": "20.00",
      "status": "waiting",
      "createdAt": "2026-10-25T18:30:00.000Z",
      "updatedAt": "2026-10-25T18:30:00.000Z"
    }
  ]
}
```

Sin órdenes activas: HTTP 200, `{"data":[]}`. delivered y cancelled permanecen guardadas, pero no se devuelven aquí.
Etiquetas: waiting = En espera; washing = En lavado; ready = Listo para entregar.
El cambio de estado, cancelación y consulta de historial están fuera del contrato actual.

## 5. Errores

| HTTP | code                    | message exacto                                                      | Cuándo                                                               |
| ---- | ----------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 400  | INVALID_JSON            | El cuerpo de la solicitud no contiene JSON válido.                  | JSON mal formado                                                     |
| 415  | UNSUPPORTED_MEDIA_TYPE  | Usa Content-Type: application/json.                                 | POST con otro tipo de contenido o sin él                             |
| 422  | VALIDATION_ERROR        | Revisa los datos de la orden.                                       | Campos ausentes, tipos, formato, longitud o propiedades desconocidas |
| 422  | SERVICE_UNAVAILABLE     | El servicio seleccionado no está disponible.                        | serviceId válido en formato, pero inexistente o inactivo             |
| 409  | ACTIVE_ORDER_EXISTS     | La placa ya tiene una orden activa.                                 | Conflicto del índice único de placa activa                           |
| 503  | TEMPORARILY_UNAVAILABLE | El servicio no está disponible temporalmente. Inténtalo nuevamente. | BD inaccesible o conflicto transitorio no recuperado                 |
| 500  | INTERNAL_ERROR          | No se pudo completar la operación. Inténtalo nuevamente.            | Fallo inesperado                                                     |

GET puede devolver 500 o 503. Los errores del parser de Express deben convertirse al contrato; no devolver HTML ni trazas SQL.
Para un POST con Content-Type JSON y cuerpo vacío, devolver 422 VALIDATION_ERROR con field body.

Ejemplo HTTP 422:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Revisa los datos de la orden.",
    "details": [
      {
        "field": "plate",
        "message": "Ingresa una placa válida de seis caracteres."
      },
      { "field": "customerName", "message": "Ingresa el nombre del cliente." }
    ]
  }
}
```

Mensajes de campo acordados:

| field / condición                                 | message                                                        |
| ------------------------------------------------- | -------------------------------------------------------------- |
| body no es objeto o está ausente                  | Envía un objeto JSON con los datos de la orden.                |
| plate ausente, tipo incorrecto o formato inválido | Ingresa una placa válida de seis caracteres.                   |
| customerName ausente, vacío o tipo incorrecto     | Ingresa el nombre del cliente.                                 |
| customerName demasiado largo                      | El nombre del cliente admite hasta 100 caracteres.             |
| customerPhone inválido                            | Ingresa un teléfono de 7 a 15 dígitos, con + inicial opcional. |
| serviceId inválido o ausente                      | Selecciona un servicio válido.                                 |
| propiedad desconocida                             | Este campo no está permitido.                                  |

Para SERVICE_UNAVAILABLE: details contiene `{"field":"serviceId","message":"El servicio seleccionado no está disponible."}`.
Para ACTIVE_ORDER_EXISTS: details contiene `{"field":"plate","message":"La placa ya tiene una orden activa."}`.
Para 400, 415, 500 y 503: details es [].
Ante VALIDATION_ERROR, ordenar detalles por nombre de campo ASC para mantener resultados reproducibles.

Ejemplo HTTP 409:

```json
{
  "error": {
    "code": "ACTIVE_ORDER_EXISTS",
    "message": "La placa ya tiene una orden activa.",
    "details": [
      { "field": "plate", "message": "La placa ya tiene una orden activa." }
    ]
  }
}
```

Un fallo de red sin respuesta HTTP no tiene este JSON; React muestra “No se pudo conectar con el backend. Verifica que esté disponible.” y conserva los datos ingresados.
Deshabilitar el botón durante el envío evita dobles clics; la garantía ante concurrencia está en MySQL. No se promete idempotencia de POST: si se pierde una respuesta, consultar las órdenes antes de reenviar automáticamente.

## 6. Integración y comprobaciones previstas

| Caso                                                           | Resultado esperado                                           |
| -------------------------------------------------------------- | ------------------------------------------------------------ |
| Consultas sin datos                                            | 200 y data []                                                |
| Catálogo con activo e inactivo                                 | Solo aparece el activo                                       |
| Creación válida y posterior GET                                | 201; mismo id y datos; visible después de recargar           |
| Sin placa / serviceId string / status enviado                  | 422 VALIDATION_ERROR; no se inserta                          |
| JSON mal formado                                               | 400 INVALID_JSON                                             |
| Servicio inexistente o inactivo                                | 422 SERVICE_UNAVAILABLE                                      |
| Placas abc-123 y ABC123, con primera activa                    | Primera 201; segunda 409                                     |
| Dos POST simultáneos de la misma placa libre y servicio activo | Exactamente un 201 y un 409; una fila nueva                  |
| Cambio de precio/nombre en catálogo de prueba                  | Orden conserva serviceName y servicePrice originales         |
| Orden delivered/cancelled preparada en BD de prueba            | No aparece en GET; permite nueva visita de esa placa         |
| Backend apagado / BD inaccesible                               | Error de red en React / HTTP 503 si Express sigue disponible |


