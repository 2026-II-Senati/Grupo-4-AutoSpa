
import {
  ConnectionError,
  ConnectionAcquireTimeoutError,
} from 'sequelize';

import { sequelize, Service, Order } from '../models/index.js';
import { presentOrder } from './order-response.js';
import {
  findActiveOrders,
  findOrderForUpdate,
  saveStatusChange,
} from '../repositories/orders.repository.js';
import { isAllowedOrderTransition } from '../validators/order-status.validator.js';

function businessError(status, code, message, field) {
  const error = new Error(message);
  error.httpStatus = status;
  error.apiCode = code;
  error.details = [{ field, message }];
  return error;
}

function toCents(value) {
  const normalized = String(value);

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new Error('Invalid monetary value from database');
  }

  const [whole, decimal = ''] = normalized.split('.');
  return Number(whole) * 100 + Number(decimal.padEnd(2, '0'));
}

function fromCents(cents) {
  return (cents / 100).toFixed(2);
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

export async function registerOrder(data, userId) {
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

      const servicePriceCents = toCents(service.price);
      const discountCents = Math.round(data.discountAmount * 100);

      if (discountCents > servicePriceCents) {
        throw businessError(
          422,
          'INVALID_DISCOUNT',
          'El descuento no puede superar el precio del servicio.',
          'discountAmount',
        );
      }

      const finalPriceCents = servicePriceCents - discountCents;

      return Order.create(
        {
          plate: data.plate,
          customerName: data.customerName,
          customerPhone: data.customerPhone,

          vehicleBrand: data.vehicleBrand,
          vehicleModel: data.vehicleModel,
          vehicleType: data.vehicleType,
          vehicleSize: data.vehicleSize,
          dirtLevel: data.dirtLevel,

          extraVacuum: data.extraVacuum,
          extraWaxing: data.extraWaxing,
          engineCleaning: data.engineCleaning,

          serviceId: service.id,
          serviceName: service.name,
          servicePrice: fromCents(servicePriceCents),
          discountAmount: fromCents(discountCents),
          finalPrice: fromCents(finalPriceCents),

          status: 'waiting',
          createdByUserId: userId,
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

export async function updateOrderStatus(id, data, userId) {
  const order = await sequelize.transaction(async (transaction) => {
    const current = await findOrderForUpdate(id, transaction);

    if (!current) {
      throw businessError(404, 'ORDER_NOT_FOUND', 'La orden no existe.', 'id');
    }

    if (current.status !== data.expectedStatus) {
      throw businessError(
        409,
        'ORDER_STATUS_CONFLICT',
        'El estado actual de la orden no coincide con expectedStatus.',
        'expectedStatus',
      );
    }

    if (!isAllowedOrderTransition(current.status, data.status)) {
      throw businessError(
        409,
        'INVALID_STATUS_TRANSITION',
        'La transición solicitada no está permitida.',
        'status',
      );
    }

    const changedAt = new Date();

    return saveStatusChange(
      current,
      {
        fromStatus: current.status,
        status: data.status,
        userId,
        reason: data.reason,
        changedAt,
      },
      transaction,
    );
  });

  return presentOrder(order);
}

export async function listActiveOrders() {
  return findActiveOrders();
}
