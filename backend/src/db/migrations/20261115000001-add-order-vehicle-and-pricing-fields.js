
export async function up({ context: sequelize }) {
  await sequelize.query(`
    ALTER TABLE orders
      ADD COLUMN vehicle_brand VARCHAR(80) NULL AFTER customer_phone,
      ADD COLUMN vehicle_model VARCHAR(80) NULL AFTER vehicle_brand,
      ADD COLUMN vehicle_type VARCHAR(20) NULL AFTER vehicle_model,
      ADD COLUMN vehicle_size VARCHAR(10) NULL AFTER vehicle_type,
      ADD COLUMN dirt_level VARCHAR(10) NULL AFTER vehicle_size,
      ADD COLUMN extra_vacuum TINYINT(1) NOT NULL DEFAULT 0 AFTER dirt_level,
      ADD COLUMN extra_waxing TINYINT(1) NOT NULL DEFAULT 0 AFTER extra_vacuum,
      ADD COLUMN engine_cleaning TINYINT(1) NOT NULL DEFAULT 0 AFTER extra_waxing,
      ADD COLUMN discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER service_price,
      ADD COLUMN final_price DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER discount_amount
  `);

  // Las órdenes históricas conservan su precio original.
  await sequelize.query(`
    UPDATE orders
    SET final_price = service_price
  `);
}

export async function down({ context: sequelize }) {
  await sequelize.query(`
    ALTER TABLE orders
      DROP COLUMN final_price,
      DROP COLUMN discount_amount,
      DROP COLUMN engine_cleaning,
      DROP COLUMN extra_waxing,
      DROP COLUMN extra_vacuum,
      DROP COLUMN dirt_level,
      DROP COLUMN vehicle_size,
      DROP COLUMN vehicle_type,
      DROP COLUMN vehicle_model,
      DROP COLUMN vehicle_brand
  `);
}
