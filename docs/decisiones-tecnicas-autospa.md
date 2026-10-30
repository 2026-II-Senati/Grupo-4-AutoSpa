# AutoSpa — Decisiones técnicas vigentes

Actualización: 29 de octubre de 2026. Las elecciones técnicas se distinguen de la ejecución comprobada, registrada en [comprobaciones](comprobaciones.md).

## 1. Propósito y alcance

AutoSpa gestiona órdenes de lavado mediante una aplicación web. Incluye catálogo, registro/listado, seguimiento y cancelación, usuarios/acceso del personal, historial y resumen operativo. El [README](../README.md) distingue lo implementado de las entregas posteriores. Las [reglas](reglas-negocio.md) y el [contrato API](api.md) son sus fuentes de detalle.

## 2. Arquitectura y stack

Cliente-servidor con un único backend por capas: rutas, controladores, servicios, repositorios y modelos. Comunicación HTTP/JSON.

| Parte | Elección |
| --- | --- |
| Lenguaje | JavaScript |
| Interfaz | React y React DOM 19.3.1 con Vite 8.3.4 |
| Servidor | Node.js 24.22.1, npm 11.19.1, Express 5.3.0 |
| Persistencia | MySQL 8.0.16 o posterior, InnoDB, utf8mb4 |
| Modelos y migraciones | Sequelize 6.37.8 y Umzug 3.8.3 |
| Ejecución reproducible | Docker y Docker Compose; implementación posterior |
| Colaboración | Git/GitHub, Jira y referencia visual en Figma |

Versiones en package.json y lockfiles de cada aplicación; instalar con `npm ci`. No publicar dependencias, builds ni archivos de entorno privados.

## 3. Persistencia y contrato

MySQL está decidido e implementado. El [modelo](modelo-datos.md) describe services/orders actuales y usuarios/auditoría futuros. Las migraciones crean services/orders; los seeders son demostración, no evidencia de validación.

El [contrato](api.md) fija los tres endpoints de servicios/órdenes y health. Cada orden tiene un servicio, copia histórica de nombre/precio y placa normalizada con unicidad entre estados activos. Este PR documental no modifica contratos ni esquemas.

## 4. Ejecución

Modos existentes: Vite en 3000 con proxy a Express en 3001, o React compilado servido desde Express en 3001. Véase [instalación](instalacion.md). Si cambia PORT, ajustar el proxy en el modo separado.

Docker/Compose forman parte del alcance. Aún no hay Dockerfile ni Compose; no se ofrece un comando de contenedores como disponible.

## 5. Especificaciones de las entregas posteriores

La inclusión de usuarios/acceso y seguimiento es firme. Antes de implementarlos deben concretarse mecanismo/duración de sesión, algoritmo y parámetros de protección de contraseñas, alta inicial de personal, permisos por operación y política exacta de transiciones (saltos/retrocesos). El modelo conserva el diseño de referencia y señala estos detalles abiertos. No se inventan permisos ni reglas de auditoría adicionales.

Catálogo administrable, historial y resumen requieren sus operaciones y pantallas. Como criterio de presentación se usan etiquetas de estados en español; los formatos de intercambio siguen la API.

## 6. Validación, revisión e informe

Pruebas automatizadas, recorrido visual, instalación limpia y reproducción por otra persona son evidencias distintas: consultar [comprobaciones](comprobaciones.md). La reproducción y revisión de Castillo permanecen pendientes hasta su confirmación.

Para el informe, cada integrante aporta explicación, evidencia y pendientes reales. Plantilla del docente y referencias de Jira/Figma se adjuntan cuando estén disponibles; no se declara aprobación por ausencia de observaciones.
