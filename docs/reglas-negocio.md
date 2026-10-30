# Reglas de negocio de AutoSpa

Definen el proyecto completo. El [README](../README.md) distingue implementación actual y entregas posteriores. Campos y formatos vigentes: [API](api.md) y [modelo](modelo-datos.md).

- Cada visita genera una orden nueva con un único servicio.
- La placa se normaliza según el contrato. No puede tener dos órdenes activas simultáneas.
- Estados: `waiting` (En espera), `washing` (En lavado), `ready` (Listo para entregar), `delivered` (Entregado) y `cancelled` (Cancelado). Los tres primeros son activos.
- Toda orden nueva comienza en waiting.
- Solo se puede cancelar una orden en espera y debe registrarse el motivo.
- La orden conserva el nombre y precio del servicio acordados al crearla.
- Desactivar un servicio impide seleccionarlo en nuevas órdenes.
- Las órdenes finalizadas o canceladas permanecen en el historial.
- Cada cambio de estado registra fecha, hora y usuario.
- Los indicadores filtran por fecha de ingreso y muestran el estado actual de esas órdenes.

Seguimiento, cancelación, historial, indicadores y acceso del personal están incluidos, aunque sus operaciones no están implementadas en el contrato actual. Los detalles abiertos de permisos, sesiones y transiciones se identifican en el modelo y las decisiones técnicas; no se deducen del menú ni de datos de demostración.
