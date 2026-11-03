import { findAllServices, createService, findServiceById } from '../repositories/services.admin.repository.js';

export async function listManagedServices() { return findAllServices(); }
export async function addService(data) { return createService({ ...data, isActive: true }); }
export async function editService(id, changes) {
  const service = await findServiceById(id);
  if (!service) { const error = new Error('El servicio solicitado no existe.'); error.httpStatus = 404; error.apiCode = 'SERVICE_NOT_FOUND'; throw error; }
  await service.update(changes); return service;
}
