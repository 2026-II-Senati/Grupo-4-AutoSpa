# Guía de comprobaciones del frontend y backend

## 1. Objetivo

Documentar los pasos para comprobar que el frontend se abre correctamente, que el backend responde a las solicitudes y que ambos pueden comunicarse. También se comprobará el comportamiento del frontend cuando el backend está apagado y cuando vuelve a estar disponible.

## 2. Preparación

Antes de comenzar, se debe contar con lo siguiente:

* El repositorio del Proyecto Final AutoSpa clonado en el equipo.
* Las dependencias del frontend y del backend instaladas según las instrucciones del proyecto.
* Las configuraciones y variables de entorno necesarias.
* Los comandos y puertos indicados en el README o en la configuración del proyecto.
* Un navegador web y una terminal para ejecutar los comandos.

*Importante: utilizar los puertos y comandos reales definidos por el proyecto. No asumir que el frontend o el backend utilizan un puerto específico.*

## 3. Casos de comprobación

### CP-01. Apertura correcta del frontend

**Preparación:**
* Tener instalado el entorno requerido por el frontend.
* Instalar las dependencias según las instrucciones del proyecto.

**Pasos:**
1. Abrir una terminal en la carpeta del frontend.
2. Ejecutar el comando de inicio documentado en el proyecto.
3. Esperar a que el servidor de desarrollo indique que está disponible.
4. Abrir en el navegador la dirección local que muestra la terminal.
5. Verificar que la interfaz se visualiza correctamente.

**Resultado esperado:**
* El frontend se abre en el navegador.
* La interfaz principal se muestra sin errores que impidan su uso.
* El servidor de desarrollo permanece activo.

**Estado:** Pendiente de ejecutar.

---

### CP-02. Consulta directa al endpoint de salud del backend

**Preparación:**
* Tener el backend instalado y configurado.
* Conocer el puerto en el que se ejecuta el backend.

**Pasos:**
1. Iniciar el backend siguiendo las instrucciones del proyecto.
2. Abrir el navegador o una herramienta para realizar solicitudes HTTP.
3. Consultar directamente el endpoint `GET /api/health`, utilizando la dirección base y el puerto reales del backend.
4. Revisar el código de respuesta HTTP y el contenido devuelto.

**Resultado esperado:**
* El backend responde a la solicitud.
* La respuesta HTTP indica que la consulta fue atendida correctamente, normalmente con código `200 OK`.
* El contenido devuelto corresponde a la respuesta de salud definida por el proyecto.

**Estado:** Pendiente de ejecutar.

---

### CP-03. Comunicación entre frontend y backend con el backend encendido

**Preparación:**
* Tener el frontend iniciado.
* Tener el backend encendido y disponible.
* Verificar que la URL del backend esté configurada correctamente en el frontend.

**Pasos:**
1. Abrir el frontend en el navegador.
2. Confirmar que el backend está ejecutándose.
3. Identificar el botón de la interfaz destinado a comprobar la conexión con el backend.
4. Pulsar el botón una vez.
5. Observar el mensaje mostrado por el frontend y, si es necesario, revisar las solicitudes en las herramientas de desarrollador del navegador.

**Resultado esperado:**
* El frontend realiza la solicitud al backend.
* La solicitud llega al servicio correspondiente y recibe una respuesta válida.
* La interfaz muestra el resultado satisfactorio definido para la comprobación de conexión.

**Estado:** Pendiente de ejecutar.

---

### CP-04. Comportamiento del frontend con el backend apagado

**Preparación:**
* Tener el frontend iniciado.
* Confirmar que el backend está funcionando inicialmente.
* Identificar el proceso del backend para poder detenerlo sin cerrar el frontend.

**Pasos:**
1. Detener el proceso del backend.
2. Confirmar que el frontend continúa abierto en el navegador.
3. Pulsar el botón destinado a comprobar la conexión con el backend.
4. Observar el mensaje de respuesta.
5. Verificar que la interfaz continúa siendo utilizable y no presenta un bloqueo inesperado.

**Resultado esperado:**
* La solicitud no puede completarse porque el backend está apagado.
* El frontend informa del fallo de conexión mediante un mensaje comprensible.
* La interfaz gestiona el error sin bloquearse ni finalizar inesperadamente.

**Estado:** Pendiente de ejecutar.

---

### CP-05. Recuperación de la conexión después de encender nuevamente el backend

**Preparación:**
* Tener el frontend abierto.
* Haber detenido el backend durante la comprobación anterior.

**Pasos:**
1. Iniciar nuevamente el backend con el comando documentado.
2. Esperar a que el servicio esté disponible.
3. Consultar `GET /api/health` para comprobar que el backend responde.
4. Volver al frontend sin cerrarlo.
5. Pulsar nuevamente el botón de comprobación de conexión.
6. Observar el resultado mostrado por la interfaz.

**Resultado esperado:**
* El backend vuelve a estar disponible.
* La consulta de salud responde correctamente.
* El frontend puede realizar una nueva solicitud sin necesidad de reiniciarse.
* La interfaz muestra el resultado satisfactorio de la conexión.

**Estado:** Pendiente de ejecutar.

## 4. Registro de resultados

Los estados de esta guía se actualizarán únicamente después de ejecutar cada caso.

Caso	Comprobación	                                                        Estado
CP-01	Apertura del frontend	                                        Pendiente de ejecutar
CP-02	Consulta GET /api/health	                                    Pendiente de ejecutar
CP-03	Conexión con backend encendido	                                Pendiente de ejecutar
CP-04	Conexión con backend apagado	                                Pendiente de ejecutar
CP-05	Recuperación de la conexión	                                    Pendiente de ejecutar
CP-06	Registro de una orden válida	                                Pendiente de ejecutar
CP-07	Persistencia de la orden después de recargar	                Pendiente de ejecutar
CP-08	Rechazo de campos obligatorios faltantes	                    Pendiente de ejecutar
CP-09	Rechazo de una placa duplicada en una orden activa	            Pendiente de ejecutar
CP-10	Rechazo de servicios inactivos	                                Pendiente de ejecutar
CP-11	Conservación de los datos del servicio en órdenes existentes	Pendiente de ejecutar
CP-12	Mensaje cuando el backend no está disponible	                Pendiente de ejecutar

Cuando corresponda, se registrarán la fecha, el resultado obtenido, las observaciones y la evidencia. Los fallos detectados durante la ejecución deberán comunicarse en los tickets de implementación correspondientes.

## 5. Revisión e integración

Para completar esta tarea:

1. Verificar que los cinco casos incluyen preparación, pasos y resultado esperado.
2. Confirmar que los comandos, las rutas y los puertos mencionados coinciden con la configuración real del proyecto.
3. Guardar el documento en `docs/comprobaciones.md`.
4. Solicitar la revisión correspondiente y comprobar que el archivo queda integrado en `develop`.

**Condición de cierre:** la guía está completa, revisada e integrada en `develop`. La ejecución efectiva de las comprobaciones corresponde a los tickets de implementación.

### CP-06. Registro de una orden válida

**Preparación:**
- Disponer de la integración del flujo de órdenes implementada.
- Tener el backend y el frontend configurados y en ejecución.
- Contar con datos de prueba válidos.

**Pasos:**
1. Abrir el frontend.
2. Completar los campos obligatorios con datos de prueba válidos.
3. Registrar la orden.
4. Comprobar si la orden aparece en la lista.

**Resultado esperado:**
- La orden se registra correctamente.
- La orden aparece en la lista de órdenes.

**Estado:** Pendiente de ejecutar.

### CP-07. Persistencia de la orden después de recargar la página

**Preparación:**
- Haber registrado una orden válida.
- Disponer de la persistencia de órdenes implementada.

**Pasos:**
1. Registrar una orden válida.
2. Recargar la página del frontend.
3. Consultar nuevamente la lista de órdenes.

**Resultado esperado:**
- La orden registrada continúa apareciendo después de recargar la página.

**Estado:** Pendiente de ejecutar.

### CP-08. Rechazo de campos obligatorios faltantes

**Preparación:**
- Disponer del registro de órdenes implementado.

**Pasos:**
1. Abrir el formulario de registro de órdenes.
2. Dejar vacío un campo obligatorio.
3. Intentar registrar la orden.
4. Observar la respuesta de la interfaz.

**Resultado esperado:**
- La orden no se registra.
- La interfaz informa qué dato obligatorio falta o qué debe corregirse.

**Estado:** Pendiente de ejecutar.

### CP-09. Rechazo de una placa duplicada en una orden activa

**Preparación:**
- Disponer de órdenes y validación de placas implementadas.
- Contar con una orden activa de prueba asociada a una placa.

**Pasos:**
1. Registrar o localizar una orden activa de prueba.
2. Intentar registrar otra orden activa con la misma placa.
3. Observar la respuesta del sistema.

**Resultado esperado:**
- El sistema rechaza la segunda orden activa para la misma placa.

**Estado:** Pendiente de ejecutar.

### CP-10. Rechazo de servicios inactivos

**Preparación:**
- Disponer de servicios con estado activo e inactivo.
- Contar con el flujo de órdenes implementado.

**Pasos:**
1. Comprobar si un servicio inactivo aparece entre las opciones del formulario.
2. Enviar una solicitud directa a la API intentando registrar una orden con ese servicio.
3. Registrar la respuesta obtenida.

**Resultado esperado:**
- El servicio inactivo no se puede seleccionar en la interfaz.
- La API rechaza la solicitud que intenta utilizar el servicio inactivo.

**Estado:** Pendiente de ejecutar.

### CP-11. Conservación de los datos del servicio en órdenes existentes

**Preparación:**
- Disponer de órdenes y servicios persistidos.
- Utilizar exclusivamente datos de prueba.

**Pasos:**
1. Registrar una orden con un servicio y guardar el nombre y precio mostrados.
2. Modificar posteriormente el nombre o precio del servicio.
3. Consultar de nuevo la orden original.
4. Comparar los valores almacenados con los registrados inicialmente.

**Resultado esperado:**
- La orden existente conserva los valores que le correspondían al registrarse.

**Estado:** Pendiente de ejecutar.

### CP-12. Mensaje comprensible cuando el backend no está disponible

**Preparación:**
- Tener el frontend abierto.
- Identificar una operación que requiera comunicación con el backend.

**Pasos:**
1. Detener el backend.
2. Intentar realizar la operación desde el frontend.
3. Observar el mensaje mostrado.
4. Registrar el resultado obtenido.

**Resultado esperado:**
- El frontend muestra un mensaje comprensible sobre el problema de conexión.
- La interfaz no se bloquea inesperadamente.

**Estado:** Pendiente de ejecutar.