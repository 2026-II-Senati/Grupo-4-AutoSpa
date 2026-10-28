// Crea la tabla services según docs/modelo-datos.md (sección 3).
export async function up({ context: sequelize }) {
  await sequelize.query(`
    CREATE TABLE services (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      description VARCHAR(255) NULL,
      price DECIMAL(10,2) NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      CONSTRAINT chk_services_name CHECK (CHAR_LENGTH(TRIM(name)) > 0),
      CONSTRAINT chk_services_price CHECK (price > 0),
      CONSTRAINT chk_services_is_active CHECK (is_active IN (0, 1))
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);
}

export async function down({ context: sequelize }) {
  await sequelize.query('DROP TABLE IF EXISTS services');
}
