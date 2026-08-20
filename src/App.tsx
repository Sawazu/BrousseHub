import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { CraftResalePage } from './pages/CraftResalePage'
import { FmMarginPage } from './pages/FmMarginPage'
import { FmTrackerPage } from './pages/FmTrackerPage'
import { HomePage } from './pages/HomePage'
import { ProfessionLevelingPage } from './pages/ProfessionLevelingPage'
import { StuffCalculatorPage } from './pages/StuffCalculatorPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="achat-craft-revente" element={<CraftResalePage />} />
        <Route path="tracker-fm" element={<FmTrackerPage />} />
        <Route path="marge-fm" element={<FmMarginPage />} />
        <Route path="calcul-stuff" element={<StuffCalculatorPage />} />
        <Route path="up-metier" element={<ProfessionLevelingPage />} />
      </Route>
    </Routes>
  )
}
