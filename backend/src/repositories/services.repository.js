import { Service } from '../models/index.js';

export async function findAvailableServices() {
  const services = await Service.findAll({
    attributes: ['id', 'name', 'description', 'price'],
    where: { isActive: true },
    order: [['id', 'ASC']],
    raw: true,
  });

  return services.map(({ id, name, description, price }) => ({
    id,
    name,
    description,
    price,
  }));
}
