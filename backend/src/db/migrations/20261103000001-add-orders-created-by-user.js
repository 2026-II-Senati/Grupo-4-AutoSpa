// Debe ejecutarse después de la migración de users entregada por autenticación.
export async function up({ context: sequelize }) {
  await sequelize.query(`ALTER TABLE orders
    ADD COLUMN created_by_user_id INT UNSIGNED NULL AFTER status,
    ADD KEY idx_orders_created_by_user_id (created_by_user_id),
    ADD CONSTRAINT fk_orders_created_by_user FOREIGN KEY (created_by_user_id) REFERENCES users (id)
      ON DELETE RESTRICT ON UPDATE RESTRICT`);
}

export async function down({ context: sequelize }) {
  await sequelize.query(`ALTER TABLE orders DROP FOREIGN KEY fk_orders_created_by_user,
    DROP INDEX idx_orders_created_by_user_id, DROP COLUMN created_by_user_id`);
}
