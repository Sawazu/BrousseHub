import { useMemo, useState } from 'react'
import { Metric } from '../components/Metric'
import { LoadIcon, ResetIcon } from '../components/icons'
import { SaveBar } from '../components/SaveBar'
import { ToolHeader } from '../components/ToolHeader'
import { readToolSaves, useToolSaves } from '../hooks/useToolSaves'
import { formatKamas, formatPercent, toNumber } from '../lib/format'
import type { FmTrackerState } from './FmTrackerPage'

type MarginState = { itemName: string; acquisitionMode: 'Achat' | 'Craft'; acquisitionCost: number; fmCost: number; salePrice: number; taxRate: number; fmType: 'Classique' | 'Over' | 'Exo'; status: 'Simulation' | 'En FM' | 'En vente' | 'Vendu' }

const initialState: MarginState = { itemName: 'Item FM', acquisitionMode: 'Achat', acquisitionCost: 900_000, fmCost: 280_000, salePrice: 1_650_000, taxRate: 2, fmType: 'Exo', status: 'Simulation' }

export function FmMarginPage() {
  const [state, setState] = useState<MarginState>(initialState)
  const { saves, save, remove } = useToolSaves<MarginState>('marge-fm')
  const trackerSaves = useMemo(() => readToolSaves<FmTrackerState>('tracker-fm'), [])

  const totals = useMemo(() => {
    const totalCost = state.acquisitionCost + state.fmCost
    const taxes = state.salePrice * (state.taxRate / 100)
    const netSale = state.salePrice - taxes
    const profit = netSale - totalCost
    const margin = netSale > 0 ? (profit / netSale) * 100 : 0
    const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0
    const breakEven = totalCost / Math.max(0.01, 1 - state.taxRate / 100)
    return { totalCost, taxes, netSale, profit, margin, roi, breakEven }
  }, [state])

  function importTracker(saveId: string) {
    const tracker = trackerSaves.find((entry) => entry.id === saveId)
    if (!tracker) return
    const runeCost = tracker.state.runes.reduce((sum, row) => sum + row.quantity * row.unitPrice, 0)
    setState((current) => ({ ...current, itemName: tracker.state.itemName, acquisitionCost: tracker.state.baseCost, fmCost: runeCost, fmType: tracker.state.mode }))
  }

  return (
    <>
      <ToolHeader title="Marge FM" description="Mesure la rentabilité complète d’un item après acquisition, FM, over ou exo et revente." actions={<button className="btn btn-secondary" type="button" onClick={() => setState(initialState)}><ResetIcon /> Réinitialiser</button>} />

      <div className="metrics-strip">
        <Metric label="Coût de revient" value={formatKamas(totals.totalCost)} detail={`FM : ${formatKamas(state.fmCost)}`} />
        <Metric label="Bénéfice net" value={formatKamas(totals.profit)} tone={totals.profit >= 0 ? 'positive' : 'negative'} detail={`Après ${formatKamas(totals.taxes)} de taxe`} />
        <Metric label="Marge" value={formatPercent(totals.margin)} tone={totals.margin >= 0 ? 'positive' : 'negative'} detail={`ROI : ${formatPercent(totals.roi)}`} />
        <Metric label="Vente minimum" value={formatKamas(totals.breakEven)} detail="Pour atteindre l’équilibre" />
      </div>

      <div className="section-stack">
        {trackerSaves.length ? <section className="panel"><div className="panel-header"><h2>Importer depuis Tracker FM</h2><span className="badge badge-info"><LoadIcon /> {trackerSaves.length} session(s)</span></div><div className="panel-body"><div className="field field-narrow"><label htmlFor="tracker-import">Session sauvegardée</label><select id="tracker-import" className="select" defaultValue="" onChange={(event) => importTracker(event.target.value)}><option value="" disabled>Choisir une session…</option>{trackerSaves.map((save) => <option key={save.id} value={save.id}>{save.name}</option>)}</select></div></div></section> : null}

        <section className="panel">
          <div className="panel-header"><h2>Rentabilité</h2><span className={`badge ${state.status === 'Vendu' ? 'badge-positive' : 'badge-info'}`}>{state.status}</span></div>
          <div className="panel-body">
            <div className="form-grid">
              <div className="field"><label htmlFor="margin-item">Item</label><input id="margin-item" className="input" value={state.itemName} onChange={(event) => setState({ ...state, itemName: event.target.value })} /></div>
              <div className="field"><label htmlFor="margin-mode">Acquisition</label><select id="margin-mode" className="select" value={state.acquisitionMode} onChange={(event) => setState({ ...state, acquisitionMode: event.target.value as MarginState['acquisitionMode'] })}><option>Achat</option><option>Craft</option></select></div>
              <div className="field"><label htmlFor="margin-type">Type de FM</label><select id="margin-type" className="select" value={state.fmType} onChange={(event) => setState({ ...state, fmType: event.target.value as MarginState['fmType'] })}><option>Classique</option><option>Over</option><option>Exo</option></select></div>
              <div className="field"><label htmlFor="margin-status">Statut</label><select id="margin-status" className="select" value={state.status} onChange={(event) => setState({ ...state, status: event.target.value as MarginState['status'] })}><option>Simulation</option><option>En FM</option><option>En vente</option><option>Vendu</option></select></div>
            </div>
            <div className="form-grid form-grid-spaced">
              <div className="field"><label htmlFor="margin-acquisition">Coût acquisition</label><input id="margin-acquisition" className="input" type="number" min="0" value={state.acquisitionCost} onChange={(event) => setState({ ...state, acquisitionCost: toNumber(event.target.value) })} /></div>
              <div className="field"><label htmlFor="margin-fm">Coût FM</label><input id="margin-fm" className="input" type="number" min="0" value={state.fmCost} onChange={(event) => setState({ ...state, fmCost: toNumber(event.target.value) })} /></div>
              <div className="field"><label htmlFor="margin-sale">Prix de vente</label><input id="margin-sale" className="input" type="number" min="0" value={state.salePrice} onChange={(event) => setState({ ...state, salePrice: toNumber(event.target.value) })} /></div>
              <div className="field"><label htmlFor="margin-tax">Taxe (%)</label><input id="margin-tax" className="input" type="number" min="0" step="0.1" value={state.taxRate} onChange={(event) => setState({ ...state, taxRate: toNumber(event.target.value) })} /></div>
            </div>
          </div>
        </section>

        <section className="panel"><div className="panel-header"><h2>Détail</h2></div><div className="panel-body"><div className="summary-list"><div className="summary-row"><span className="summary-label">Vente brute</span><span className="summary-value">{formatKamas(state.salePrice)}</span></div><div className="summary-row"><span className="summary-label">Vente après taxe</span><span className="summary-value">{formatKamas(totals.netSale)}</span></div><div className="summary-row"><span className="summary-label">Acquisition + FM</span><span className="summary-value">{formatKamas(totals.totalCost)}</span></div><div className="summary-row"><span className="summary-label">Résultat</span><span className="summary-value">{formatKamas(totals.profit)}</span></div></div></div></section>

        <section className="panel"><div className="panel-header"><h2>Sauvegardes</h2><span className="badge">Simulations & ventes</span></div><div className="panel-body"><SaveBar saves={saves} onSave={(name) => save(name, state)} onLoad={setState} onDelete={remove} defaultName={state.itemName} /></div></section>
      </div>
    </>
  )
}
