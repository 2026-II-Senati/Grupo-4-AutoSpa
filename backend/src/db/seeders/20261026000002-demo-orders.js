// Órdenes ficticias para desarrollo. Datos inventados; no corresponden a personas reales.
// - ABC123 tiene una visita entregada y otra en espera: una placa se puede reutilizar
//   cuando su orden anterior está en un estado final.
// - B4R456 usó "Lavado de motor", hoy inactivo: la orden conserva el nombre y precio acordados.
const DEMO_ORDERS = [
  { plate: 'ABC123', customerName: 'Ana Pérez', customerPhone: '+51987654321', service: 'Lavado básico', status: 'delivered', hoursAgo: 48 },
  { plate: 'B4R456', customerName: 'María Mamani', customerPhone: null, service: 'Lavado de motor', status: 'delivered', hoursAgo: 30 },
  { plate: 'XYZ789', customerName: 'Luis Quispe', customerPhone: '987123456', service: 'Lavado premium', status: 'washing', hoursAgo: 2 },
  { plate: 'ABC123', customerName: 'Ana Pérez', customerPhone: '+51987654321', service: 'Encerado', status: 'waiting', hoursAgo: 1 },
];

const DEMO_PLATES = [...new Set(DEMO_ORDERS.map((order) => order.plate))];

export async function up({ context: sequelize }) {
  const [services] = await sequelize.query('SELECT id, name, price FROM services WHERE name IN (:names)', {
    replacements: { names: [...new Set(DEMO_ORDERS.map((order) => order.service))] },
  });
  const servicesByName = new Map(services.map((service) => [service.name, service]));

  for (const order of DEMO_ORDERS) {
    const service = servicesByName.get(order.service);
    if (!service) {
      throw new Error(`No existe el servicio de demostración "${order.service}". Ejecuta primero el seeder de servicios.`);
    }
    const createdAt = new Date(Date.now() - order.hoursAgo * 60 * 60 * 1000);
    await sequelize.query(
      `INSERT INTO orders
         (plate, customer_name, customer_phone, service_id, service_name, service_price, status, created_at, updated_at)
       VALUES
         (:plate, :customerName, :customerPhone, :serviceId, :serviceName, :servicePrice, :status, :createdAt, :createdAt)`,
      {
        replacements: {
          plate: order.plate,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          serviceId: service.id,
          serviceName: service.name,
          servicePrice: service.price,
          status: order.status,
          createdAt,
        },
      },
    );
  }
}

export async function down({ context: sequelize }) {
  await sequelize.query('DELETE FROM orders WHERE plate IN (:plates)', {
    replacements: { plates: DEMO_PLATES },
  });
}
