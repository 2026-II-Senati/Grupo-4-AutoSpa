# Ejecución de pruebas BASE - Sprint 3

## 1. Información del entorno

| Campo | Información |
|---|---|
| Proyecto | AutoSpa |
| Responsable QA | Heison Joel Núñez Edquen |
| Fecha de ejecución | 01/11/2026 |
| Rama evaluada | develop |
| Commit evaluado | c134347 |
| Rama de documentación | feature/qa-sprint-3 |
| Sistema operativo | Windows |
| Backend | Node.js / Express |
| Base de datos | MySQL 8.0.46 |
| Base de pruebas | autospa_qa_sprint3 |
| Frontend | React / Vite |
| URL local | http://localhost:3000 |
| API | http://localhost:3001 |

## 2. Preparación del entorno

Se actualizó el proyecto desde la rama develop hasta el commit c134347.

Se verificó la conexión con MySQL 8.0.46 y se preparó una base de datos independiente denominada autospa_qa_sprint3.

Se ejecutaron correctamente las migraciones y los datos iniciales.

Resultado:
- Conexión a MySQL: correcta.
- Migraciones: aplicadas.
- Datos iniciales: cargados.
- Migraciones pendientes: ninguna.
- Datos iniciales pendientes: ninguno.

## 3. Resultados de las pruebas BASE

### BASE-01: Apertura de aplicación y consulta

**Procedimiento:** Abrir la aplicación y consultar los servicios y las órdenes.

**Resultado esperado:** Mostrar la aplicación y permitir consultar los servicios y órdenes disponibles.

**Resultado observado:** La aplicación abrió correctamente. La API devolvió HTTP 200 OK en los endpoints /api/health, /api/services y /api/orders. La interfaz mostró los servicios y las órdenes existentes.

**Estado:** APROBADO.

**Evidencia:** `../evidencias/BASE-01-consulta - Aplicación con servicios y órdenes visibles..png`

### BASE-02: Registro de orden válida

**Datos utilizados:**
- Cliente: Carlos QA Prueba.
- Teléfono: 987654321.
- Placa: QA1234.
- Servicio: Lavado básico.
- Precio: S/ 20.00.

**Resultado esperado:** Registrar la orden y mostrarla en el listado.

**Resultado observado:** La aplicación mostró el mensaje «Orden registrada correctamente». La orden apareció en el listado con estado En espera.

**Estado:** APROBADO.

**Evidencia:** `../evidencias/BASE-02-registro-Orden QA1234 registrada correctamente.png`

### BASE-03: Persistencia después de recargar

**Procedimiento:** Recargar la aplicación mediante F5 después del registro.

**Resultado esperado:** Mantener la orden registrada después de actualizar la página.

**Resultado observado:** La orden QA1234 continuó apareciendo con el cliente Carlos QA Prueba, servicio Lavado básico, precio S/ 20.00 y estado En espera.

**Estado:** APROBADO.

**Evidencia:** `../evidencias/BASE-03-persistencia-Orden QA1234 después de recargar con F5.png`

### BASE-04: Bloqueo de orden duplicada

**Datos utilizados:**
- Cliente: Pedro QA Prueba.
- Teléfono: 999888777.
- Placa: QA1234.
- Servicio: Lavado premium.

**Resultado esperado:** Rechazar una nueva orden cuando la placa ya tiene una orden activa.

**Resultado observado:** La aplicación mostró el mensaje «La placa ya tiene una orden activa» y rechazó el registro.

**Estado:** APROBADO.

**Evidencia:** `../evidencias/BASE-04-duplicado-Mensaje «La placa ya tiene una orden activa».png`

### BASE-05: Validación de campos obligatorios

**Procedimiento:** Intentar registrar una orden dejando vacío el nombre del cliente y posteriormente la placa.

**Resultado esperado:** Impedir el envío del formulario cuando falten campos obligatorios.

**Resultado observado:** El navegador mostró el mensaje «Completar este campo» tanto para el nombre del cliente como para la placa del vehículo.

**Estado:** APROBADO.

**Evidencia:** `../evidencias/BASE-05-obligatorios-Mensajes de campos obligatorios en nombre y placa.png`

### BASE-06: Servicios inactivos

**Procedimiento:** Consultar el selector de servicios del formulario de registro.

**Resultado esperado:** Mostrar únicamente los servicios activos para nuevas órdenes.

**Resultado observado:** Se visualizaron Lavado básico, Lavado premium y Encerado. Los servicios inactivos Lavado de motor y Aspirado express no aparecieron en el selector.

**Estado:** APROBADO.

**Evidencia:** `../evidencias/BASE-06-servicios-Selector con los tres servicios activos.png`

### BASE-07: Recuperación ante caída del backend

**Procedimiento:** Detener el backend, comprobar la interrupción del servicio, reiniciarlo y recargar la aplicación.

**Resultado esperado:** Recuperar la conexión con MySQL y permitir nuevamente la consulta de órdenes.

**Resultado observado:** El backend volvió a conectarse a MySQL 8.0.46 y mostró el mensaje de disponibilidad en el puerto 3001. Después de recargar la aplicación se visualizaron nuevamente las tres órdenes activas, incluida QA1234.

**Estado:** APROBADO.

**Evidencia:** `../evidencias/BASE-07-recuperacion-Las tres órdenes visibles después de reiniciar el backend.png`

## 4. Resumen de resultados

| ID | Prueba | Estado |
|---|---|---|
| BASE-01 | Consulta de servicios y órdenes | Aprobado |
| BASE-02 | Registro de orden válida | Aprobado |
| BASE-03 | Persistencia después de recargar | Aprobado |
| BASE-04 | Bloqueo de placa duplicada | Aprobado |
| BASE-05 | Validación de campos obligatorios | Aprobado |
| BASE-06 | Servicios inactivos | Aprobado |
| BASE-07 | Recuperación del backend | Aprobado |

**Total:** 7 pruebas aprobadas de 7 ejecutadas.

## 5. Incidencias y observaciones

Durante las verificaciones BASE no se identificaron defectos que impidieran las operaciones probadas.

Los casos funcionales específicos de autenticación, seguimiento, cancelación, administración de servicios, historial y resumen se mantienen pendientes de ejecución hasta que sus módulos estén integrados y disponibles en develop.

## 6. Conclusión

La verificación inicial de la rama develop permitió comprobar el funcionamiento de la consulta de servicios y órdenes, el registro de atenciones, la persistencia de datos, el bloqueo de placas duplicadas, las validaciones obligatorias, la disponibilidad de servicios activos y la recuperación del backend.

Las siete pruebas BASE fueron aprobadas en el entorno local de pruebas. Los módulos pendientes del Sprint 3 quedan sujetos a futuras verificaciones cuando estén integrados.