# AutoSpa

Proyecto final del curso FULLSTACK DEVELOPER SOFTWARE: 2026-II-Senati/Grupo-4-AutoSpa.

AutoSpa es una aplicación web de gestión de órdenes de lavado. Cada visita genera una orden con un único servicio, conserva el nombre y precio acordados y evita dos órdenes activas para una placa normalizada.

## Alcance definido

Incluye catálogo de servicios y precios, registro y listado de órdenes, seguimiento de estados, cancelación en espera con motivo, gestión de usuarios y acceso del personal, historial y resumen operativo por periodo. No incluye inventario, facturación, pagos ni aplicación móvil.

Las [reglas](docs/reglas-negocio.md), el [contrato API](docs/api.md) y el [modelo](docs/modelo-datos.md) son las fuentes de detalle.

## Arquitectura y tecnologías

Arquitectura cliente-servidor, JavaScript, React con Vite, Node.js con Express, MySQL con Sequelize y migraciones Umzug. El backend se organiza en rutas, controladores, servicios, repositorios y modelos.

Docker y Docker Compose forman parte de la ejecución reproducible del proyecto; sus archivos aún no están implementados.

## Implementación actual

- Formulario React y listado de órdenes activas conectados por defecto a la API real; demostración opcional.
- GET /api/health, GET /api/services, POST /api/orders y GET /api/orders.
- Conexión MySQL, modelos services/orders, migraciones, seeders y pruebas de backend.
- Ejecución local con Vite/API separados o frontend compilado servido desde Express.
- Catálogo administrable, historial, resumen, cambio de estados, cancelación y usuarios/acceso corresponden a entregas posteriores. Los enlaces del menú no acreditan esas funcionalidades.
- Usuarios, autor de la orden y auditoría tienen diseño documentado; sus tablas y operaciones todavía no existen.

## Organización y documentación

- `frontend/`: interfaz React.
- `backend/`: API, persistencia y pruebas.
- `docs/`: [reglas](docs/reglas-negocio.md), [decisiones técnicas](docs/decisiones-tecnicas-autospa.md), [modelo](docs/modelo-datos.md), [API](docs/api.md), [instalación](docs/instalacion.md) y [comprobaciones](docs/comprobaciones.md).

Sigue la guía de instalación para ejecutar el proyecto. La guía de comprobaciones distingue resultados esperados, pruebas API, recorrido visual y evidencia. Que una función exista no significa que esté validada.
