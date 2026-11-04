# Guía de comprobaciones de AutoSpa

## 1. Objetivo y criterio de evidencia

Este ticket incluye preparar la guía, ejecutar comprobaciones, registrar evidencia y obtener revisión de Castillo. Se comprueba la instalación y el flujo frontend/API/MySQL reales; no basta con escribir resultados esperados.

El alcance definido y la implementación disponible están separados en el [README](../README.md). El [contrato API](api.md) determina respuestas, formatos y obligatoriedad; no se duplican aquí todas sus reglas.

## 2. Preparación común

- Seguir [instalación](instalacion.md) en un clon nuevo y una base MySQL exclusiva vacía; registrar SO, versiones, rama y commit.
- Instalar ambos lockfiles y preparar migraciones/datos de prueba sin reset ni eliminación de seeders en bases existentes.
- Usar Vite separado para probar backend apagado: la interfaz debe seguir disponible. En el modo compilado, detener Express también interrumpe el servidor de la interfaz.
- Mantener VITE_USE_MOCK_API=false al iniciar Vite o compilar. No usar datos de localStorage como evidencia de persistencia MySQL.
- Elegir placas de prueba libres y servicios activos/inactivos conocidos. Modificar catálogo únicamente en la base exclusiva.
- Registrar URL/puertos realmente utilizados. Guardar respuestas HTTP, consultas de verificación y, cuando haya navegador, capturas o descripción visual verificable sin secretos ni datos reales de clientes.
- El botón «Comprobar conexión» está en la bienvenida al seleccionar «Historial» u otra sección distinta de «Órdenes activas». Esa pantalla no implica que el módulo esté implementado.

## 3. Casos de comprobación

La tabla restaura los doce casos y separa acciones de expectativas. Los resultados obtenidos se registran en la sección 4; no se marcan como aprobados por inspección de código.

| Caso | Comprobación y preparación específica | Pasos | Resultado esperado |
| --- | --- | --- | --- |
| CP-01 | Apertura del frontend; entorno común listo | Iniciar Vite, abrir la URL indicada y observar formulario, lista y navegación. Repetir con build servido por Express. | Interfaz visible y utilizable, sin errores que impidan el uso. Entregar HTML por HTTP o compilar no sustituye esta observación. |
| CP-02 | Salud del backend con MySQL disponible | Iniciar API; consultar directamente GET /api/health y guardar estado/cuerpo. | HTTP 200 y {"message":"Backend de AutoSpa disponible"}. |
| CP-03 | Comunicación con backend encendido | En navegador seleccionar Historial, pulsar Comprobar conexión y volver a Órdenes activas; revisar peticiones de servicios y órdenes. | Health muestra su mensaje; GET services/orders reciben HTTP 200 con data, y la interfaz presenta resultados o lista vacía correctamente. |
| CP-04 | Backend apagado con Vite activo | Detener solo el backend de prueba, mantener Vite/navegador; pulsar Comprobar conexión y navegar. | Mensaje comprensible de conexión fallida; interfaz utilizable. No se confunde un fallo de red con HTTP 503 de una API aún encendida. |
| CP-05 | Recuperación tras CP-04 | Reiniciar el mismo backend con la misma BD, comprobar health y reintentar desde la interfaz sin reiniciar Vite. | Health 200 y recuperación de conexión. La lista puede reconsultarse; documentar si hace falta reintentar o recargar para recuperar servicios. |
| CP-06 | Orden válida con servicio activo y placa libre | Completar formulario; enviar; guardar respuesta POST, consultar GET orders y observar la lista. | HTTP 201 después del commit; orden visible por GET y en interfaz con mismo id y datos; estado waiting. |
| CP-07 | Persistencia tras CP-06 | Guardar id/datos; recargar navegador y revisar nueva petición GET orders y fila de la lista. | La orden guardada sigue en MySQL y vuelve a consultarse y mostrarse; no depende de memoria/localStorage ni se duplica al recargar. |
| CP-08 | Datos inválidos | Probar campos obligatorios vacíos en formulario. Por API enviar cuerpo vacío, serviceId string y campo desconocido; comparar filas antes/después. | La interfaz señala el problema. API devuelve HTTP 422 VALIDATION_ERROR con details según contrato y no inserta filas. La validación HTML puede impedir que el formulario envíe; no exige un HTTP para esa acción local. |
| CP-09 | Duplicado y normalización | Confirmar una placa libre (por ejemplo NUN123); crear con " nun-123 " y repetir con NUN123. Comprobar UI/API y filas; opcionalmente dos POST simultáneos con otra placa libre. | Primera 201 y placa NUN123; segunda 409 ACTIVE_ORDER_EXISTS, una sola activa. Concurrencia: un 201 y un 409, sin filas parciales. |
| CP-10 | Servicio inactivo | Preparar activo/inactivo; abrir opciones, consultar GET services e intentar POST directo con id inactivo, datos válidos y placa libre. | Inactivo ausente de opciones y GET. POST: 422 SERVICE_UNAVAILABLE, detalle serviceId y sin orden nueva. |
| CP-11 | Copia histórica | Registrar orden, guardar serviceName/servicePrice; cambiar catálogo solo en BD exclusiva; volver a GET y recargar lista. | La orden conserva nombre/precio históricos; precio string de dos posiciones. El catálogo actualizado no reescribe la orden existente. |
| CP-12 | Envío con backend no disponible | Con servicios cargados y formulario completo, detener solo backend, enviar, observar mensaje y editar campos; reiniciar y reintentar con cuidado. | Mensaje comprensible, interfaz utilizable y datos del formulario conservados. No se supone idempotencia: consultar órdenes antes de reenviar si se perdió una respuesta. |

## 4. Registro de resultados

Estados: **Pendiente** (no ejecutado), **Aprobado** (toda la comprobación indicada pasó), **Fallido** (resultado observado contradice lo esperado), **Bloqueado** (no puede completarse por una causa identificada). Un caso con tramo visual bloqueado no se aprueba por tener pruebas API aprobadas.

Fecha de esta ejecución: **2026-10-29, America/Lima**. Entorno **E1**: Windows, Node 24.22.1, npm 11.19.1, MySQL 8.0.46; clon local nuevo, API real y mocks del frontend desactivados. Commit probado **C1**: `2e8f2b701d868899b3eaeb76ff983a530aec365c` (merge de develop en la rama de Núñez). Las correcciones posteriores son exclusivamente documentales sin commit final.

Evidencia **EV**: [registro de ejecución PR #12](evidencias/pr12-2026-10-29.md). **B1**: servicio de automatización de navegador no disponible; inventario sin navegadores y error de conexión al pipe nativo. No se generaron capturas ni se afirma haber observado React en un navegador.

| Caso | Estado | Fecha | Entorno | Commit probado | Resultado obtenido y causa | Evidencia |
| --- | --- | --- | --- | --- | --- | --- |
| CP-01 | Bloqueado | 2026-10-29 | E1 | C1 | Instalación/build y HTML/asset HTTP 200 comprobados; falta apertura visual por B1. | [EV, E1/E4](evidencias/pr12-2026-10-29.md) |
| CP-02 | Aprobado | 2026-10-29 | E1 | C1 | Arranque con MySQL y health 200 con cuerpo exacto, en suite real y servidor aislado. | [EV, E3/E4](evidencias/pr12-2026-10-29.md) |
| CP-03 | Bloqueado | 2026-10-29 | E1 | C1 | GET reales aprobados; interacción del botón y presentación visual pendientes por B1. | [EV, E3/E4/E5](evidencias/pr12-2026-10-29.md) |
| CP-04 | Bloqueado | 2026-10-29 | E1 | C1 | No se observó interfaz con API apagada; B1. Prueba de BD inaccesible no equivale a este caso. | [EV, E5](evidencias/pr12-2026-10-29.md) |
| CP-05 | Bloqueado | 2026-10-29 | E1 | C1 | No se observó recuperación visual tras apagar/reiniciar; B1. | [EV, E5](evidencias/pr12-2026-10-29.md) |
| CP-06 | Bloqueado | 2026-10-29 | E1 | C1 | POST 201 seguido de GET idéntico aprobado en MySQL; envío y fila visual sin ejecutar por B1. | [EV, E3](evidencias/pr12-2026-10-29.md) |
| CP-07 | Bloqueado | 2026-10-29 | E1 | C1 | Persistencia y nueva consulta API comprobadas; recarga real del navegador pendiente por B1. | [EV, E3](evidencias/pr12-2026-10-29.md) |
| CP-08 | Bloqueado | 2026-10-29 | E1 | C1 | API devolvió 422 VALIDATION_ERROR y la comprobación adicional conservó los ids activos; validación visual pendiente por B1. | [EV, E3/E4](evidencias/pr12-2026-10-29.md) |
| CP-09 | Bloqueado | 2026-10-29 | E1 | C1 | API normalizó placa, rechazó duplicado con 409 y pasó concurrencia un 201/un 409; mensaje visual pendiente por B1. | [EV, E3](evidencias/pr12-2026-10-29.md) |
| CP-10 | Bloqueado | 2026-10-29 | E1 | C1 | GET excluyó inactivos y POST devolvió 422 SERVICE_UNAVAILABLE; selector visual pendiente por B1. | [EV, E3](evidencias/pr12-2026-10-29.md) |
| CP-11 | Bloqueado | 2026-10-29 | E1 | C1 | GET conservó copia histórica tras cambio del catálogo; recarga/lista visual pendientes por B1. | [EV, E3](evidencias/pr12-2026-10-29.md) |
| CP-12 | Bloqueado | 2026-10-29 | E1 | C1 | No se observó envío fallido ni conservación visual de campos; B1. | [EV, E5](evidencias/pr12-2026-10-29.md) |
| Instalación limpia automatizada | Aprobado | 2026-10-29 | E1 | C1 | Clon local nuevo, ambos npm ci, build real, BD nueva, dos migraciones y dos seeders sin pendientes. No acredita instalación por otra persona. | [EV, E1/E2](evidencias/pr12-2026-10-29.md) |
| Reproducción por otro integrante | Pendiente | — | Por registrar | Por registrar | Falta confirmación de otra persona desde su clon y base nueva. | Sin evidencia aún |
| Revisión de Castillo | Pendiente | — | PR #12 | Por registrar | No se solicitó ni inventó aprobación; corresponde al revisor. | Sin evidencia aún |

## 5. Revisión y condición de cierre

Revisar los **doce casos**, enlaces, tablas, comandos y coherencia con código/contrato. Registrar cada ejecución con caso, estado, fecha, entorno, commit, resultado obtenido y evidencia. Los defectos funcionales se reportan a las entregas de implementación; no se ocultan cambiando expectativas.

**Condición de cierre del ticket:** guía e instalación completas; comprobaciones ejecutadas con evidencia y fallos resueltos/recomprobados o limitaciones aceptadas expresamente en revisión; reproducción confirmada por otro integrante; revisión de Castillo e integración autorizada en develop. Preparar documentación no transfiere la ejecución a otros tickets ni cierra automáticamente este trabajo.

Estado actual: documentación preparada para revisión; ticket completo **no cerrado**, por bloqueo visual B1, reproducción independiente y revisión pendientes.
