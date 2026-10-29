// Shared by POST and GET: use only the historical values stored on the order.
export function presentOrder(order) {
  return {
    id: order.id,
    plate: order.plate,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    serviceId: order.serviceId,
    serviceName: order.serviceName,
    servicePrice: order.servicePrice,
    status: order.status,
    createdAt: new Date(order.createdAt).toISOString(),
    updatedAt: new Date(order.updatedAt).toISOString(),
  };
}
