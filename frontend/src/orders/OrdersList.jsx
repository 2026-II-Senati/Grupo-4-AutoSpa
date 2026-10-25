const statusLabels = { waiting: 'En espera', 'in progress': 'En lavado', ready: 'Listo para entregar', delivered: 'Entregado' };
const statusLabel = (status) => statusLabels[String(status || '').toLowerCase()] || status || 'En espera';

export function OrdersList({ orders, loading, error, onRetry }) {
  return (
    <section className="orders-list-card" aria-labelledby="orders-list-title">
      <div className="card-heading list-heading"><div><span className="section-kicker">SEGUIMIENTO</span><h2 id="orders-list-title">Órdenes activas</h2></div><span className="orders-count">{orders.length} {orders.length === 1 ? 'orden' : 'órdenes'}</span></div>
      {loading ? <div className="list-state" role="status"><span className="spinner" /> Cargando órdenes…</div>
        : error ? <div className="list-state error-state" role="alert"><span>{error}</span><button type="button" className="text-button" onClick={onRetry}>Volver a intentar</button></div>
          : orders.length === 0 ? <div className="list-state empty-state"><span className="empty-icon" aria-hidden="true">▤</span><strong>Aún no hay órdenes activas</strong><span>Las órdenes registradas aparecerán aquí.</span></div>
            : <div className="table-wrap"><table><thead><tr><th>Cliente</th><th>Placa</th><th>Servicio</th><th>Estado</th></tr></thead><tbody>
              {orders.map((order) => <tr key={order.id}><td><strong>{order.customerName || order.customer?.name || '—'}</strong><small>{order.phone || order.customer?.phone || ''}</small></td><td className="plate-cell">{order.licensePlate || order.plate || '—'}</td><td>{order.serviceName || order.service?.name || '—'}</td><td><span className="status-pill">{statusLabel(order.status)}</span></td></tr>)}
            </tbody></table></div>}
    </section>
  );
}
