// Crea la tabla orders según docs/modelo-datos.md (secciones 4, 5 y 6).
//
// Regla "una sola orden activa por placa":
// active_plate es una columna generada que copia la placa solo cuando el estado es activo
// (waiting, washing, ready) y vale NULL en estados finales (delivered, cancelled).
// El índice UNIQUE uq_orders_active_plate impide dos órdenes activas con la misma placa,
// incluso si llegan dos registros al mismo tiempo. MySQL permite varios NULL en un UNIQUE,
// así que las órdenes finalizadas conservan su historial y liberan la placa.
export async function up({ context: sequelize }) {
  await sequelize.query(`
    CREATE TABLE orders (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      plate VARCHAR(6) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
      customer_name VARCHAR(100) NOT NULL,
      customer_phone VARCHAR(16) NULL,
      service_id INT UNSIGNED NOT NULL,
      service_name VARCHAR(100) NOT NULL,
      service_price DECIMAL(10,2) NOT NULL,
      status VARCHAR(20) CHARACTER SET ascii COLLATE ascii_bin NOT NULL DEFAULT 'waiting',
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      active_plate VARCHAR(6) CHARACTER SET ascii COLLATE ascii_bin
        GENERATED ALWAYS AS (
          CASE WHEN status IN ('waiting', 'washing', 'ready') THEN plate ELSE NULL END
        ) STORED,
      PRIMARY KEY (id),
      KEY idx_orders_service_id (service_id),
      KEY idx_orders_status_created_at (status, created_at, id),
      UNIQUE KEY uq_orders_active_plate (active_plate),
      CONSTRAINT fk_orders_service FOREIGN KEY (service_id) REFERENCES services (id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
      CONSTRAINT chk_orders_plate CHECK (REGEXP_LIKE(plate, '^[A-Z0-9]{3}[0-9]{3}$', 'c')),
      CONSTRAINT chk_orders_customer_name CHECK (CHAR_LENGTH(TRIM(customer_name)) > 0),
      CONSTRAINT chk_orders_customer_phone CHECK (
        customer_phone IS NULL OR REGEXP_LIKE(customer_phone, '^[+]?[0-9]{7,15}$', 'c')
      ),
      CONSTRAINT chk_orders_service_name CHECK (CHAR_LENGTH(TRIM(service_name)) > 0),
      CONSTRAINT chk_orders_service_price CHECK (service_price > 0),
      CONSTRAINT chk_orders_status CHECK (
        status IN ('waiting', 'washing', 'ready', 'delivered', 'cancelled')
      )
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);
}

export async function down({ context: sequelize }) {
  await sequelize.query('DROP TABLE IF EXISTS orders');
}
