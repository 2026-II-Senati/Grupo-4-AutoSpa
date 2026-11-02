# Casos de prueba - Sprint 3

## 1. Información general

| Campo | Información |
|---|---|
| Proyecto | AutoSpa |
| Sprint | Sprint 3 |
| Responsable QA | Heison Joel Núñez Edquen |
| Rama base | develop |
| Commit de referencia | c134347 |
| Entorno | Local |
| Backend | Node.js / Express |
| Frontend | React / Vite |
| Base de datos | MySQL 8.0.46 |
| URL backend | http://localhost:3001 |
| URL frontend | http://localhost:3000 |
| Base de datos de pruebas | autospa_qa_sprint3 |

## 2. Objetivo

Documentar los casos de prueba funcionales previstos para Sprint 3, incluyendo sus precondiciones, datos de prueba, pasos, resultados esperados y referencias técnicas.

Los casos permiten verificar las funcionalidades disponibles y preparar la validación de los módulos pendientes de integración.

La documentación diferencia el contrato actualmente implementado de las reglas de negocio y del diseño previsto para entregas posteriores.

## 3. Alcance de implementación

### 3.1. Operaciones disponibles en el backend

| Método | Endpoint | Funcionalidad | Disponibilidad |
|---|---|---|---|
| GET | `/api/health` | Verificar disponibilidad del backend | Implementado |
| GET | `/api/services` | Consultar servicios activos | Implementado |
| GET | `/api/orders` | Consultar órdenes activas | Implementado |
| POST | `/api/orders` | Registrar una orden | Implementado |

### 3.2. Operaciones pendientes

No se identificaron endpoints implementados para autenticación, cambios de estado, cancelación, administración de servicios, historial ni indicadores.

Estos módulos se encuentran definidos en las reglas de negocio o en el diseño del modelo de datos, pero sus operaciones deben integrarse antes de ejecutar los casos correspondientes.

## 4. Matriz de casos de prueba

| ID | Módulo | Caso de prueba | Resultado esperado | Estado |
|---|---|---|---|---|
| QA-01 | Autenticación | Iniciar sesión con credenciales válidas | Permitir acceso al usuario autorizado | Pendiente de implementación |
| QA-02 | Autenticación | Iniciar sesión con credenciales incorrectas | Rechazar acceso y mostrar error | Pendiente de implementación |
| QA-03 | Autenticación | Cerrar sesión | Finalizar la sesión del usuario | Pendiente de implementación |
| QA-04 | Autenticación | Intentar acceder sin sesión | Restringir vistas protegidas | Pendiente de implementación |
| QA-05 | Seguimiento | Consultar estado de una orden | Mostrar el estado actual | Pendiente de implementación |
| QA-06 | Seguimiento | Intentar una transición no permitida | Rechazar el cambio de estado | Pendiente de implementación |
| QA-07 | Seguimiento | Realizar una transición permitida | Actualizar correctamente el estado | Pendiente de implementación |
| QA-08 | Cancelación | Cancelar una orden en espera indicando motivo | Cancelar y conservar el motivo | Pendiente de implementación |
| QA-09 | Cancelación | Intentar cancelar una orden en lavado | Rechazar la cancelación | Pendiente de implementación |
| QA-10 | Servicios | Crear un servicio | Guardar el servicio correctamente | Pendiente de implementación |
| QA-11 | Servicios | Editar un servicio | Actualizar sus datos | Pendiente de implementación |
| QA-12 | Servicios | Activar un servicio inactivo | Habilitarlo para nuevas órdenes | Pendiente de implementación |
| QA-13 | Servicios | Desactivar un servicio | Impedir su selección en nuevas órdenes | Pendiente de implementación |
| QA-14 | Servicios | Consultar una orden asociada a un servicio modificado | Conservar nombre y precio originales | Pendiente de implementación |
| QA-15 | Historial | Consultar órdenes completadas | Mostrar las órdenes finalizadas | Pendiente de implementación |
| QA-16 | Resumen | Consultar resumen por período | Mostrar información del período seleccionado | Pendiente de implementación |
| QA-17 | Resumen | Comparar resumen con órdenes registradas | Mantener coherencia de los totales | Pendiente de implementación |
| QA-18 | Cancelación | Intentar cancelar una orden en espera sin indicar motivo | Rechazar la solicitud y exigir un motivo | Pendiente de implementación |

## 5. Casos de prueba detallados

### QA-01. Iniciar sesión con credenciales válidas

- **Objetivo:** verificar el acceso del personal con credenciales correctas.
- **Precondición:** disponer de un usuario activo registrado.
- **Datos:** correo y contraseña válidos.
- **Pasos:**
  1. Abrir la aplicación.
  2. Acceder a la vista de inicio de sesión.
  3. Ingresar el correo registrado.
  4. Ingresar la contraseña correspondiente.
  5. Seleccionar iniciar sesión.
- **Resultado esperado:** permitir el acceso al usuario autorizado.
- **Referencia API:** autenticación no implementada en el contrato actual.
- **Estado:** Pendiente de implementación.

### QA-02. Iniciar sesión con credenciales incorrectas

- **Objetivo:** comprobar que no se permita el acceso con credenciales incorrectas.
- **Precondición:** disponer de la vista de inicio de sesión.
- **Datos:** correo registrado y contraseña incorrecta.
- **Pasos:**
  1. Abrir la vista de inicio de sesión.
  2. Ingresar el correo registrado.
  3. Ingresar una contraseña incorrecta.
  4. Intentar iniciar sesión.
- **Resultado esperado:** rechazar el acceso y mostrar un mensaje de error.
- **Referencia API:** autenticación no implementada.
- **Estado:** Pendiente de implementación.

### QA-03. Cerrar sesión

- **Objetivo:** verificar que el usuario pueda finalizar su sesión.
- **Precondición:** usuario con sesión iniciada.
- **Datos:** usuario autenticado.
- **Pasos:**
  1. Iniciar sesión.
  2. Ubicar la opción para cerrar sesión.
  3. Seleccionar cerrar sesión.
  4. Intentar ingresar nuevamente a una vista protegida.
- **Resultado esperado:** finalizar la sesión y restringir el acceso posterior.
- **Referencia API:** autenticación y gestión de sesiones no implementadas.
- **Estado:** Pendiente de implementación.

### QA-04. Intentar acceder sin sesión

- **Objetivo:** verificar la protección de las vistas restringidas.
- **Precondición:** disponer de una vista que requiera autenticación.
- **Datos:** navegador sin sesión autenticada.
- **Pasos:**
  1. Cerrar la sesión o abrir una ventana privada.
  2. Intentar ingresar directamente a una ruta protegida.
  3. Observar el comportamiento de la aplicación.
- **Resultado esperado:** impedir el acceso sin autenticación.
- **Referencia API:** middleware de autenticación no implementado.
- **Estado:** Pendiente de implementación.

### QA-05. Consultar el estado de una orden

- **Objetivo:** comprobar que se muestre el estado actual de una orden.
- **Precondición:** disponer de una orden registrada.
- **Datos:** orden de prueba con placa `QA1234`.
- **Pasos:**
  1. Abrir la aplicación.
  2. Consultar el listado de órdenes.
  3. Localizar la orden por su placa.
  4. Verificar el estado mostrado.
- **Resultado esperado:** mostrar correctamente el estado de la orden.
- **Referencia API disponible:** `GET /api/orders`, que devuelve únicamente órdenes activas.
- **Respuesta esperada:** HTTP 200 con la propiedad `data`.
- **Limitación:** no existe una consulta individual por ID ni una API de historial.
- **Estado:** Pendiente de implementación del módulo de seguimiento.

### QA-06. Intentar una transición de estado no permitida

- **Objetivo:** comprobar que el sistema rechace cambios de estado no permitidos.
- **Precondición:** disponer de una orden y de operaciones de cambio de estado implementadas.
- **Datos:** orden en estado `waiting`; intentar pasar directamente a `delivered`.
- **Pasos:**
  1. Registrar o seleccionar una orden en espera.
  2. Intentar cambiar directamente su estado a entregado.
  3. Consultar nuevamente el estado.
- **Resultado esperado:** rechazar la transición y conservar el estado anterior.
- **Referencia técnica:** `docs/modelo-datos.md`, sección 8.
- **Referencia API:** no existe endpoint de cambio de estado.
- **Estado:** Pendiente de implementación.

### QA-07. Realizar una transición permitida

- **Objetivo:** comprobar la actualización de una orden mediante una transición permitida.
- **Precondición:** disponer del módulo de seguimiento integrado.
- **Datos:** orden en estado `waiting`; transición prevista a `washing`.
- **Pasos:**
  1. Seleccionar una orden en espera.
  2. Ejecutar la transición a en lavado.
  3. Consultar nuevamente la orden.
  4. Verificar el estado actualizado.
- **Resultado esperado:** actualizar el estado a `washing` y registrar el cambio correspondiente.
- **Referencia técnica:** `docs/modelo-datos.md`, sección 8.
- **Referencia API:** no existe endpoint de cambio de estado.
- **Estado:** Pendiente de implementación.

### QA-08. Cancelar una orden en espera indicando motivo

- **Objetivo:** verificar la cancelación de una orden en espera y la conservación del motivo.
- **Precondición:** disponer del módulo de cancelación integrado y de una orden en estado `waiting`.
- **Datos:** placa `CAN801`; motivo de prueba: `Solicitud del cliente`.
- **Pasos:**
  1. Seleccionar una orden en espera.
  2. Elegir la opción de cancelar.
  3. Ingresar el motivo indicado.
  4. Confirmar la operación.
  5. Verificar el estado de la orden y el motivo registrado.
- **Resultado esperado:** cambiar el estado a `cancelled` y conservar el motivo en el registro de auditoría.
- **Referencia técnica:** `docs/reglas-negocio.md` y `docs/modelo-datos.md`, sección 8.
- **Referencia API:** no existe endpoint de cancelación.
- **Estado:** Pendiente de implementación.

### QA-09. Intentar cancelar una orden en lavado

- **Objetivo:** comprobar que no se permita cancelar una orden que ya está en lavado.
- **Precondición:** disponer del módulo de cancelación integrado y de una orden en estado `washing`.
- **Datos:** placa `CAN902`; estado `washing`.
- **Pasos:**
  1. Seleccionar una orden en lavado.
  2. Intentar ejecutar la opción de cancelación.
  3. Observar la respuesta del sistema.
  4. Consultar nuevamente el estado.
- **Resultado esperado:** rechazar la cancelación y conservar el estado `washing`.
- **Referencia técnica:** `docs/reglas-negocio.md`.
- **Referencia API:** no existe endpoint de cancelación.
- **Estado:** Pendiente de implementación.

### QA-10. Crear un servicio

- **Objetivo:** verificar que se pueda registrar un nuevo servicio.
- **Precondición:** disponer del módulo de administración de servicios.
- **Datos:** nombre `Lavado de prueba`; precio `25.00`; descripción `Servicio de prueba`.
- **Pasos:**
  1. Acceder a la administración de servicios.
  2. Seleccionar crear servicio.
  3. Ingresar los datos de prueba.
  4. Guardar.
  5. Verificar que el servicio aparezca en el listado.
- **Resultado esperado:** guardar el servicio con sus datos.
- **Referencia API:** no existe endpoint POST para servicios.
- **Estado:** Pendiente de implementación.

### QA-11. Editar un servicio

- **Objetivo:** verificar la actualización de los datos de un servicio.
- **Precondición:** disponer del módulo de administración y de un servicio existente.
- **Datos:** servicio de prueba; nuevo precio `30.00`.
- **Pasos:**
  1. Seleccionar un servicio existente.
  2. Elegir editar.
  3. Modificar el precio.
  4. Guardar los cambios.
  5. Consultar nuevamente el servicio.
- **Resultado esperado:** mostrar los datos actualizados.
- **Referencia API:** no existe endpoint PUT o PATCH para servicios.
- **Estado:** Pendiente de implementación.

### QA-12. Activar un servicio inactivo

- **Objetivo:** verificar que un servicio inactivo pueda habilitarse para nuevas órdenes.
- **Precondición:** disponer de la administración de servicios.
- **Datos:** servicio inactivo de prueba.
- **Pasos:**
  1. Consultar los servicios administrables.
  2. Seleccionar un servicio inactivo.
  3. Ejecutar la opción de activación.
  4. Consultar los servicios disponibles.
- **Resultado esperado:** habilitar el servicio para nuevas órdenes.
- **Referencia API disponible:** `GET /api/services` devuelve solamente servicios activos.
- **Referencia API pendiente:** operación de activación no implementada.
- **Estado:** Pendiente de implementación.

### QA-13. Desactivar un servicio

- **Objetivo:** verificar que un servicio desactivado no pueda seleccionarse en nuevas órdenes.
- **Precondición:** disponer de un servicio activo y de la administración de servicios.
- **Datos:** servicio activo de prueba.
- **Pasos:**
  1. Seleccionar un servicio activo.
  2. Ejecutar la opción de desactivación.
  3. Consultar `GET /api/services`.
  4. Intentar registrar una orden utilizando el ID del servicio desactivado.
- **Resultado esperado:** el servicio deja de aparecer en el catálogo disponible y el backend rechaza su utilización con HTTP 422 y código `SERVICE_UNAVAILABLE`.
- **Referencia API:** `GET /api/services` y `POST /api/orders`.
- **Limitación:** la operación de desactivación del servicio no está implementada. El rechazo de un servicio ya inactivo sí está implementado en el registro de órdenes.
- **Estado:** Pendiente de implementación de la administración de servicios.

### QA-14. Consultar una orden asociada a un servicio modificado

- **Objetivo:** verificar que una orden conserve el nombre y precio del servicio registrados inicialmente.
- **Precondición:** disponer de una orden y de la administración de servicios.
- **Datos:** registrar una orden con el servicio ID `1`, cuyo precio inicial en la base de pruebas es `20.00`.
- **Pasos:**
  1. Registrar una orden con el servicio seleccionado.
  2. Guardar el nombre y precio devueltos.
  3. Modificar posteriormente el servicio desde la administración.
  4. Consultar nuevamente la orden.
  5. Comparar los datos originales con los actuales.
- **Resultado esperado:** conservar en la orden el nombre y precio originales.
- **Referencia API:** `POST /api/orders` y `GET /api/orders`.
- **Referencia técnica:** `docs/modelo-datos.md`, sección 5.
- **Estado:** Pendiente de ejecución integral con administración de servicios.

### QA-15. Consultar órdenes completadas

- **Objetivo:** verificar que se puedan consultar las órdenes entregadas o canceladas.
- **Precondición:** disponer del módulo de historial integrado y de órdenes finalizadas.
- **Datos:** órdenes en estados `delivered` y `cancelled`.
- **Pasos:**
  1. Ingresar al módulo de historial.
  2. Consultar las órdenes finalizadas.
  3. Verificar sus placas, servicios, precios y estados.
- **Resultado esperado:** mostrar las órdenes finalizadas y conservar sus datos históricos.
- **Referencia técnica:** `docs/reglas-negocio.md` y `docs/modelo-datos.md`.
- **Limitación:** `GET /api/orders` consulta únicamente órdenes activas.
- **Estado:** Pendiente de implementación.

### QA-16. Consultar resumen por período

- **Objetivo:** verificar que los indicadores presenten información del período seleccionado.
- **Precondición:** disponer del módulo de indicadores integrado y de órdenes registradas en diferentes fechas.
- **Datos:** período de prueba con fechas de inicio y fin definidas.
- **Pasos:**
  1. Acceder al módulo de resumen.
  2. Seleccionar el período de consulta.
  3. Ejecutar la búsqueda.
  4. Verificar la información presentada.
- **Resultado esperado:** mostrar los indicadores correspondientes al período seleccionado.
- **Referencia técnica:** `docs/reglas-negocio.md`.
- **Referencia API:** no existe endpoint de indicadores.
- **Estado:** Pendiente de implementación.

### QA-17. Comparar resumen con órdenes registradas

- **Objetivo:** comprobar que los totales del resumen coincidan con las órdenes que corresponden al período.
- **Precondición:** disponer del módulo de indicadores y de órdenes de prueba.
- **Datos:** órdenes registradas dentro y fuera del período seleccionado, con diferentes estados.
- **Pasos:**
  1. Consultar el resumen del período.
  2. Obtener las órdenes correspondientes a ese período.
  3. Comparar los totales y estados.
  4. Verificar que las órdenes fuera del período no alteren los resultados.
- **Resultado esperado:** mantener coherencia entre los indicadores y las órdenes registradas.
- **Referencia técnica:** `docs/reglas-negocio.md` y `docs/modelo-datos.md`, sección 9.
- **Referencia API:** no existe endpoint de indicadores.
- **Estado:** Pendiente de implementación.

### QA-18. Intentar cancelar una orden sin indicar motivo

- **Objetivo:** verificar que el sistema exija un motivo para cancelar una orden en espera.
- **Precondición:** disponer del módulo de cancelación integrado y de una orden en estado `waiting`.
- **Datos:** placa `CAN803`; motivo omitido, vacío o compuesto únicamente por espacios.
- **Pasos:**
  1. Seleccionar una orden en espera.
  2. Elegir la opción de cancelar.
  3. Dejar vacío el campo del motivo.
  4. Intentar confirmar la cancelación.
  5. Consultar nuevamente el estado de la orden.
- **Resultado esperado:** rechazar la cancelación, solicitar un motivo válido y conservar la orden en estado `waiting`.
- **Referencia técnica:** `docs/reglas-negocio.md` y `docs/modelo-datos.md`, sección 8. El diseño establece un motivo obligatorio de 1 a 255 caracteres para las cancelaciones.
- **Referencia API:** no existe endpoint de cancelación ni validación implementada para esta operación.
- **Estado:** Pendiente de implementación.

## 6. Contrato de API y referencias técnicas

### 6.1. Registro de órdenes

**Endpoint:** `POST /api/orders`

**Content-Type:** `application/json`

Ejemplo de solicitud:

```json
{
  "plate": "QA1234",
  "customerName": "Carlos QA Prueba",
  "customerPhone": "987654321",
  "serviceId": 1
}
```

Validaciones principales:

- `plate`: formato de tres caracteres alfanuméricos seguidos de tres números; guion opcional entre ambos grupos. Se normaliza a mayúsculas y sin guion.
- `customerName`: obligatorio, entre 1 y 100 caracteres después de aplicar trim.
- `customerPhone`: opcional; si se proporciona, entre 7 y 15 dígitos, con signo `+` inicial opcional.
- `serviceId`: obligatorio, número entero positivo.
- No se permiten propiedades adicionales.
- El servicio debe existir y estar activo.
- No puede existir otra orden activa con la misma placa.

Respuestas principales:

| HTTP | Código | Descripción |
|---|---|---|
| 201 | Éxito | Orden registrada |
| 400 | `INVALID_JSON` | JSON mal formado |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | Tipo de contenido no admitido |
| 422 | `VALIDATION_ERROR` | Datos inválidos |
| 422 | `SERVICE_UNAVAILABLE` | Servicio inexistente o inactivo |
| 409 | `ACTIVE_ORDER_EXISTS` | Placa con orden activa |
| 503 | `TEMPORARILY_UNAVAILABLE` | Indisponibilidad temporal |
| 500 | `INTERNAL_ERROR` | Error inesperado |

### 6.2. Consulta de órdenes activas

**Endpoint:** `GET /api/orders`

- Devuelve órdenes en estados `waiting`, `washing` y `ready`.
- Ordena por fecha de creación ascendente y después por ID.
- Responde HTTP 200 con `{ "data": [...] }`.
- Las órdenes entregadas o canceladas no aparecen en esta consulta.

### 6.3. Consulta de servicios disponibles

**Endpoint:** `GET /api/services`

- Devuelve únicamente servicios activos.
- Ordena los resultados por ID ascendente.
- Responde HTTP 200 con `{ "data": [...] }`.
- Si no existen servicios activos, devuelve una lista vacía.

### 6.4. Verificación de salud

**Endpoint:** `GET /api/health`

Respuesta esperada: HTTP 200.

```json
{
  "message": "Backend de AutoSpa disponible"
}
```

### 6.5. Referencias del código fuente

| Elemento | Archivo |
|---|---|
| Montaje de rutas y middleware | `backend/src/server.js` |
| Rutas de órdenes | `backend/src/routes/orders.routes.js` |
| Controlador de órdenes | `backend/src/controllers/orders.controller.js` |
| Validación de órdenes | `backend/src/validators/orders.validator.js` |
| Lógica de registro | `backend/src/services/orders.service.js` |
| Consulta de órdenes activas | `backend/src/repositories/orders.repository.js` |
| Modelo de órdenes y estados | `backend/src/models/order.model.js` |
| Migración de órdenes | `backend/src/db/migrations/20261026000002-create-orders.js` |

### 6.6. Documentación complementaria

- `docs/api.md`: contrato inicial de la API y catálogo de errores.
- `docs/reglas-negocio.md`: reglas funcionales del proyecto.
- `docs/modelo-datos.md`: entidades, relaciones, estados y diseño de auditoría.
- `docs/comprobaciones.md`: comprobaciones técnicas y evidencias correspondientes.
- `docs/instalacion.md`: instalación y configuración del entorno.

## 7. Criterios de ejecución

1. Ejecutar los casos funcionales cuando el módulo correspondiente esté integrado en `develop`.
2. Utilizar datos ficticios y una base de datos de pruebas independiente.
3. Registrar los datos de entrada utilizados y las respuestas obtenidas.
4. Adjuntar capturas o registros que permitan verificar el resultado.
5. No marcar un caso como aprobado sin evidencia de su ejecución.
6. Mantener pendientes los casos cuya funcionalidad todavía no esté implementada.
7. Registrar los defectos encontrados mediante Jira o comentarios en el Pull Request.
8. Repetir las pruebas afectadas después de corregir un defecto.

## 8. Observaciones

- QA-01 a QA-04 dependen de la integración de autenticación.
- QA-05 a QA-07 dependen de la implementación de seguimiento y cambios de estado.
- QA-08, QA-09 y QA-18 dependen de la implementación de cancelación y validación del motivo.
- QA-10 a QA-13 dependen de la administración de servicios. La consulta de servicios activos y el rechazo de servicios inactivos durante el registro sí están implementados.
- QA-14 requiere integrar la administración para comprobar el cambio del catálogo frente a una orden ya registrada.
- QA-15 depende de la consulta de historial.
- QA-16 y QA-17 dependen del módulo de indicadores.
- Los casos QA-01 a QA-18 están documentados, pero no se consideran pruebas aprobadas.

## 9. Conclusión

Se documentaron 18 casos de prueba funcionales para Sprint 3, con sus objetivos, precondiciones, datos de prueba, pasos, resultados esperados y referencias técnicas.

La documentación distingue las operaciones disponibles en el backend de las funcionalidades previstas para entregas posteriores. La ejecución y aprobación de cada caso dependerá de la integración de su respectivo módulo y de la presentación de evidencias verificables.