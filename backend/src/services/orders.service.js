import { presentOrder } from './order-response.js';
import { findActiveOrders } from '../repositories/orders.repository.js';
import {
  ConnectionError,
  ConnectionAcquireTimeoutError,
} from 'sequelize';

import {
  sequelize,
  Service,
  Order,
} from '../models/index.js';

function businessError(status, code, message, field) {
  const error = new Error(message);

  error.httpStatus = status;
  error.apiCode = code;
  error.details = [{ field, message }];

  return error;
}

function isActivePlateConflict(error) {
  const databaseError = error.original ?? error.parent;

  return (
    databaseError?.code === 'ER_DUP_ENTRY' &&
    (databaseError.sqlMessage ?? databaseError.message ?? '')
      .includes('uq_orders_active_plate')
  );
}

export function isTemporaryDatabaseError(error) {
  const databaseError = error.original ?? error.parent ?? error;

  return (
    error instanceof ConnectionError ||
    error instanceof ConnectionAcquireTimeoutError ||
    [
      'ER_LOCK_DEADLOCK',
      'ER_LOCK_WAIT_TIMEOUT',
      'PROTOCOL_CONNECTION_LOST',
      'ECONNRESET',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'EPIPE',
      'ENOTFOUND',
      'EAI_AGAIN',
    ].includes(databaseError.code)
  );
}

export async function registerOrder(data) {
  let order;

  try {
    order = await sequelize.transaction(async (transaction) => {
      const service = await Service.findByPk(data.serviceId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!service || !service.isActive) {
        throw businessError(
          422,
          'SERVICE_UNAVAILABLE',
          'El servicio seleccionado no está disponible.',
          'serviceId',
        );
      }

      return Order.create(
        {
          plate: data.plate,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          serviceId: service.id,
          serviceName: service.name,
          servicePrice: service.price,
          status: 'waiting',
        },
        { transaction },
      );
    });
  } catch (error) {
    if (isActivePlateConflict(error)) {
      throw businessError(
        409,
        'ACTIVE_ORDER_EXISTS',
        'La placa ya tiene una orden activa.',
        'plate',
      );
    }

    throw error;
  }

  return presentOrder(order);
}

export async function listActiveOrders() {
  return findActiveOrders();
}
