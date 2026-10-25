# Grupo-4-AutoSpa

Proyecto final del curso FULLSTACK DEVELOPER SOFTWARE

# AutoSpa

Aplicación web para gestionar la atención de vehículos en un autolavado. Su propósito es facilitar el registro de órdenes, el seguimiento del servicio y la consulta de las atenciones realizadas.

## Funcionalidades previstas

- Acceso del personal al sistema.
- Gestión del catálogo de servicios y precios.
- Registro de órdenes de atención.
- Seguimiento de órdenes mediante los estados: En espera, En lavado, Listo para entregar y Entregado.
- Cancelación de órdenes en espera, registrando el motivo.
- Consulta del historial de atenciones.
- Visualización de un resumen de operaciones por periodo.

## Tecnologías seleccionadas

| Parte del proyecto        | Tecnologías              |
| ------------------------- | ------------------------ |
| Frontend                  | React, Vite y JavaScript |
| Backend                   | Node.js y Express        |
| Base de datos             | MySQL                    |
| Acceso a datos            | Sequelize                |
| Ejecución en contenedores | Docker y Docker Compose  |

## Arquitectura

El sistema utilizará una arquitectura cliente-servidor:

- El **frontend** presentará las pantallas y permitirá al personal realizar las operaciones.
- El **backend** procesará las solicitudes, aplicará las reglas del negocio y gestionará el acceso a los datos.
- La **base de datos** almacenará la información del sistema.

El backend se organizará por capas, utilizando rutas, controladores, servicios y modelos.

## Organización del repositorio

El proyecto se organizará en los siguientes directorios, que se incorporarán conforme avance la implementación:

- `frontend/`: interfaz web.
- `backend/`: servidor y lógica del negocio.
- `docs/`: documentación del proyecto.

## Documentación

- [Reglas del negocio](docs/reglas-negocio.md)
- [Decisiones técnicas](docs/decisiones-tecnicas-autospa.md)
- [Instalacion](docs/instalacion.md)

## Estado del proyecto

Proyecto en desarrollo. Actualmente se está preparando la base técnica para ejecutar el frontend y el backend y comprobar su comunicación.

El diseño detallado de la base de datos se encuentra pendiente.
