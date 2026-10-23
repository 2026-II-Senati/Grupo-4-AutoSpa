# AutoSpa — Base de decisiones para el informe

Fecha: 21 de octubre de 2026 · Versión inicial

Este documento resume lo acordado en la conversación. No certifica una implementación ni sustituye la revisión del repositorio. Distingue decisiones adoptadas, propuestas y asuntos pendientes para redactar el informe sin presentar trabajo futuro como terminado.

## 1. Propósito y alcance de referencia

AutoSpa es una aplicación web para gestionar la atención de vehículos en un autolavado. El alcance de referencia comprende acceso del personal, catálogo de servicios y precios, registro y seguimiento de órdenes, historial y resumen de operaciones. La maqueta de Figma ya fue compartida con el equipo.

## 2. Arquitectura adoptada

Se utilizará una arquitectura cliente-servidor con un único backend organizado por capas:

- **Frontend:** presenta las pantallas, captura datos y solicita operaciones al backend.
- **Backend:** recibe solicitudes, aplica las reglas del negocio y accede a los datos.
- **Base de datos:** conserva la información del sistema.

En el backend se incorporarán rutas, controladores, servicios y modelos conforme se necesiten. Las rutas identifican las operaciones; los controladores reciben datos y preparan respuestas; los servicios aplican reglas; los modelos representan el acceso a datos. El frontend se comunicará con el backend mediante HTTP y respuestas JSON. Los endpoints son direcciones de operaciones, no ubicaciones de archivos.

**Motivo de la elección:** mantener responsabilidades claras y una complejidad manejable para un equipo que está aprendiendo. Separar las partes en contenedores no implica adoptar microservicios.

## 3. Herramientas previstas en la base técnica aceptada

| Parte | Elección | Finalidad |
|---|---|---|
| Lenguaje inicial | JavaScript | Desarrollo del frontend y backend. |
| Interfaz | React con Vite | Componentes de pantalla y entorno de desarrollo del frontend. |
| Servidor | Node.js con Express | Ejecución del backend y atención de solicitudes. |
| Persistencia | MySQL | Almacenamiento relacional. |
| Acceso a datos | Sequelize | Trabajo con modelos y datos desde el backend. |
| Ejecución reproducible | Docker y Docker Compose | Configuración de la ejecución conjunta de los componentes. |
| Versionado y colaboración | Git y GitHub | Repositorio compartido, ramas y revisión de cambios. |
| Organización | Jira | Tickets, responsables y seguimiento del trabajo. |
| Diseño visual | Figma | Referencia compartida para las pantallas. |

La elección de herramientas no significa que ya estén instaladas o integradas. Las versiones concretas deben acordarse y documentarse. Primero se comprobará la ejecución local; después se preparará Docker.

## 4. Organización del repositorio

Se utilizará un repositorio con esta estructura objetivo:

```text
autospa/
  frontend/
  backend/
  docs/
  README.md
  compose.yaml
  .env.example
  .gitignore
```

Las carpetas y configuraciones se añadirán cuando se implementen sus partes. Vite generará la base del frontend; la organización por capas del backend se incorporará progresivamente. El README explicará la ejecución. Los archivos de entorno reales y las contraseñas no deben publicarse.

## 5. Base de datos: diseño pendiente

**Decisión confirmada:** aplazar el diseño e implementación de la base de datos durante las tareas iniciales de adaptación. Faltan datos por definir. Se abordará entre las primeras tareas posteriores.

Existe esta propuesta conceptual, todavía sujeta a revisión:

| Entidad propuesta | Información de referencia |
|---|---|
| Usuarios | Nombre, correo, contraseña protegida y estado de cuenta. |
| Servicios | Nombre, descripción, precio y disponibilidad. |
| Órdenes | Placa, cliente, teléfono, servicio, precio acordado, estado y fechas. |
| Cambios de estado | Orden, estado anterior y nuevo, usuario, fecha y motivo cuando corresponda. |

No constituye un esquema aprobado. Quedan por definir campos definitivos, obligatoriedad, tipos, claves, relaciones, restricciones y reglas de integridad. El mecanismo de migraciones y los datos de demostración también deben concretarse. No debe afirmarse en el informe que el modelo físico o las tablas ya están construidos.

## 6. Reglas y acuerdos de integración

El responsable del proyecto confirmó que las reglas de negocio ya están en el repositorio. Para el informe debe consultarse su versión vigente y registrar la ruta real del archivo. Este resumen no reemplaza ese documento.

El contrato completo de la API sigue pendiente. Como primer ejercicio se propuso `GET /api/health`, que devolvería un mensaje JSON para comprobar la comunicación. La ruta y respuesta exactas deben quedar acordadas en el ticket antes de conectar ambas partes. El mecanismo de autenticación tampoco se considera cerrado en este resumen.

## 7. Estado y siguiente objetivo

**Confirmado por el equipo:** repositorio creado, colaboradores añadidos, reglas documentadas, maqueta compartida, reunión inicial realizada y columnas de Jira configuradas.

**Objetivo inmediato aceptado:** ejecutar una pantalla React, arrancar un backend sencillo y conseguir que la pantalla muestre una respuesta real del servidor. Esto no requiere aún base de datos. Se combinará aprendizaje con tareas pequeñas que cada autor pueda explicar y comprobar.

**Pendiente:** asignar responsabilidades, concretar los primeros tickets, comprobar el flujo de revisión, implementar esa comunicación y luego abordar Docker y el diseño de datos. La configuración o implementación no verificada debe describirse como prevista.

## 8. Insumos para quien redacte el informe

Una persona puede centralizar la redacción y el formato. Cada integrante debe entregarle la explicación de su avance, evidencia disponible y pendientes; el líder revisará la coherencia técnica.

Antes de cerrar la entrega se necesita: plantilla o índice del docente, alcance validado, reglas vigentes, enlace a Figma, enlaces al repositorio y Jira, responsables asignados y evidencias de lo realmente ejecutado. En cada sección se distinguirá **realizado**, **planificado** y **pendiente**. Si una sección exige un diseño de datos definitivo, su ausencia deberá resolverse o declararse; este documento no lo sustituye.

## Versiones iniciales

Base acordada para el proyecto. Son las versiones de partida; todavía no se ha comprobado la instalación completa del frontend ni del backend.

| Herramienta | Versión |
| --- | --- |
| Node.js | 24.22.1 |
| npm | 11.19.1 |
| Express | 5.3.0 |
| React y React DOM | 19.3.1 |
| Vite | 8.3.4 |

### package.json y package-lock.json

Cada aplicación (`frontend/` y `backend/`) tendrá su propio `package.json` y `package-lock.json`. Los dos deben guardarse en Git:

- `package.json` lista las dependencias de la aplicación.
- `package-lock.json` fija las versiones exactas, para que todos instalen lo mismo con `npm install`.

La carpeta `node_modules/` no se sube a Git; cada integrante la genera en su máquina con `npm install`.
