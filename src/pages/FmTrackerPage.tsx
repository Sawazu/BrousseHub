import { useMemo, useState } from 'react'
import { Metric } from '../components/Metric'
import { PlusIcon, ResetIcon, TrashIcon, UndoIcon } from '../components/icons'
import { SaveBar } from '../components/SaveBar'
import { ToolHeader } from '../components/ToolHeader'
import { useToolSaves } from '../hooks/useToolSaves'
import { formatKamas, toNumber, uid } from '../lib/format'

type RuneUse = { id: string; rune: string; quantity: number; unitPrice: number; attempt: number }
export type FmTrackerState = { itemName: string; baseCost: number; mode: 'Classique' | 'Over' | 'Exo'; status: 'En cours' | 'Réussi' | 'Abandonné' | 'Conservé'; currentAttempt: number; runes: RuneUse[] }

const quickRunes = ['Pa Vi', 'Ra Vi', 'Pa Ine', 'Ra Ine', 'Pa Sa', 'Ra Sa', 'Ga Pa', 'Ga Pme']

function freshState(): FmTrackerState {
  return { itemName: 'Item à FM', baseCost: 900_000, mode: 'Exo', status: 'En cours', currentAttempt: 1, runes: [
    { id: uid('rune'), rune: 'Ra Vi', quantity: 8, unitPrice: 4_500, attempt: 1 },
    { id: uid('rune'), rune: 'Ra Ine', quantity: 3, unitPrice: 12_000, attempt: 1 },
  ] }
}

export function FmTrackerPage() {
  const [state, setState] = useState<FmTrackerState>(() => freshState())
  const { saves, save, remove } = useToolSaves<FmTrackerState>('tracker-fm')

  const totals = useMemo(() => {
    const runeCost = state.runes.reduce((sum, row) => sum + row.quantity * row.unitPrice, 0)
    const runeCount = state.runes.reduce((sum, row) => sum + row.quantity, 0)
    const attemptCount = Math.max(state.currentAttempt, ...state.runes.map((row) => row.attempt), 1)
    return { runeCost, runeCount, attemptCount, totalCost: state.baseCost + runeCost, averageAttempt: runeCost / attemptCount }
  }, [state])

  function addRune(rune = '') { setState((current) => ({ ...current, runes: [...current.runes, { id: uid('rune'), rune, quantity: 1, unitPrice: 0, attempt: current.currentAttempt }] })) }
  function updateRune(id: string, key: keyof Omit<RuneUse, 'id'>, value: string | number) { setState((current) => ({ ...current, runes: current.runes.map((row) => row.id === id ? { ...row, [key]: key === 'rune' ? value : toNumber(value) } : row) })) }

  return (
    <>
      <ToolHeader title="Tracker FM" description="Enregistre les runes au fil de la FM et garde le coût réel de la session visible en permanence." actions={<><button className="btn btn-secondary" type="button" disabled={!state.runes.length} onClick={() => setState((current) => ({ ...current, runes: current.runes.slice(0, -1) }))}><UndoIcon /> Annuler dernière rune</button><button className="btn btn-secondary" type="button" onClick={() => setState((current) => ({ ...current, currentAttempt: current.currentAttempt + 1 }))}>Tentative suivante</button><button className="btn btn-secondary" type="button" onClick={() => setState(freshState())}><ResetIcon /> Réinitialiser</button></>} />

      <div className="metrics-strip">
        <Metric label="Coût des runes" value={formatKamas(totals.runeCost)} detail={`${totals.runeCount} runes`} />
        <Metric label="Tentatives" value={String(totals.attemptCount)} detail={`Tentative active : ${state.currentAttempt}`} />
        <Metric label="Coût moyen / tentative" value={formatKamas(totals.averageAttempt)} />
        <Metric label="Coût total de l’objet" value={formatKamas(totals.totalCost)} detail={`Base : ${formatKamas(state.baseCost)}`} />
      </div>

      <div className="section-stack">
        <section className="panel">
          <div className="panel-header"><h2>Session</h2><span className={`badge ${state.status === 'Réussi' ? 'badge-positive' : state.status === 'En cours' ? 'badge-info' : 'badge-warning'}`}>{state.status}</span></div>
          <div className="panel-body"><div className="form-grid">
            <div className="field"><label htmlFor="fm-item">Item</label><input id="fm-item" className="input" value={state.itemName} onChange={(event) => setState({ ...state, itemName: event.target.value })} /></div>
            <div className="field"><label htmlFor="fm-base">Prix / coût de base</label><input id="fm-base" className="input" type="number" min="0" value={state.baseCost} onChange={(event) => setState({ ...state, baseCost: toNumber(event.target.value) })} /></div>
            <div className="field"><label htmlFor="fm-mode">Type de FM</label><select id="fm-mode" className="select" value={state.mode} onChange={(event) => setState({ ...state, mode: event.target.value as FmTrackerState['mode'] })}><option>Classique</option><option>Over</option><option>Exo</option></select></div>
            <div className="field"><label htmlFor="fm-status">Statut</label><select id="fm-status" className="select" value={state.status} onChange={(event) => setState({ ...state, status: event.target.value as FmTrackerState['status'] })}><option>En cours</option><option>Réussi</option><option>Abandonné</option><option>Conservé</option></select></div>
          </div></div>
        </section>

        <section className="panel">
          <div className="panel-header"><h2>Runes utilisées</h2><button className="btn btn-secondary" type="button" onClick={() => addRune()}><PlusIcon /> Rune</button></div>
          <div className="panel-body panel-body-compact-bottom"><div className="save-bar" aria-label="Ajout rapide de rune">{quickRunes.map((rune) => <button key={rune} className="btn btn-secondary" type="button" onClick={() => addRune(rune)}>{rune}</button>)}</div></div>
          <div className="table-wrap"><table className="data-table"><thead><tr><th>Rune</th><th>Tentative</th><th>Quantité</th><th>Prix unitaire</th><th>Coût</th><th aria-label="Actions" /></tr></thead><tbody>
            {state.runes.map((row) => <tr key={row.id}><td><input className="table-input" value={row.rune} onChange={(event) => updateRune(row.id, 'rune', event.target.value)} placeholder="Rune" /></td><td><input className="table-input table-input-number" type="number" min="1" value={row.attempt} onChange={(event) => updateRune(row.id, 'attempt', event.target.value)} /></td><td><input className="table-input table-input-number" type="number" min="0" value={row.quantity} onChange={(event) => updateRune(row.id, 'quantity', event.target.value)} /></td><td><input className="table-input table-input-number" type="number" min="0" value={row.unitPrice} onChange={(event) => updateRune(row.id, 'unitPrice', event.target.value)} /></td><td className="table-number">{formatKamas(row.quantity * row.unitPrice)}</td><td><button className="btn btn-danger btn-icon" type="button" aria-label={`Supprimer ${row.rune || 'la rune'}`} onClick={() => setState((current) => ({ ...current, runes: current.runes.filter((entry) => entry.id !== row.id) }))}><TrashIcon /></button></td></tr>)}
          </tbody></table></div>
        </section>

        <section className="panel"><div className="panel-header"><h2>Sauvegardes</h2><span className="badge">Sessions FM</span></div><div className="panel-body"><SaveBar saves={saves} onSave={(name) => save(name, state)} onLoad={setState} onDelete={remove} defaultName={state.itemName} /></div></section>
      </div>
    </>
  )
}
