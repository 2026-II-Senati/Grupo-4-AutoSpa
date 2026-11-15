
export function presentOrder(order) {
  return {
    id: order.id,
    plate: order.plate,
    customerName: order.customerName,
    customerPhone: order.customerPhone,

    vehicleBrand: order.vehicleBrand ?? null,
    vehicleModel: order.vehicleModel ?? null,
    vehicleType: order.vehicleType ?? null,
    vehicleSize: order.vehicleSize ?? null,
    dirtLevel: order.dirtLevel ?? null,

    extraVacuum: Boolean(order.extraVacuum),
    extraWaxing: Boolean(order.extraWaxing),
    engineCleaning: Boolean(order.engineCleaning),

    serviceId: order.serviceId,
    serviceName: order.serviceName,
    servicePrice: order.servicePrice,
    discountAmount: order.discountAmount ?? '0.00',
    finalPrice: order.finalPrice ?? order.servicePrice,

    status: order.status,
    createdAt: new Date(order.createdAt).toISOString(),
    updatedAt: new Date(order.updatedAt).toISOString(),
  };
}
