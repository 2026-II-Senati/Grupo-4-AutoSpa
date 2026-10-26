import { findActiveOrders } from '../repositories/orders.repository.js';

export async function listActiveOrders() {
  return findActiveOrders();
}
