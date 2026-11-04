// Crea la tabla users según docs/modelo-datos.md (sección 7).
export async function up({ context: sequelize }) {
  await sequelize.query(`
    CREATE TABLE users (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      UNIQUE KEY uq_users_email (email),
      CONSTRAINT chk_users_name CHECK (CHAR_LENGTH(TRIM(name)) > 0),
      CONSTRAINT chk_users_email CHECK (CHAR_LENGTH(TRIM(email)) > 0),
      CONSTRAINT chk_users_is_active CHECK (is_active IN (0, 1))
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);
}

export async function down({ context: sequelize }) {
  await sequelize.query('DROP TABLE IF EXISTS users');
}
