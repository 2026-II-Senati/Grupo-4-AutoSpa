import { useCallback, useEffect, useState } from 'react';
import { OrderForm } from './OrderForm.jsx';
import { OrdersList } from './OrdersList.jsx';
import { getApiErrorMessage, getOrders, getServices, isUsingMockApi } from './ordersApi.js';

export function OrdersPage() {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState('');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  const refreshOrders = useCallback(async () => {
    setLoadingOrders(true);
    setOrdersError('');
    try { setOrders(await getOrders()); }
    catch (error) { setOrdersError(getApiErrorMessage(error)); }
    finally { setLoadingOrders(false); }
  }, []);

  useEffect(() => {
    let mounted = true;
    getServices().then((items) => { if (mounted) setServices(items); })
      .catch((error) => { if (mounted) setServicesError(getApiErrorMessage(error)); })
      .finally(() => { if (mounted) setLoadingServices(false); });
    refreshOrders();
    return () => { mounted = false; };
  }, [refreshOrders]);

  return <section className="orders-page" aria-labelledby="orders-page-title">
    <div className="orders-page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> GESTIÓN DE ATENCIONES</div><h1 id="orders-page-title">Órdenes <span>activas</span></h1><p>Registra una nueva atención y consulta su estado.</p></div></div>
    {isUsingMockApi() && <p className="prototype-notice"><strong>Modo demostración:</strong> servicios de ejemplo; las órdenes se guardan en este navegador, no en la base de datos.</p>}
    <div className="orders-layout"><OrderForm services={services} loadingServices={loadingServices} servicesError={servicesError} onCreated={refreshOrders} /><OrdersList orders={orders} loading={loadingOrders} error={ordersError} onRetry={refreshOrders} /></div>
  </section>;
}
