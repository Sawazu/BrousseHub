import { NavLink, Outlet } from 'react-router-dom'
import { CraftIcon, HomeIcon, MarginIcon, ProfessionIcon, StuffIcon, SyncIcon, TrackerIcon } from './icons'

const links = [
  { to: '/', label: 'Accueil', icon: HomeIcon, end: true },
  { to: '/achat-craft-revente', label: 'Achat / Craft / Revente', icon: CraftIcon },
  { to: '/tracker-fm', label: 'Tracker FM', icon: TrackerIcon },
  { to: '/marge-fm', label: 'Marge FM', icon: MarginIcon },
  { to: '/calcul-stuff', label: 'Calcul Stuff', icon: StuffIcon },
  { to: '/up-metier', label: 'Up Métier', icon: ProfessionIcon },
]

export function AppShell() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/" className="brand" aria-label="Broussehub — Accueil">
          <span className="brand-mark">BH</span>
          <span className="brand-name">Broussehub</span>
        </NavLink>

        <nav className="sidebar-nav" aria-label="Outils Broussehub">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="account-block">
            <span className="account-avatar">BH</span>
            <div className="account-copy">
              <span className="account-title">Compte Broussehub</span>
              <span className="account-subtitle">Synchronisation à connecter</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="app-main">
        <div className="topbar">
          <span className="badge"><SyncIcon /> Sauvegarde locale V1</span>
          <button className="btn btn-secondary" type="button" disabled>Connexion</button>
        </div>
        <div className="content"><Outlet /></div>
      </main>
    </div>
  )
}
