import { Link } from 'react-router-dom'
import { ArrowIcon, CraftIcon, MarginIcon, ProfessionIcon, StuffIcon, TrackerIcon } from '../components/icons'

const tools = [
  { to: '/achat-craft-revente', title: 'Achat / Craft / Revente', description: 'Calculer le coût total d’un craft, le bénéfice, la marge, le ROI et le prix de vente minimum.', icon: CraftIcon },
  { to: '/tracker-fm', title: 'Tracker FM', description: 'Suivre précisément les runes utilisées, les tentatives et le coût cumulé d’une session de forgemagie.', icon: TrackerIcon },
  { to: '/marge-fm', title: 'Marge FM', description: 'Mesurer la rentabilité complète d’un objet, de son acquisition jusqu’à sa revente après FM, over ou exo.', icon: MarginIcon },
  { to: '/calcul-stuff', title: 'Calcul Stuff', description: 'Comparer achat direct et craft pour chaque équipement et obtenir automatiquement la combinaison la moins chère.', icon: StuffIcon },
  { to: '/up-metier', title: 'Up Métier', description: 'Planifier une montée de métier avec XP, crafts nécessaires, coût brut, revente et coût net.', icon: ProfessionIcon },
]

export function HomePage() {
  return (
    <>
      <section className="home-hero">
        <h1>Bienvenue dans le Hub de La Brousse</h1>
        <p>Cinq outils pour calculer plus vite, comparer les options et suivre tes coûts sans transformer le jeu en tableur.</p>
      </section>

      <div className="tool-list" aria-label="Outils disponibles">
        {tools.map(({ to, title, description, icon: Icon }) => (
          <Link className="tool-row" to={to} key={to}>
            <div className="tool-row-title"><span className="tool-row-icon"><Icon /></span><span>{title}</span></div>
            <p className="tool-row-description">{description}</p>
            <span className="tool-row-arrow"><ArrowIcon /></span>
          </Link>
        ))}
      </div>
    </>
  )
}
