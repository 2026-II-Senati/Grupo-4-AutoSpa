import { Service } from '../models/index.js';

export async function findAvailableServices() {
  const services = await Service.findAll({
    attributes: ['id', 'name', 'price'],
    where: { isActive: true },
    order: [['id', 'ASC']],
    raw: true,
  });

  return services.map(({ id, name, price }) => ({
    id: Number(id),
    name,
    price: Number(price),
  }));
}
