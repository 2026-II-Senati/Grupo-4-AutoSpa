const statusLabels = {
  waiting: 'En espera',
  washing: 'En lavado',
  ready: 'Listo para entregar',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const typeLabels = {
  automovil: 'Automóvil',
  suv: 'SUV',
  camioneta: 'Camioneta',
  furgoneta: 'Furgoneta',
  motocicleta: 'Motocicleta',
};

const sizeLabels = {
  pequeno: 'Pequeño',
  mediano: 'Mediano',
  grande: 'Grande',
};

const dirtLabels = {
  bajo: 'Bajo',
  medio: 'Medio',
  alto: 'Alto',
};

const statusLabel = (status) =>
  statusLabels[String(status || '').toLowerCase()] ||
  status ||
  'En espera';

const money = (amount) =>
  Number(amount || 0).toLocaleString('es-PE', {
    style: 'currency',
    currency: 'PEN',
  });

function vehicleDescription(order) {
  const identity = [order.vehicleBrand, order.vehicleModel]
    .filter(Boolean)
    .join(' ');

  const type = typeLabels[order.vehicleType] || order.vehicleType;
  const size = sizeLabels[order.vehicleSize] || order.vehicleSize;
  const dirt = dirtLabels[order.dirtLevel] || order.dirtLevel;

  return [
    identity,
    type,
    size ? `Tamaño: ${size}` : null,
    dirt ? `Suciedad: ${dirt}` : null,
  ]
    .filter(Boolean)
    .join(' · ') || 'Datos del vehículo no registrados';
}

function extrasDescription(order) {
  const extras = [];

  if (order.extraVacuum) extras.push('Aspirado');
  if (order.extraWaxing) extras.push('Encerado adicional');
  if (order.engineCleaning) extras.push('Limpieza de motor');

  return extras.length ? extras.join(', ') : 'Sin adicionales';
}

export function OrdersList({ orders, loading, error, onRetry }) {
  return (
    <section
      className="orders-list-card"
      aria-labelledby="orders-list-title"
    >
      <div className="card-heading list-heading">
        <div>
          <span className="section-kicker">SEGUIMIENTO</span>
          <h2 id="orders-list-title">Órdenes activas</h2>
        </div>

        <div className="orders-list-actions">
          <span className="orders-count">
            {orders.length} {orders.length === 1 ? 'orden' : 'órdenes'}
          </span>

          <button
            type="button"
            className="refresh-orders-button"
            onClick={onRetry}
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="list-state" role="status">
          <span className="spinner" />
          Cargando órdenes...
        </div>
      ) : error ? (
        <div className="list-state error-state" role="alert">
          <span>{error}</span>
          <button
            type="button"
            className="text-button"
            onClick={onRetry}
          >
            Volver a intentar
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="list-state empty-state">
          <span className="empty-icon" aria-hidden="true">
            ◇
          </span>
          <strong>Aún no hay órdenes activas</strong>
          <span>Las órdenes registradas aparecerán aquí.</span>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Cliente y vehículo</th>
                <th>Placa</th>
                <th>Servicio y adicionales</th>
                <th>Precio final</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.customerName || '—'}</strong>
                    <small>{order.customerPhone || 'Sin teléfono'}</small>
                    <small>{vehicleDescription(order)}</small>
                  </td>

                  <td className="plate-cell">
                    {order.plate || '—'}
                  </td>

                  <td>
                    <strong>{order.serviceName || '—'}</strong>
                    <small>{extrasDescription(order)}</small>
                    {Number(order.discountAmount || 0) > 0 && (
                      <small>
                        Descuento: {money(order.discountAmount)}
                      </small>
                    )}
                  </td>

                  <td>
                    <strong>{money(order.finalPrice ?? order.servicePrice)}</strong>
                    <small>
                      Servicio: {money(order.servicePrice)}
                    </small>
                  </td>

                  <td>
                    <span className="status-pill">
                      {statusLabel(order.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}