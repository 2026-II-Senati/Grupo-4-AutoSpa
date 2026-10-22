const menuItems = [
  { id: 'orders', label: 'Órdenes activas', icon: '▤' },
  { id: 'history', label: 'Historial', icon: '◷' },
  { id: 'services', label: 'Servicios y precios', icon: '◇' },
  { id: 'summary', label: 'Resumen operativo', icon: '▥' },
];

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegación principal">
        <a className="brand" href="#inicio" aria-label="AutoSpa, inicio">
          <span className="brand-mark" aria-hidden="true">A</span>
          <span>Auto<span className="brand-accent">Spa</span></span>
        </a>

        <div className="nav-caption">MENÚ PRINCIPAL</div>
        <nav className="menu-list" aria-label="Secciones de AutoSpa">
          {menuItems.map((item, index) => (
            <a
              className={`menu-item${index === 0 ? ' is-active' : ''}`}
              href={`#${item.id}`}
              aria-current={index === 0 ? 'page' : undefined}
              key={item.id}
            >
              <span className="menu-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
              {index === 0 && <span className="active-dot" aria-hidden="true" />}
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="status-light" aria-hidden="true" />
          <span>Conexión pendiente</span>
        </div>
      </aside>

      <main className="main-content" id="inicio">
        <header className="topbar">
          <span className="breadcrumb">AutoSpa <span aria-hidden="true">/</span> Panel</span>
          <span className="environment"><span className="environment-dot" /> Entorno local</span>
        </header>

        <section className="welcome" aria-labelledby="page-title">
          <div className="eyebrow"><span className="eyebrow-line" /> PANEL DE GESTIÓN</div>
          <h1 id="page-title">Bienvenido a <span>AutoSpa</span></h1>
          <p className="welcome-copy">Todo lo que necesitas para mantener cada servicio en marcha.</p>

          <div className="connection-card">
            <div className="connection-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none"><path d="M4 9.5a12 12 0 0 1 16 0M7.5 13a7 7 0 0 1 9 0M10.5 16.5a2.5 2.5 0 0 1 3 0M12 20h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </div>
            <div className="connection-copy">
              <strong>Conecta con tu espacio de trabajo</strong>
              <span>La conexión con el servidor estará disponible próximamente.</span>
            </div>
            <button className="connect-button" type="button" disabled>
              <span className="button-indicator" aria-hidden="true" />
              Comprobar conexión
            </button>
          </div>
        </section>

        <section className="sections" aria-labelledby="sections-title">
          <div className="section-heading">
            <div>
              <div className="eyebrow">ACCESO RÁPIDO</div>
              <h2 id="sections-title">Tu operación, de un vistazo</h2>
            </div>
            <span className="section-count">04 SECCIONES</span>
          </div>

          <div className="section-grid">
            {menuItems.map((item, index) => (
              <a className="section-card" href={`#${item.id}`} key={item.id}>
                <div className={`card-icon card-icon-${index + 1}`} aria-hidden="true">{item.icon}</div>
                <div className="card-number">0{index + 1}</div>
                <h3>{item.label}</h3>
                <span className="card-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>

        <footer className="page-footer">
          <span>Una experiencia de cuidado para cada vehículo.</span>
          <span className="footer-mark">AUTOSPA <span>·</span> GESTIÓN</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
