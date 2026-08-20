import { useMemo, useState } from 'react'
import { Metric } from '../components/Metric'
import { PlusIcon, ResetIcon, TrashIcon } from '../components/icons'
import { SaveBar } from '../components/SaveBar'
import { ToolHeader } from '../components/ToolHeader'
import { useToolSaves } from '../hooks/useToolSaves'
import { formatKamas, toNumber, uid } from '../lib/format'

type RecipePlan = { id: string; name: string; fromLevel: number; toLevel: number; xpPerCraft: number; crafts: number; costPerCraft: number; resalePerCraft: number }
type ProfessionState = { profession: string; currentLevel: number; targetLevel: number; xpTarget: number; recipes: RecipePlan[] }

function freshState(): ProfessionState {
  return { profession: 'Bijoutier', currentLevel: 120, targetLevel: 160, xpTarget: 2_400_000, recipes: [
    { id: uid('recipe'), name: 'Recette A', fromLevel: 120, toLevel: 140, xpPerCraft: 12_500, crafts: 80, costPerCraft: 18_000, resalePerCraft: 9_500 },
    { id: uid('recipe'), name: 'Recette B', fromLevel: 140, toLevel: 160, xpPerCraft: 22_000, crafts: 64, costPerCraft: 31_000, resalePerCraft: 19_000 },
  ] }
}

export function ProfessionLevelingPage() {
  const [state, setState] = useState<ProfessionState>(() => freshState())
  const { saves, save, remove } = useToolSaves<ProfessionState>('up-metier')

  const totals = useMemo(() => {
    const xpPlanned = state.recipes.reduce((sum, row) => sum + row.xpPerCraft * row.crafts, 0)
    const grossCost = state.recipes.reduce((sum, row) => sum + row.costPerCraft * row.crafts, 0)
    const resale = state.recipes.reduce((sum, row) => sum + row.resalePerCraft * row.crafts, 0)
    const netCost = grossCost - resale
    const costPerXp = xpPlanned > 0 ? netCost / xpPlanned : 0
    const progress = state.xpTarget > 0 ? Math.min(100, (xpPlanned / state.xpTarget) * 100) : 0
    return { xpPlanned, grossCost, resale, netCost, costPerXp, progress }
  }, [state])

  function updateRecipe(id: string, patch: Partial<RecipePlan>) { setState((current) => ({ ...current, recipes: current.recipes.map((row) => row.id === id ? { ...row, ...patch } : row) })) }

  return (
    <>
      <ToolHeader title="Up Métier" description="Planifie les crafts nécessaires et compare le coût brut au coût réel après revente." actions={<button className="btn btn-secondary" type="button" onClick={() => setState(freshState())}><ResetIcon /> Réinitialiser</button>} />

      <div className="metrics-strip">
        <Metric label="XP planifiée" value={Math.round(totals.xpPlanned).toLocaleString('fr-FR')} detail={`${Math.round(totals.progress)} % de l’objectif`} />
        <Metric label="Coût brut" value={formatKamas(totals.grossCost)} />
        <Metric label="Revente estimée" value={formatKamas(totals.resale)} tone="positive" />
        <Metric label="Coût net" value={formatKamas(totals.netCost)} tone={totals.netCost <= 0 ? 'positive' : 'default'} detail={`${totals.costPerXp.toFixed(2)} k / XP`} />
      </div>

      <div className="section-stack">
        <section className="panel"><div className="panel-header"><h2>Objectif</h2></div><div className="panel-body"><div className="form-grid">
          <div className="field"><label htmlFor="profession">Métier</label><input id="profession" className="input" value={state.profession} onChange={(event) => setState({ ...state, profession: event.target.value })} /></div>
          <div className="field"><label htmlFor="profession-current">Niveau actuel</label><input id="profession-current" className="input" type="number" min="1" max="200" value={state.currentLevel} onChange={(event) => setState({ ...state, currentLevel: toNumber(event.target.value) })} /></div>
          <div className="field"><label htmlFor="profession-target">Niveau cible</label><input id="profession-target" className="input" type="number" min="1" max="200" value={state.targetLevel} onChange={(event) => setState({ ...state, targetLevel: toNumber(event.target.value) })} /></div>
          <div className="field"><label htmlFor="profession-xp">XP à couvrir</label><input id="profession-xp" className="input" type="number" min="0" value={state.xpTarget} onChange={(event) => setState({ ...state, xpTarget: toNumber(event.target.value) })} /></div>
        </div></div></section>

        <section className="panel">
          <div className="panel-header"><h2>Plan de crafts</h2><button className="btn btn-secondary" type="button" onClick={() => setState((current) => ({ ...current, recipes: [...current.recipes, { id: uid('recipe'), name: '', fromLevel: current.currentLevel, toLevel: current.targetLevel, xpPerCraft: 0, crafts: 1, costPerCraft: 0, resalePerCraft: 0 }] }))}><PlusIcon /> Recette</button></div>
          <div className="table-wrap"><table className="data-table"><thead><tr><th>Recette</th><th>Niv. début</th><th>Niv. fin</th><th>XP / craft</th><th>Crafts</th><th>Coût / craft</th><th>Revente / craft</th><th>Coût net</th><th aria-label="Actions" /></tr></thead><tbody>
            {state.recipes.map((row) => {
              const net = (row.costPerCraft - row.resalePerCraft) * row.crafts
              return <tr key={row.id}><td><input className="table-input" value={row.name} onChange={(event) => updateRecipe(row.id, { name: event.target.value })} placeholder="Recette" /></td><td><input className="table-input table-input-number" type="number" min="1" max="200" value={row.fromLevel} onChange={(event) => updateRecipe(row.id, { fromLevel: toNumber(event.target.value) })} /></td><td><input className="table-input table-input-number" type="number" min="1" max="200" value={row.toLevel} onChange={(event) => updateRecipe(row.id, { toLevel: toNumber(event.target.value) })} /></td><td><input className="table-input table-input-number" type="number" min="0" value={row.xpPerCraft} onChange={(event) => updateRecipe(row.id, { xpPerCraft: toNumber(event.target.value) })} /></td><td><input className="table-input table-input-number" type="number" min="0" value={row.crafts} onChange={(event) => updateRecipe(row.id, { crafts: toNumber(event.target.value) })} /></td><td><input className="table-input table-input-number" type="number" min="0" value={row.costPerCraft} onChange={(event) => updateRecipe(row.id, { costPerCraft: toNumber(event.target.value) })} /></td><td><input className="table-input table-input-number" type="number" min="0" value={row.resalePerCraft} onChange={(event) => updateRecipe(row.id, { resalePerCraft: toNumber(event.target.value) })} /></td><td className="table-number">{formatKamas(net)}</td><td><button className="btn btn-danger btn-icon" type="button" aria-label={`Supprimer ${row.name || 'la recette'}`} onClick={() => setState((current) => ({ ...current, recipes: current.recipes.filter((entry) => entry.id !== row.id) }))}><TrashIcon /></button></td></tr>
            })}
          </tbody></table></div>
        </section>

        <section className="panel"><div className="panel-header"><h2>Sauvegardes</h2><span className="badge">Montées de métier</span></div><div className="panel-body"><SaveBar saves={saves} onSave={(name) => save(name, state)} onLoad={setState} onDelete={remove} defaultName={`${state.profession} ${state.currentLevel}-${state.targetLevel}`} /></div></section>
      </div>
    </>
  )
}
