import * as createServices from './20261026000001-create-services.js';
import * as createOrders from './20261026000002-create-orders.js';
import * as addOrderCreator from './20261103000001-add-orders-created-by-user.js';
import * as createOrderStatusChanges from './20261103000002-create-order-status-changes.js';

// Las migraciones que referencian users dependen de que la migración de autenticación
// se registre antes de addOrderCreator. No cambies migraciones ya integradas.
export const migrations = [
  { name: '20261026000001-create-services', ...createServices },
  { name: '20261026000002-create-orders', ...createOrders },
  { name: '20261103000001-add-orders-created-by-user', ...addOrderCreator },
  { name: '20261103000002-create-order-status-changes', ...createOrderStatusChanges },
];
