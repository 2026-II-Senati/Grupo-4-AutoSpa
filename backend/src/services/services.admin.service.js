import { findAllServices, createService, findServiceById } from '../repositories/services.admin.repository.js';

export function toServiceResponse(service) {
  const value = service?.get ? service.get({ plain: true }) : service;
  return { id: value.id, name: value.name, description: value.description, price: String(value.price), isActive: Boolean(value.isActive) };
}

export async function listManagedServices() { return (await findAllServices()).map(toServiceResponse); }
export async function addService(data) { return toServiceResponse(await createService({ ...data, isActive: true })); }
export async function editService(id, changes) {
  const service = await findServiceById(id);
  if (!service) { const error = new Error('El servicio solicitado no existe.'); error.httpStatus = 404; error.apiCode = 'SERVICE_NOT_FOUND'; throw error; }
  await service.update(changes); return toServiceResponse(service);
}
