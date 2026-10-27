import * as demoServices from './20261026000001-demo-services.js';
import * as demoOrders from './20261026000002-demo-orders.js';

// Datos iniciales de demostración, en orden de carga.
export const seeders = [
  { name: '20261026000001-demo-services', ...demoServices },
  { name: '20261026000002-demo-orders', ...demoOrders },
];
