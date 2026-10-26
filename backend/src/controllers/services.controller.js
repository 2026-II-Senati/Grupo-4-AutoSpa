import { listAvailableServices } from '../services/services.service.js';

export async function getAvailableServices(_request, response, next) {
  try {
    const services = await listAvailableServices();
    response.status(200).json(services);
  } catch (error) {
    next(error);
  }
}
