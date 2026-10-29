import { findAvailableServices } from '../repositories/services.repository.js';

export async function listAvailableServices() {
  return findAvailableServices();
}
