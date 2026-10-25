import { useState } from 'react';
import { OrdersPage } from './orders/OrdersPage.jsx';

const menuItems = [
  { id: 'orders', label: 'Órdenes activas', icon: '▤' },
  { id: 'history', label: 'Historial', icon: '◷' },
  { id: 'services', label: 'Servicios y precios', icon: '◇' },
  { id: 'summary', label: 'Resumen operativo', icon: '▥' },
];

function AutoSpaMark() {
  return (
    <span className="brand-mark" aria-hidden="true">A</span>
  );
}

function App() {
  const [activePage, setActivePage] = useState('orders');
  const [connectionStatus, setConnectionStatus] = useState('');
  const [checkingConnection, setCheckingConnection] = useState(false);

  async function checkBackendConnection() {
    setCheckingConnection(true);
    setConnectionStatus('Comprobando conexión…');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/health`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setConnectionStatus('La conexion esta pendiente.');
    } catch {
      setConnectionStatus('No se pudo conectar con el backend. Verifica que esté disponible.');
    } finally {
      setCheckingConnection(false);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegación principal">
        <a className="brand" href="#inicio" aria-label="AutoSpa, inicio">
          <AutoSpaMark />
          <span>Auto<span className="brand-accent">Spa</span></span>
        </a>

        <div className="nav-caption">MENÚ PRINCIPAL</div>
        <nav className="menu-list" aria-label="Secciones de AutoSpa">
          {menuItems.map((item) => (
            <button type="button" className={`menu-item${activePage === item.id ? ' is-active' : ''}`} onClick={() => setActivePage(item.id)} aria-current={activePage === item.id ? 'page' : undefined} key={item.id}>
              <span className="menu-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
              {activePage === item.id && <span className="active-dot" aria-hidden="true" />}
            </button>
          ))}
        </nav>

      </aside>

      <main className="main-content" id="inicio">
        <header className="topbar">
          <span className="breadcrumb">AutoSpa <span aria-hidden="true">/</span> Panel</span>
          <span className="environment"><span className="environment-dot" /> Entorno local</span>
        </header>

        {activePage === 'orders' ? <OrdersPage /> : <section className="welcome-hero" aria-labelledby="page-title">
          <div className="hero-content">
            <div className="eyebrow"><span className="eyebrow-line" /> BIENVENIDO A AUTOSPA</div>
            <h1 id="page-title">Bienvenido a<br /><span>AutoSpa</span></h1>
            <p className="welcome-copy">El cuidado y la gestión de cada vehículo, en un solo lugar.</p>
            <div className="hero-hint">
              <span className="hero-hint-mark" aria-hidden="true">↖</span>
              <span>Selecciona una sección del menú para comenzar</span>
            </div>
            <div className="connection-check">
              <button type="button" onClick={checkBackendConnection} disabled={checkingConnection}>
                {checkingConnection ? 'Comprobando…' : 'Comprobar conexión'}
              </button>
              {connectionStatus && <p role="status" aria-live="polite">{connectionStatus}</p>}
            </div>
          </div>
        </section>}

        <footer className="page-footer">
          <span>Una experiencia de cuidado para cada vehículo.</span>
          <span className="footer-mark">AUTOSPA <span>·</span> GESTIÓN</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
