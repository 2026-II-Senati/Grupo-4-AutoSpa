# Ejecución de pruebas BASE - Sprint 3

## 1. Información del entorno

| Campo | Información |
|---|---|
| Proyecto | AutoSpa |
| Responsable QA | Heison Joel Núñez Edquen |
| Fecha de ejecución | 02/11/2026 |
| Rama evaluada | develop |
| Commit evaluado | c134347 |
| Rama de documentación | feature/qa-sprint-3 |
| Sistema operativo | Windows |
| Backend | Node.js v24.22.1 / Express |
| Gestor de paquetes | npm 11.19.1 |
| Base de datos | MySQL 8.0.46 |
| Base de pruebas | autospa_qa_sprint3 |
| Frontend | React / Vite |
| URL local | http://localhost:3000 |
| API | http://localhost:3001 |

## 2. Preparación del entorno

Se actualizó el proyecto desde la rama `develop` hasta el commit `c134347`.

Se verificó la conexión con MySQL 8.0.46 y se preparó una base de datos independiente denominada `autospa_qa_sprint3`, evitando modificar la base de datos principal.

Se ejecutaron correctamente las migraciones y los datos iniciales.

**Resultado:**
- Conexión a MySQL: correcta.
- Migraciones: aplicadas.
- Datos iniciales: cargados.
- Migraciones pendientes: ninguna.
- Datos iniciales pendientes: ninguno.
- Backend: iniciado correctamente.
- Frontend: iniciado correctamente.

## 3. Resultados de las pruebas BASE

### BASE-01: Apertura de aplicación y consulta

**Procedimiento:**
1. Iniciar el backend y el frontend.
2. Abrir la aplicación en el navegador.
3. Consultar los servicios y las órdenes disponibles.
4. Verificar la respuesta de los endpoints de la API.

**Resultado esperado:** Mostrar la aplicación y permitir consultar los servicios y las órdenes disponibles.

**Resultado observado:** La aplicación abrió correctamente. La API devolvió HTTP 200 OK en los endpoints `/api/health`, `/api/services` y `/api/orders`. La interfaz mostró los servicios y las órdenes existentes.

**Estado:** APROBADO.

**Evidencia:** `../evidencias/BASE-01.png`

### BASE-02: Registro de orden válida

**Datos utilizados:**
- Cliente: Carlos QA Prueba.
- Teléfono: 987654321.
- Placa: QA1234.
- Servicio: Lavado básico.
- Precio: S/ 20.00.

**Procedimiento:**
1. Abrir el formulario de registro de órdenes.
2. Introducir los datos del cliente y del vehículo.
3. Seleccionar el servicio Lavado básico.
4. Presionar Registrar orden.
5. Verificar que la orden aparezca en el listado.

**Resultado esperado:** Registrar la orden y mostrarla en el listado con estado En espera.

**Resultado observado:** La aplicación mostró el mensaje «Orden registrada correctamente». La orden apareció en el listado con estado En espera.

**Estado:** APROBADO.

**Evidencia:** `../evidencias/BASE-02.png`

### BASE-03: Persistencia después de recargar

**Procedimiento:**
1. Registrar correctamente la orden QA1234.
2. Recargar la aplicación mediante F5.
3. Consultar nuevamente las órdenes activas.

**Resultado esperado:** Mantener la orden registrada después de actualizar la página.

**Resultado observado:** La orden QA1234 continuó apareciendo con el cliente Carlos QA Prueba, servicio Lavado básico, precio S/ 20.00 y estado En espera.

**Estado:** APROBADO.

**Evidencia:** `../evidencias/BASE-03.png`

### BASE-04: Bloqueo de orden duplicada

**Datos utilizados:**
- Cliente: Pedro QA Prueba.
- Teléfono: 999888777.
- Placa: QA1234.
- Servicio: Lavado premium.

**Procedimiento:**
1. Mantener una orden activa con la placa QA1234.
2. Intentar registrar otra orden utilizando la misma placa.
3. Verificar el mensaje mostrado por la aplicación.

**Resultado esperado:** Rechazar una nueva orden cuando la placa ya tiene una orden activa.

**Resultado observado:** La aplicación mostró el mensaje «La placa ya tiene una orden activa» y rechazó el registro.

**Estado:** APROBADO.

**Evidencia:** `../evidencias/BASE-04.png`

### BASE-05: Validación de campos obligatorios y formato del teléfono

**Datos utilizados:**
- Nombre: Pedro QA Validación.
- Teléfono inválido: `abc123`.
- Teléfono válido: `987654321`.
- Placa: `TST123`.
- Servicio: Lavado básico.

**Procedimiento:**
1. Abrir el formulario de registro de órdenes.
2. Dejar vacío el campo Nombre del cliente e intentar enviar el formulario.
3. Repetir la prueba dejando vacío el campo Placa del vehículo.
4. Ingresar `abc123` en el campo Teléfono.
5. Completar los demás campos e intentar registrar la orden.
6. Verificar el mensaje de validación mostrado.
7. Reemplazar el teléfono por `987654321`.
8. Intentar registrar nuevamente la orden.

**Resultado esperado:** Impedir el registro cuando falten campos obligatorios o el teléfono no cumpla el formato requerido. Permitir el registro cuando los datos sean válidos.

**Resultado observado:**
- Los campos obligatorios mostraron el mensaje «Completar este campo».
- Al ingresar `abc123` como teléfono, el sistema mostró: «Ingresa un teléfono de 7 a 15 dígitos, con + inicial opcional».
- Al reemplazarlo por `987654321`, la aplicación mostró «Orden registrada correctamente».

**Tipo de validación:** Validación de campos obligatorios y validación del formato del teléfono en el formulario.

**Estado:** APROBADO.

**Evidencias:**
- Campos obligatorios: `../evidencias/BASE-05-obligatorios.png`
- Teléfono inválido: `../evidencias/BASE-05-telefono-invalido.png`
- Teléfono válido: `../evidencias/BASE-05-telefono-valido.png`

### BASE-06: Servicios inactivos

**Datos utilizados:**
- Servicio activo: Lavado básico (ID 1).
- Servicio inactivo probado: Lavado de motor (ID 4).
- Segundo servicio inactivo identificado: Aspirado express (ID 5).
- Placa de prueba para la solicitud API: `QAZ741`.
- Cliente: Prueba BASE06.
- Teléfono: `987654321`.

**Procedimiento:**

*Verificación desde la interfaz:*
1. Abrir el formulario de registro de órdenes.
2. Desplegar el selector de servicios.
3. Revisar los servicios disponibles para nuevas órdenes.
4. Comprobar que los servicios inactivos no aparezcan en el selector.

*Verificación directa mediante la API:*
5. Consultar los registros de la tabla `services` en la base de pruebas.
6. Identificar Lavado de motor con ID 4 y estado inactivo (`is_active = 0`).
7. Enviar una solicitud `POST /api/orders` con datos válidos y `serviceId: 4`.
8. Comprobar el código HTTP y el contenido de la respuesta.
9. Verificar que la API rechace la solicitud por tratarse de un servicio inactivo.

**Resultado esperado:** Mostrar únicamente los servicios activos en el selector y rechazar desde el backend cualquier intento de registrar una orden utilizando un servicio inactivo.

**Resultado observado:**
- En el selector se visualizaron Lavado básico, Lavado premium y Encerado.
- Los servicios inactivos Lavado de motor y Aspirado express no aparecieron en el selector.
- La consulta a MySQL confirmó que Lavado de motor tiene ID 4 y `is_active = 0`.
- Se envió una solicitud directa al endpoint `POST /api/orders` utilizando `serviceId: 4`.
- El backend respondió con HTTP `422 Unprocessable Entity`.
- El código de error recibido fue `SERVICE_UNAVAILABLE`.
- El mensaje devuelto fue «El servicio seleccionado no está disponible».
- La respuesta identificó el campo `serviceId` en los detalles del error.
- La orden con placa `QAZ741` fue rechazada y no se registró.

**Resultado de la API:**

```json
{
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "El servicio seleccionado no está disponible.",
    "details": [
      {
        "field": "serviceId",
        "message": "El servicio seleccionado no está disponible."
      }
    ]
  }
}
```

**Estado:** APROBADO.

**Evidencias:**
- Selector de servicios activos: `../evidencias/BASE-06-selector.png`
- Rechazo de servicio inactivo mediante API: `../evidencias/BASE-06-api.png`

### BASE-07: Recuperación ante caída del backend

**Procedimiento:**
1. Iniciar el backend y el frontend.
2. Abrir la aplicación en el navegador.
3. Detener el backend mediante Ctrl + C.
4. Mantener abierta la aplicación en el navegador.
5. Comprobar el comportamiento de la aplicación al intentar consultar los servicios y las órdenes.
6. Registrar el mensaje de error mostrado.
7. Reiniciar el backend mediante `npm start`.
8. Esperar la conexión con MySQL.
9. Recargar la aplicación mediante F5.
10. Comprobar nuevamente los servicios y las órdenes activas.

**Resultado esperado:** Mostrar un mensaje de error cuando el backend no esté disponible y recuperar la consulta de servicios y órdenes después de reiniciarlo.

**Resultado observado:**
- Con el backend detenido, la aplicación mostró el mensaje: «No se pudo completar la solicitud (HTTP 502)».
- El formulario permaneció visible, pero no se cargaron los servicios y la lista mostró 0 órdenes.
- Después de reiniciar el backend, se restableció la conexión con MySQL 8.0.46.
- Al recargar la aplicación, volvieron a aparecer los servicios y las tres órdenes activas: XYZ789, ABC123 y QA1234.

**Estado:** APROBADO.

**Evidencias:**
- Error con backend detenido: `../evidencias/BASE-07-error.png`
- Recuperación después del reinicio: `../evidencias/BASE-07-recuperacion.png`

## 4. Resumen de resultados

| ID | Prueba | Estado |
|---|---|---|
| BASE-01 | Consulta de servicios y órdenes | Aprobado |
| BASE-02 | Registro de orden válida | Aprobado |
| BASE-03 | Persistencia después de recargar | Aprobado |
| BASE-04 | Bloqueo de placa duplicada | Aprobado |
| BASE-05 | Campos obligatorios y formato del teléfono | Aprobado |
| BASE-06 | Servicios inactivos en interfaz y API | Aprobado |
| BASE-07 | Recuperación del backend | Aprobado |

**Total:** 7 pruebas BASE ejecutadas y aprobadas.

## 5. Incidencias y observaciones

Durante la ejecución se comprobó el funcionamiento de las consultas, el registro de órdenes, la persistencia de datos, las validaciones del formulario, el bloqueo de placas duplicadas y la recuperación de la aplicación después de detener y reiniciar el backend.

Se completaron las verificaciones de servicios inactivos tanto desde la interfaz como mediante una solicitud directa a la API. El backend rechazó correctamente el intento de registrar una orden con un servicio inactivo, devolviendo HTTP 422 y el código `SERVICE_UNAVAILABLE`.

Se mantienen las siguientes actividades complementarias solicitadas durante la revisión del Pull Request:

- Completar las referencias a los contratos y endpoints de API, así como los pasos y datos de prueba en los casos QA.
- Incorporar un caso de prueba para intentar cancelar una orden sin indicar el motivo.
- Utilizar nombres cortos y uniformes para las capturas de evidencia.

Los casos funcionales específicos de autenticación, seguimiento, cancelación, administración de servicios, historial y resumen se mantienen pendientes de ejecución hasta que sus módulos estén integrados y disponibles en `develop`.

## 6. Conclusión

La verificación inicial de la rama `develop` permitió comprobar satisfactoriamente la consulta de servicios y órdenes, el registro de atenciones, la persistencia de datos, el bloqueo de placas duplicadas, las validaciones de campos obligatorios y formato del teléfono, así como la recuperación del backend.

También se verificó que el sistema muestra únicamente los servicios activos en el selector y que el backend rechaza mediante la API los intentos de registrar órdenes con servicios inactivos, devolviendo HTTP 422 y el código `SERVICE_UNAVAILABLE`.

Las siete pruebas BASE fueron ejecutadas y aprobadas en el entorno local de pruebas.

Quedan como actividades complementarias la mejora de la documentación de los casos QA, la incorporación de la prueba de cancelación sin motivo y la uniformización de los nombres de las capturas de evidencia.