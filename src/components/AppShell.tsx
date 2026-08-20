import { NavLink, Outlet } from 'react-router-dom'
import { CraftIcon, HomeIcon, MarginIcon, MoonIcon, ProfessionIcon, StuffIcon, SunIcon, SyncIcon, TrackerIcon } from './icons'
import { useTheme } from '../hooks/useTheme'

const links = [
  { to: '/', label: 'Accueil', icon: HomeIcon, end: true },
  { to: '/achat-craft-revente', label: 'Achat / Craft / Revente', icon: CraftIcon },
  { to: '/tracker-fm', label: 'Tracker FM', icon: TrackerIcon },
  { to: '/marge-fm', label: 'Marge FM', icon: MarginIcon },
  { to: '/calcul-stuff', label: 'Calcul Stuff', icon: StuffIcon },
  { to: '/up-metier', label: 'Up Métier', icon: ProfessionIcon },
]

export function AppShell() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/" className="brand" aria-label="Broussehub — Accueil">
          <span className="brand-mark">BH</span>
          <span className="brand-copy">
            <span className="brand-name">Broussehub</span>
            <span className="brand-tagline">Le Hub de La Brousse</span>
          </span>
        </NavLink>

        <span className="nav-section-label">Outils</span>
        <nav className="sidebar-nav" aria-label="Outils Broussehub">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <span className="nav-icon"><Icon /></span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="account-block">
            <span className="account-avatar">LB</span>
            <div className="account-copy">
              <span className="account-title">La Brousse</span>
              <span className="account-subtitle">Synchronisation à connecter</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="app-main">
        <div className="topbar">
          <span className="badge local-save-badge"><SyncIcon /> Sauvegarde locale V1</span>
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}>
            <span className="theme-toggle-icon">{isDark ? <SunIcon /> : <MoonIcon />}</span>
            <span>{isDark ? 'Mode clair' : 'Mode sombre'}</span>
          </button>
          <button className="btn btn-secondary" type="button" disabled>Connexion</button>
        </div>
        <div className="content"><Outlet /></div>
      </main>
    </div>
  )
}
