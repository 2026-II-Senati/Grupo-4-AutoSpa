const STORAGE_KEY = 'autospa.prototype.orders.v1';
const activeStatuses = new Set(['waiting', 'washing', 'ready']);

// Datos de demostración alineados con el contrato; no representan servicios reales del negocio.
const demoServices = [
  { id: 1, name: 'Lavado básico', description: 'Lavado exterior', price: '20.00' },
  { id: 2, name: 'Lavado completo', description: 'Lavado exterior e interior', price: '35.00' },
  { id: 3, name: 'Encerado', description: 'Lavado y encerado de carrocería', price: '50.00' },
];

function waitForDemoResponse() {
  return new Promise((resolve) => window.setTimeout(resolve, 250));
}

function readOrders() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    throw new Error('No se pudieron leer las órdenes de demostración de este navegador.');
  }
}

function saveOrders(orders) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    throw new Error('El navegador no pudo guardar la orden de demostración. Revisa el espacio disponible.');
  }
}

export async function getDemoServices() {
  await waitForDemoResponse();
  return demoServices.map((service) => ({ ...service }));
}

export async function getDemoOrders() {
  await waitForDemoResponse();
  return readOrders()
    .filter((order) => activeStatuses.has(order.status))
    .sort((first, second) => first.createdAt.localeCompare(second.createdAt) || first.id - second.id);
}

export async function createDemoOrder(order) {
  await waitForDemoResponse();

  const service = demoServices.find((item) => item.id === order.serviceId);
  if (!service) {
    throw new Error('El servicio seleccionado no está disponible.');
  }

  const orders = readOrders();
  if (orders.some((item) => item.plate === order.plate && activeStatuses.has(item.status))) {
    throw new Error('La placa ya tiene una orden activa.');
  }

  const now = new Date().toISOString();
  const nextId = orders.reduce((maximum, item) => Math.max(maximum, item.id), 0) + 1;
  const createdOrder = {
    id: nextId,
    plate: order.plate,
    customerName: order.customerName,
    customerPhone: order.customerPhone || null,
    serviceId: service.id,
    serviceName: service.name,
    servicePrice: service.price,
    status: 'waiting',
    createdAt: now,
    updatedAt: now,
  };

  saveOrders([...orders, createdOrder]);
  return createdOrder;
}
