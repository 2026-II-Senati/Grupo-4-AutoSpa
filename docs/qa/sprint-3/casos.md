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
| Base de datos | MySQL 8.0.46 |

## 2. Objetivo

Preparar los casos de prueba funcionales del Sprint 3 y verificar inicialmente las funcionalidades disponibles en la rama develop, antes de integrar los módulos pendientes.

## 3. Matriz de casos de prueba

| ID | Módulo | Caso de prueba | Resultado esperado | Estado |
|---|---|---|---|---|
| QA-01 | Autenticación | Iniciar sesión con credenciales válidas | Permitir el acceso al usuario autorizado | Pendiente |
| QA-02 | Autenticación | Iniciar sesión con credenciales incorrectas | Rechazar el acceso y mostrar un mensaje de error | Pendiente |
| QA-03 | Autenticación | Cerrar sesión | Finalizar la sesión del usuario | Pendiente |
| QA-04 | Autenticación | Intentar acceder sin sesión | Restringir el acceso a vistas protegidas | Pendiente |
| QA-05 | Seguimiento | Consultar el estado de una orden | Mostrar el estado actual de la orden | Pendiente |
| QA-06 | Seguimiento | Intentar una transición de estado no permitida | Rechazar el cambio de estado | Pendiente |
| QA-07 | Seguimiento | Realizar una transición permitida | Actualizar correctamente el estado | Pendiente |
| QA-08 | Cancelación | Cancelar una orden en espera indicando motivo | Cancelar la orden y conservar el motivo | Pendiente |
| QA-09 | Cancelación | Intentar cancelar una orden en lavado | Rechazar la cancelación | Pendiente |
| QA-10 | Servicios | Crear un servicio | Guardar el servicio correctamente | Pendiente |
| QA-11 | Servicios | Editar un servicio | Actualizar sus datos | Pendiente |
| QA-12 | Servicios | Activar un servicio inactivo | Habilitarlo para nuevas órdenes | Pendiente |
| QA-13 | Servicios | Desactivar un servicio | Impedir su selección en nuevas órdenes | Pendiente |
| QA-14 | Servicios | Consultar orden asociada a servicio modificado | Conservar nombre y precio originales | Pendiente |
| QA-15 | Historial | Consultar órdenes completadas | Mostrar las órdenes finalizadas | Pendiente |
| QA-16 | Resumen | Consultar resumen por período | Mostrar información del período seleccionado | Pendiente |
| QA-17 | Resumen | Comparar resumen con órdenes registradas | Mantener coherencia de los totales | Pendiente |

## 4. Criterios de ejecución

- Ejecutar los casos cuando el módulo correspondiente esté integrado en develop.
- Utilizar datos ficticios y una base de datos de pruebas.
- Registrar resultados reales y adjuntar evidencias.
- Mantener como pendientes los casos de módulos no integrados.
- Comunicar los defectos encontrados mediante Jira o PR.

## 5. Observaciones

Los casos QA-01 a QA-17 están preparados para su ejecución. No representan pruebas aprobadas. Su ejecución dependerá de la disponibilidad de las funcionalidades integradas en develop.