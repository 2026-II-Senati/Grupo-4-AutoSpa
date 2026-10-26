# PFA-13 — Consultar servicios disponibles y órdenes activas

Esta documentación corresponde únicamente a la PFA-13. El backend expone dos consultas de lectura para que el frontend pueda mostrar el catálogo disponible y las órdenes que siguen activas. Ambas consultan MySQL; no usan listas ficticias como respuesta.

## Alcance de esta tarea

- `GET /api/services`: devuelve servicios activos con `id`, `name` y `price`, ordenados por identificador ascendente.
- `GET /api/orders`: devuelve órdenes en los estados activos del contrato (`En espera`, `En lavado`, `Listo para entregar`), ordenadas por fecha de ingreso y luego por identificador.
- La orden incluye identificador, placa, datos acordados del cliente, servicio, precio histórico, estado y fecha de ingreso.
- Si no hay servicios disponibles o no hay órdenes activas, la respuesta es HTTP 200 con `[]`.
- `GET /api/health` se conserva para comprobar que el servidor responde.

PFA-13 no recibe datos para crear órdenes. La ruta de registro es una dependencia de otra tarea; al integrarse, sus órdenes serán visibles mediante `GET /api/orders`.

## Respuestas de ejemplo

`GET /api/services`:

```json
[
  { "id": 1, "name": "Lavado básico", "price": 30 },
  { "id": 2, "name": "Lavado premium", "price": 50 }
]
```

`GET /api/orders`:

```json
[
  {
    "id": 21,
    "licensePlate": "ABC123",
    "customerName": "Ana Pérez",
    "customerPhone": "+51987654321",
    "serviceId": 1,
    "serviceName": "Lavado básico",
    "price": 30,
    "status": "En espera",
    "enteredAt": "2026-10-25T14:00:00.000Z"
  }
]
```

El nombre y el precio de la orden salen de la instantánea guardada al registrarla, aunque el servicio del catálogo cambie después.

## Uso

La implementación usa los modelos `Service` y `Order` y la configuración Sequelize que integra la base de datos del backend. Requiere Node.js/npm de la versión acordada por el proyecto y una conexión MySQL configurada en el entorno.

Cuando la configuración de persistencia esté integrada, inicia el servidor desde `backend/`:

```powershell
npm start
```

El puerto predeterminado es **3001**. Si está ocupado, puedes iniciar esta instancia en otro puerto:

```powershell
$env:PORT = '3003'
npm start
```

En una segunda terminal de PowerShell consulta las rutas; usa el mismo puerto con el que iniciaste el servidor:

```powershell
Invoke-RestMethod http://localhost:3001/api/health
Invoke-RestMethod http://localhost:3001/api/services | ConvertTo-Json -Depth 5
Invoke-RestMethod http://localhost:3001/api/orders | ConvertTo-Json -Depth 5
```

Si usaste el puerto 3003, reemplaza `3001` por `3003` en las tres URL. Detén el backend con `Ctrl+C` en la primera terminal.

## Errores de consulta

Un fallo al consultar MySQL responde HTTP 500 con este formato, sin mostrar detalles internos:

```json
{ "code": "INTERNAL_ERROR", "message": "No fue posible procesar la solicitud" }
```
