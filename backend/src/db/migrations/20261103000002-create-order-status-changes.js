export async function up({ context: sequelize }) {
  await sequelize.query(`CREATE TABLE order_status_changes (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id INT UNSIGNED NOT NULL,
    from_status VARCHAR(20) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    to_status VARCHAR(20) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    changed_by_user_id INT UNSIGNED NOT NULL,
    changed_at DATETIME(3) NOT NULL,
    reason VARCHAR(255) NULL,
    PRIMARY KEY (id),
    KEY idx_order_status_changes_order_changed (order_id, changed_at, id),
    KEY idx_order_status_changes_user (changed_by_user_id),
    CONSTRAINT fk_order_status_changes_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_order_status_changes_user FOREIGN KEY (changed_by_user_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT chk_order_status_changes_transition CHECK (
      (from_status = 'waiting' AND to_status IN ('washing', 'cancelled')) OR
      (from_status = 'washing' AND to_status = 'ready') OR
      (from_status = 'ready' AND to_status = 'delivered')
    ),
    CONSTRAINT chk_order_status_changes_reason CHECK (
      (to_status = 'cancelled' AND reason IS NOT NULL AND CHAR_LENGTH(TRIM(reason)) BETWEEN 1 AND 255) OR
      (to_status <> 'cancelled' AND reason IS NULL)
    )
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`);
}

export async function down({ context: sequelize }) { await sequelize.query('DROP TABLE IF EXISTS order_status_changes'); }
