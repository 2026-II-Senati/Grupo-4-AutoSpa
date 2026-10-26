// Servicios ficticios para desarrollo. Incluye activos e inactivos para comprobar las reglas:
// solo los activos se ofrecen en nuevas órdenes; los inactivos se conservan para el historial.
export const DEMO_SERVICES = [
  { name: 'Lavado básico', description: 'Lavado exterior con agua y champú', price: '20.00', isActive: true },
  { name: 'Lavado premium', description: 'Lavado exterior e interior con aspirado', price: '45.00', isActive: true },
  { name: 'Encerado', description: 'Encerado y pulido de carrocería', price: '35.00', isActive: true },
  { name: 'Lavado de motor', description: 'Limpieza del compartimiento del motor', price: '30.00', isActive: false },
  { name: 'Aspirado express', description: null, price: '15.00', isActive: false },
];

export async function up({ context: sequelize }) {
  const now = new Date();
  for (const service of DEMO_SERVICES) {
    await sequelize.query(
      `INSERT INTO services (name, description, price, is_active, created_at, updated_at)
       VALUES (:name, :description, :price, :isActive, :now, :now)`,
      { replacements: { ...service, now } },
    );
  }
}

export async function down({ context: sequelize }) {
  await sequelize.query('DELETE FROM services WHERE name IN (:names)', {
    replacements: { names: DEMO_SERVICES.map((service) => service.name) },
  });
}
