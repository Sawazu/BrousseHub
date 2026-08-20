import { useMemo, useState } from 'react'
import { Metric } from '../components/Metric'
import { PlusIcon, ResetIcon, TrashIcon } from '../components/icons'
import { SaveBar } from '../components/SaveBar'
import { ToolHeader } from '../components/ToolHeader'
import { useToolSaves } from '../hooks/useToolSaves'
import { formatKamas, toNumber, uid } from '../lib/format'

type StuffItem = { id: string; name: string; directPrice: number; craftCost: number; choice: 'Auto' | 'Acheter' | 'Crafter'; owned: boolean }
type StuffState = { stuffName: string; items: StuffItem[] }

function freshState(): StuffState {
  return { stuffName: 'Stuff feu', items: [
    { id: uid('stuff'), name: 'Coiffe exemple', directPrice: 2_100_000, craftCost: 1_780_000, choice: 'Auto', owned: false },
    { id: uid('stuff'), name: 'Cape exemple', directPrice: 1_350_000, craftCost: 1_520_000, choice: 'Auto', owned: false },
    { id: uid('stuff'), name: 'Anneau exemple', directPrice: 980_000, craftCost: 760_000, choice: 'Auto', owned: true },
  ] }
}

function automaticChoice(item: StuffItem) {
  const hasDirectPrice = item.directPrice > 0
  const hasCraftCost = item.craftCost > 0
  if (!hasDirectPrice && !hasCraftCost) return 'À renseigner'
  if (!hasCraftCost || (hasDirectPrice && item.directPrice <= item.craftCost)) return 'Acheter'
  return 'Crafter'
}

function selectedCost(item: StuffItem) {
  if (item.owned) return 0
  if (item.choice === 'Acheter') return item.directPrice
  if (item.choice === 'Crafter') return item.craftCost
  const autoChoice = automaticChoice(item)
  if (autoChoice === 'Acheter') return item.directPrice
  if (autoChoice === 'Crafter') return item.craftCost
  return 0
}

export function StuffCalculatorPage() {
  const [state, setState] = useState<StuffState>(() => freshState())
  const { saves, save, remove } = useToolSaves<StuffState>('calcul-stuff')

  const totals = useMemo(() => {
    const directTotal = state.items.reduce((sum, item) => sum + (item.owned ? 0 : item.directPrice), 0)
    const craftTotal = state.items.reduce((sum, item) => sum + (item.owned ? 0 : item.craftCost), 0)
    const optimizedTotal = state.items.reduce((sum, item) => sum + selectedCost(item), 0)
    const savings = directTotal - optimizedTotal
    const owned = state.items.filter((item) => item.owned).length
    const progress = state.items.length ? (owned / state.items.length) * 100 : 0
    return { directTotal, craftTotal, optimizedTotal, savings, owned, progress }
  }, [state])

  function updateItem(id: string, patch: Partial<StuffItem>) { setState((current) => ({ ...current, items: current.items.map((item) => item.id === id ? { ...item, ...patch } : item) })) }

  return (
    <>
      <ToolHeader title="Calcul Stuff" description="Compare achat direct et craft pour chaque item puis garde automatiquement l’option la moins chère." actions={<button className="btn btn-secondary" type="button" onClick={() => setState(freshState())}><ResetIcon /> Réinitialiser</button>} />

      <div className="metrics-strip">
        <Metric label="Achat direct" value={formatKamas(totals.directTotal)} />
        <Metric label="Tout crafter" value={formatKamas(totals.craftTotal)} />
        <Metric label="Plan retenu" value={formatKamas(totals.optimizedTotal)} tone="positive" detail={`Économie vs tout acheter : ${formatKamas(totals.savings)}`} />
        <Metric label="Progression" value={`${Math.round(totals.progress)} %`} detail={`${totals.owned}/${state.items.length} items obtenus`} />
      </div>

      <div className="section-stack">
        <section className="panel"><div className="panel-header"><h2>Stuff</h2></div><div className="panel-body"><div className="field field-narrow"><label htmlFor="stuff-name">Nom de la configuration</label><input id="stuff-name" className="input" value={state.stuffName} onChange={(event) => setState({ ...state, stuffName: event.target.value })} /></div></div></section>

        <section className="panel">
          <div className="panel-header"><h2>Équipements</h2><button className="btn btn-secondary" type="button" onClick={() => setState((current) => ({ ...current, items: [...current.items, { id: uid('stuff'), name: '', directPrice: 0, craftCost: 0, choice: 'Auto', owned: false }] }))}><PlusIcon /> Item</button></div>
          <div className="table-wrap"><table className="data-table"><thead><tr><th>Item</th><th>Achat direct</th><th>Coût craft</th><th>Choix</th><th>Retenu</th><th>Obtenu</th><th aria-label="Actions" /></tr></thead><tbody>
            {state.items.map((item) => {
              const autoChoice = automaticChoice(item)
              const retained = item.owned ? 'Déjà obtenu' : item.choice === 'Auto' ? autoChoice : item.choice
              return <tr key={item.id}><td><input className="table-input" value={item.name} onChange={(event) => updateItem(item.id, { name: event.target.value })} placeholder="Nom de l’item" /></td><td><input className="table-input table-input-number" type="number" min="0" value={item.directPrice} onChange={(event) => updateItem(item.id, { directPrice: toNumber(event.target.value) })} /></td><td><input className="table-input table-input-number" type="number" min="0" value={item.craftCost} onChange={(event) => updateItem(item.id, { craftCost: toNumber(event.target.value) })} /></td><td><select className="select" value={item.choice} onChange={(event) => updateItem(item.id, { choice: event.target.value as StuffItem['choice'] })}><option>Auto</option><option>Acheter</option><option>Crafter</option></select></td><td><span className={`badge ${retained === 'Déjà obtenu' ? 'badge-positive' : retained === 'Crafter' ? 'badge-info' : ''}`}>{retained}</span></td><td><input type="checkbox" checked={item.owned} onChange={(event) => updateItem(item.id, { owned: event.target.checked })} aria-label={`${item.name || 'Item'} obtenu`} /></td><td><button className="btn btn-danger btn-icon" type="button" aria-label={`Supprimer ${item.name || 'l’item'}`} onClick={() => setState((current) => ({ ...current, items: current.items.filter((entry) => entry.id !== item.id) }))}><TrashIcon /></button></td></tr>
            })}
          </tbody></table></div>
        </section>

        <section className="panel"><div className="panel-header"><h2>Sauvegardes</h2><span className="badge">Stuffs nommés</span></div><div className="panel-body"><SaveBar saves={saves} onSave={(name) => save(name || state.stuffName, state)} onLoad={setState} onDelete={remove} defaultName={state.stuffName} /></div></section>
      </div>
    </>
  )
}
