// Muestra cuántas órdenes activas hay, usando el listado que OrdersPage ya cargó.
// No llama al backend: GET /api/orders ya devuelve solo órdenes activas.
export function ActiveOrdersCounter({ orders, loading, error }) {
  let total = orders.length;
  if (loading) total = '…';
  else if (error) total = '—';

  return (
    <p className="active-orders-counter" role="status" aria-live="polite">
      Órdenes activas: <strong>{total}</strong>
    </p>
  );
}
