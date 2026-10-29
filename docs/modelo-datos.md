# Modelo de datos de AutoSpa — diseño completo y etapas de implementación



## 1. Alcance y decisiones para revisión

MySQL es el motor confirmado y Sequelize el acceso a datos previsto. Este ticket define el diseño; conexión, migraciones, endpoints e interfaz corresponden a los tickets de implementación.

El diseño comprende cuatro entidades: `users`, `services`, `orders` y `order_status_changes`. Una orden pertenece a un servicio y un servicio puede aparecer en muchas órdenes. Cada visita genera una orden nueva. Los datos de cliente y vehículo se conservan en la orden; el alcance actual no requiere catálogos independientes de clientes o vehículos.

| Entidad o ampliación | Diseño en este documento | Implementación |
|---|---|---|
| services | Completo | Sprint actual |
| orders: datos de visita y servicio | Completo | Sprint actual |
| users | Completo | Etapa de autenticación |
| orders.created_by_user_id | Definido | Etapa de autenticación |
| order_status_changes | Completo | Etapa de seguimiento, después de autenticación |

“Completo” se refiere al alcance conocido del proyecto. El contrato HTTP del sprint sigue descrito en api.md; las operaciones futuras requieren su propio contrato.

Datos mínimos propuestos: placa y nombre del cliente obligatorios; teléfono opcional. No se solicita DNI, marca, modelo ni color. Cliente y teléfono son datos de esa visita, no identificadores únicos. Estas elecciones y las longitudes siguientes requieren confirmación durante la revisión; no se presentan como reglas ya aprobadas.

Base de compatibilidad propuesta: MySQL 8.0.16 o posterior, InnoDB y `utf8mb4`. Las restricciones CHECK deben aplicarse efectivamente. Espinoza registrará la versión concreta comprobada al implementar las migraciones.

## 2. Convenciones

- Tablas y columnas en inglés y snake_case; API en camelCase.
- Identificadores `INT UNSIGNED AUTO_INCREMENT`, positivos; JSON los representa como números enteros.
- Importes en soles (PEN), `DECIMAL(10,2)`: entre 0.01 y 99999999.99. Nunca FLOAT. La API devuelve cadenas con dos decimales.
- Fechas `DATETIME(3)`, almacenadas en UTC; aplicación y conexión configuradas en UTC. La API devuelve ISO 8601 con `Z`. La interfaz presenta la hora de Lima.
- `created_at` y `updated_at` se asignan en el servidor; Sequelize debe mapearlos explícitamente y actualizarlos. El navegador no los envía.
- Los campos NOT NULL no admiten cadenas vacías cuando representan nombres o placa.

## 3. Tabla services

| Columna | Tipo MySQL | Obligatorio | Clave / valor / regla |
|---|---|---|---|
| id | INT UNSIGNED | Sí | PK, AUTO_INCREMENT |
| name | VARCHAR(100) | Sí | Nombre recortado, 1–100 caracteres |
| description | VARCHAR(255) | No | NULL si se omite o queda vacía |
| price | DECIMAL(10,2) | Sí | CHECK (price > 0) |
| is_active | BOOLEAN | Sí | DEFAULT TRUE; CHECK (is_active IN (0,1)) |
| created_at | DATETIME(3) | Sí | Creación en UTC |
| updated_at | DATETIME(3) | Sí | Última modificación en UTC |

No se exige nombre único: el identificador distingue servicios. Se desactivan para retirarlos de nuevas órdenes. No se eliminan servicios referenciados por órdenes.

## 4. Tabla orders

| Columna | Tipo MySQL | Obligatorio | Clave / valor / regla |
|---|---|---|---|
| id | INT UNSIGNED | Sí | PK, AUTO_INCREMENT |
| plate | VARCHAR(6), ASCII, ascii_bin | Sí | Normalizada; CHECK de formato |
| customer_name | VARCHAR(100) | Sí | Recortado, 1–100 caracteres |
| customer_phone | VARCHAR(16) | No | NULL si se omite o está vacío; formato indicado abajo |
| service_id | INT UNSIGNED | Sí | FK a services.id; ON DELETE RESTRICT, ON UPDATE RESTRICT |
| service_name | VARCHAR(100) | Sí | Copia del nombre del servicio al crear |
| service_price | DECIMAL(10,2) | Sí | Copia del precio al crear; CHECK (service_price > 0) |
| status | VARCHAR(20), ASCII, ascii_bin | Sí | DEFAULT 'waiting'; CHECK de valores permitidos |
| created_at | DATETIME(3) | Sí | Fecha de ingreso en UTC |
| updated_at | DATETIME(3) | Sí | Última modificación en UTC |
| active_plate | VARCHAR(6), ASCII, ascii_bin, generada STORED | Calculado | Placa para estados activos; NULL para finales |
| created_by_user_id | INT UNSIGNED | No para registros anteriores; obligatorio en nuevas creaciones autenticadas | Columna futura; FK a users.id, ON DELETE RESTRICT, ON UPDATE RESTRICT |

Índices: PK `id`; FK/index `service_id`; índice `(status, created_at, id)`; UNIQUE `uq_orders_active_plate(active_plate)`. Al incorporar usuarios, añadir índice y FK sobre `created_by_user_id`.

`created_by_user_id` identifica a quien registra la visita; no identifica al cliente ni al último usuario que cambió su estado. No se añade en el sprint actual. Su incorporación y el tratamiento de órdenes anteriores se describen en la sección 10.

No existe una restricción única global sobre `plate`: impediría visitas posteriores. Tampoco se modifica retrospectivamente `service_name` o `service_price` al editar el catálogo. Las respuestas de órdenes utilizan estas copias, no el precio actual del servicio.

## 5. Validación y normalización

### Placa

Alcance propuesto: placas ordinarias de seis caracteres; formatos especiales quedan fuera de este sprint. Es una política del proyecto, no una afirmación sobre todos los formatos legales de Perú.

1. Exigir string; recortar espacios exteriores y convertir a mayúsculas.
2. Admitir seis caracteres contiguos o un único guion entre el tercero y cuarto: expresión de entrada `^[A-Z0-9]{3}-?[0-9]{3}$`.
3. Retirar ese guion y guardar seis caracteres. No quitar arbitrariamente símbolos o espacios interiores.
4. Validar la forma persistida con `^[A-Z0-9]{3}[0-9]{3}$`.

Ejemplos: `" abc-123 "` y `"ABC123"` se guardan como `ABC123`; `"AB C123"`, `"ABC--123"` y `"ABC12"` se rechazan. La API siempre devuelve la forma sin guion.

### Cliente y teléfono

Nombre: string, trim, 1–100 caracteres Unicode; no exigir dos apellidos ni limitarlo a letras ASCII.
Teléfono: opcional; trim; vacío u omitido se convierte en NULL. Si se informa, debe cumplir `^\+?[0-9]{7,15}$`, sin espacios, guiones ni paréntesis. Se conserva como string para no perder prefijos o ceros. NULL explícito se acepta para este campo.
El backend valida todo aunque React también lo haga; no truncar valores largos silenciosamente.

## 6. Estados y unicidad de placa activa

| Código persistido / API | Etiqueta en pantalla | ¿Activa? |
|---|---|---|
| waiting | En espera | Sí |
| washing | En lavado | Sí |
| ready | Listo para entregar | Sí |
| delivered | Entregado | No |
| cancelled | Cancelado | No |

Toda creación comienza en `waiting`. Este sprint no expone cambios de estado ni cancelación. Se reserva `cancelled` para la regla de negocio de cancelación; las órdenes finales permanecen en la base aunque no aparezcan en la consulta de activas.

Fragmento de diseño para la migración de orders (no es una migración ejecutada):

```sql
CONSTRAINT chk_orders_status CHECK (
  status IN ('waiting', 'washing', 'ready', 'delivered', 'cancelled')
),
CONSTRAINT chk_orders_plate CHECK (
  REGEXP_LIKE(plate, '^[A-Z0-9]{3}[0-9]{3}$', 'c')
),
active_plate VARCHAR(6) CHARACTER SET ascii COLLATE ascii_bin
  GENERATED ALWAYS AS (
    CASE WHEN status IN ('waiting', 'washing', 'ready')
      THEN plate ELSE NULL END
  ) STORED,
UNIQUE KEY uq_orders_active_plate (active_plate)
```

La columna generada evita depender de que cada endpoint mantenga una bandera. MySQL permite múltiples NULL en un índice UNIQUE: las órdenes finales liberan la placa sin borrar su historial. Dos INSERT simultáneos de la misma placa activa no pueden confirmar ambos.

Flujo requerido del registro:

1. Validar y normalizar el cuerpo.
2. Abrir una transacción InnoDB; leer el servicio por ID con bloqueo compartido mantenido hasta COMMIT, para conservar coherentemente disponibilidad, nombre y precio frente a una edición concurrente.
3. Si no existe o está inactivo, abortar con SERVICE_UNAVAILABLE.
4. Insertar la orden con las copias del servicio y estado waiting; confirmar antes de responder 201.
5. Ante colisión del índice específico uq_orders_active_plate, hacer ROLLBACK y devolver 409 ACTIVE_ORDER_EXISTS. No convertir cualquier error de unicidad en ese mensaje.
6. Otros fallos revierten toda la operación. Deadlocks/timeouts transitorios devuelven 503 TEMPORARILY_UNAVAILABLE si no se recuperan con reintentos internos acotados; no se informan como duplicados.

Un SELECT previo para comprobar la placa puede mejorar el mensaje, pero no reemplaza el índice. No usar INSERT IGNORE, REPLACE ni upsert para crear órdenes: podrían ocultar el rechazo o modificar otra visita.

Referencia técnica: [MySQL: índices de columnas generadas](https://dev.mysql.com/doc/refman/8.4/en/create-table-secondary-indexes.html) y [CREATE TABLE e índices UNIQUE](https://dev.mysql.com/doc/refman/8.4/en/create-table.html).

## 7. Tabla users

Representa al personal que accede al sistema. Se implementará al incorporar autenticación.

| Columna | Tipo MySQL | Obligatorio | Clave / valor / regla |
|---|---|---|---|
| id | INT UNSIGNED | Sí | PK, AUTO_INCREMENT |
| name | VARCHAR(100) | Sí | Trim, 1–100 caracteres Unicode |
| email | VARCHAR(254), utf8mb4, utf8mb4_bin | Sí | Correo normalizado; UNIQUE uq_users_email |
| password_hash | VARCHAR(255) | Sí | Resultado codificado del algoritmo de hash de contraseñas elegido en el ticket de autenticación |
| is_active | BOOLEAN | Sí | DEFAULT TRUE; CHECK (is_active IN (0,1)) |
| created_at | DATETIME(3) | Sí | Creación UTC, asignada por el servidor |
| updated_at | DATETIME(3) | Sí | Última modificación UTC |

Índices: PK id y UNIQUE uq_users_email(email). Política propuesta de acceso: trim y minúsculas para el correo tanto al registrar como al iniciar sesión; validar formato y longitud antes de persistir. El índice compara el valor normalizado. Un correo desactivado continúa reservado a su cuenta.

Nunca almacenar contraseñas en texto claro ni devolver password_hash en la API. El ticket de autenticación debe concretar el algoritmo, sus parámetros y el mecanismo de sesión. No se añaden roles porque las reglas actuales no distinguen permisos entre perfiles; si se acuerdan, requieren una ampliación explícita.

Desactivar una cuenta impide nuevas operaciones autenticadas y conserva su relación con órdenes y eventos. Las cuentas referenciadas no se eliminan físicamente. La política de provisión de cuentas y sesiones no está implementada por este diseño.

## 8. Tabla order_status_changes

Registro de auditoría de las transiciones reales, implementado después de usuarios. Cada fila corresponde a un cambio confirmado de una orden. La creación inicial en waiting se representa mediante orders.created_at y orders.created_by_user_id, sin inventar una transición desde un estado inexistente.

| Columna | Tipo MySQL | Obligatorio | Clave / valor / regla |
|---|---|---|---|
| id | INT UNSIGNED | Sí | PK, AUTO_INCREMENT |
| order_id | INT UNSIGNED | Sí | FK a orders.id; ON DELETE RESTRICT, ON UPDATE RESTRICT |
| from_status | VARCHAR(20), ASCII, ascii_bin | Sí | Estado inmediatamente anterior |
| to_status | VARCHAR(20), ASCII, ascii_bin | Sí | Estado nuevo |
| changed_by_user_id | INT UNSIGNED | Sí | FK a users.id; ON DELETE RESTRICT, ON UPDATE RESTRICT |
| changed_at | DATETIME(3) | Sí | Fecha y hora UTC generadas por el servidor |
| reason | VARCHAR(255) | Solo en cancelación | Trim, 1–255 caracteres si to_status = cancelled; NULL en las demás transiciones |

Índices: PK id; índice (order_id, changed_at, id) para reconstruir la secuencia; índice changed_by_user_id para la FK. No incluir updated_at: los eventos confirmados son inmutables y no se editan ni eliminan mediante la aplicación. Ordenar por changed_at y luego id permite resolver empates de milisegundos.

Transiciones propuestas, siguiendo la secuencia de estados del negocio:

| from_status | to_status permitido | Motivo |
|---|---|---|
| waiting | washing | NULL |
| washing | ready | NULL |
| ready | delivered | NULL |
| waiting | cancelled | Obligatorio |
| delivered o cancelled | Ninguno | Estado final |

La prohibición de saltos y retrocesos es una propuesta para revisión del equipo. Implementar CHECK que admita únicamente esos cuatro pares y CHECK que exija reason no nulo y no vacío tras TRIM al cancelar, y NULL en los otros casos. Así se excluyen también estados desconocidos y transiciones al mismo estado.

La base valida la forma del evento; la coherencia entre ese evento y el estado actual exige lógica transaccional:

1. Obtener el usuario de la sesión autenticada; nunca confiar en un ID enviado por el navegador. Comprobar que esté activo.
2. Abrir transacción y bloquear la orden para actualización; releer su estado actual.
3. Validar la transición y el motivo contra ese estado; rechazar operaciones sobre un estado ya cambiado por otra solicitud.
4. Actualizar orders.status y updated_at e insertar el evento con la misma marca temporal y el usuario real.
5. Confirmar ambos cambios juntos. Si falla la inserción del evento, revertir también el cambio de estado.

Las escrituras de estado deben pasar por esta operación. El bloqueo de la orden serializa cambios concurrentes; la columna active_plate se recalcula automáticamente al finalizar o cancelar. La cancelación no borra la orden. El motivo se guarda en el evento, sin duplicarlo en orders.

## 9. Relaciones y conservación del historial

| Relación | Cardinalidad y significado |
|---|---|
| services.id → orders.service_id | Un servicio tiene cero o muchas órdenes; cada orden tiene exactamente un servicio |
| users.id → orders.created_by_user_id | Un usuario registra cero o muchas órdenes; cada nueva orden autenticada tiene un creador; las anteriores pueden carecer de él |
| orders.id → order_status_changes.order_id | Una orden tiene cero o muchos cambios; cada cambio pertenece a una orden |
| users.id → order_status_changes.changed_by_user_id | Un usuario realiza cero o muchos cambios; cada cambio identifica exactamente un usuario |

Todas las FK usan RESTRICT para eliminación y actualización de identificadores. Desactivar servicios o usuarios conserva los datos históricos. No realizar borrados en cascada de órdenes ni de eventos. Una orden sin cambios es válida y comienza en waiting.

El listado de historial y los indicadores se obtienen de orders y, cuando corresponda, order_status_changes; no necesitan tablas separadas en el alcance actual. Los indicadores filtran por orders.created_at y muestran orders.status, como indican las reglas del negocio.

## 10. Implementación por etapas y migración

1. **Sprint actual:** crear services y orders sin created_by_user_id. Mantener los tres endpoints de api.md. Solo se permite crear órdenes waiting; no se implementan cambios de estado.
2. **Autenticación:** crear users, añadir orders.created_by_user_id como nullable con índice y FK. Las órdenes existentes conservan NULL, que significa “creada antes de incorporar autenticación”; no asignar retrospectivamente un usuario ficticio. Desde la activación de autenticación, el backend exige un usuario real activo en toda nueva creación y lo toma de la sesión. La columna permanece nullable por los registros anteriores; la obligatoriedad para nuevas operaciones se aplica en el servicio de creación.
3. **Seguimiento:** crear order_status_changes y habilitar la operación transaccional descrita. No reconstruir eventos anteriores sin evidencia. Las órdenes previas pueden comenzar a registrar sus cambios reales desde esta etapa.

Al implementar cada etapa, actualizar el contrato HTTP y la guía de instalación con las rutas y migraciones efectivas. Antes de activar seguimiento debe estar disponible autenticación. La definición anticipada de las cuatro entidades no acredita que ya existan sus tablas ni endpoints.

## 11. Comprobaciones y aprobación pendientes

La implementación debe demostrar: creación waiting; rechazo de servicio inactivo; conservación del nombre/precio tras editar el catálogo; normalización de placas equivalentes; dos solicitudes concurrentes con exactamente un 201 y un 409; cero filas parciales; reutilización de placa tras un estado final con datos de prueba, sin añadir endpoints fuera de alcance.

En las etapas posteriores se comprobará: correo duplicado rechazado tras normalización; usuario inactivo impedido de operar; órdenes anteriores con creador NULL sin atribuciones inventadas; cancelación solo desde waiting y con motivo; transición y evento confirmados o revertidos juntos; cambios concurrentes sin saltos ni eventos duplicados; conservación del historial al desactivar cuentas y servicios.
