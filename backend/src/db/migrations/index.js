import * as createServices from './20261026000001-create-services.js';
import * as createOrders from './20261026000002-create-orders.js';

// Orden de ejecución de las migraciones. Para agregar una nueva, créala en esta carpeta
// e inclúyela al final de la lista. No cambies migraciones que ya se integraron en develop.
export const migrations = [
  { name: '20261026000001-create-services', ...createServices },
  { name: '20261026000002-create-orders', ...createOrders },
];
