import { NavLink, Outlet } from 'react-router-dom'

/**
 * Top navigation and page shell (responsive for tablet widths).
 */
export default function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">Multi-Catalog Bill Generator</div>
        <nav className="nav">
          <NavLink to="/cart">Cart / new bill</NavLink>
          <NavLink to="/" end>
            Bills
          </NavLink>
          <NavLink to="/catalogs">Catalogs</NavLink>
          <NavLink to="/summary">Daily summary</NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
