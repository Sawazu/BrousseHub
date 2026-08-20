import { useMemo, useState } from 'react'
import { Metric } from '../components/Metric'
import { PlusIcon, ResetIcon, TrashIcon } from '../components/icons'
import { SaveBar } from '../components/SaveBar'
import { ToolHeader } from '../components/ToolHeader'
import { useToolSaves } from '../hooks/useToolSaves'
import { formatKamas, formatPercent, toNumber, uid } from '../lib/format'

type ResourceRow = { id: string; name: string; quantityPerCraft: number; owned: number; unitPrice: number }
type CraftState = { itemName: string; craftQuantity: number; salePrice: number; taxRate: number; directBuyPrice: number; resources: ResourceRow[] }

const initialState: CraftState = {
  itemName: 'Anneau exemple', craftQuantity: 1, salePrice: 1_500_000, taxRate: 2, directBuyPrice: 1_250_000,
  resources: [
    { id: 'res-1', name: 'Ressource A', quantityPerCraft: 10, owned: 0, unitPrice: 45_000 },
    { id: 'res-2', name: 'Ressource B', quantityPerCraft: 4, owned: 0, unitPrice: 92_000 },
  ],
}

function cloneInitial(): CraftState { return { ...initialState, resources: initialState.resources.map((row) => ({ ...row, id: uid('res') })) } }

export function CraftResalePage() {
  const [state, setState] = useState<CraftState>(() => cloneInitial())
  const { saves, save, remove } = useToolSaves<CraftState>('achat-craft-revente')

  const totals = useMemo(() => {
    const quantity = Math.max(1, state.craftQuantity)
    const totalCost = state.resources.reduce((sum, row) => {
      const totalRequired = row.quantityPerCraft * quantity
      return sum + Math.max(0, totalRequired - row.owned) * row.unitPrice
    }, 0)
    const costPerItem = totalCost / quantity
    const grossSales = state.salePrice * quantity
    const taxes = grossSales * (Math.max(0, state.taxRate) / 100)
    const netSales = grossSales - taxes
    const profit = netSales - totalCost
    const margin = netSales > 0 ? (profit / netSales) * 100 : 0
    const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0
    const breakEven = costPerItem / Math.max(0.01, 1 - Math.max(0, state.taxRate) / 100)
    const craftVsBuy = state.directBuyPrice > 0 ? state.directBuyPrice - costPerItem : 0
    return { totalCost, costPerItem, taxes, profit, margin, roi, breakEven, craftVsBuy }
  }, [state])

  function updateRow(id: string, key: keyof Omit<ResourceRow, 'id'>, value: string | number) {
    setState((current) => ({ ...current, resources: current.resources.map((row) => row.id === id ? { ...row, [key]: key === 'name' ? value : toNumber(value) } : row) }))
  }

  return (
    <>
      <ToolHeader title="Achat / Craft / Revente" description="Calcule le coût réel d’un craft et vérifie immédiatement si la revente est rentable." actions={<button className="btn btn-secondary" type="button" onClick={() => setState(cloneInitial())}><ResetIcon /> Réinitialiser</button>} />

      <div className="metrics-strip">
        <Metric label="Coût total" value={formatKamas(totals.totalCost)} detail={`${formatKamas(totals.costPerItem)} / item`} />
        <Metric label="Bénéfice net" value={formatKamas(totals.profit)} tone={totals.profit >= 0 ? 'positive' : 'negative'} detail={`Taxes : ${formatKamas(totals.taxes)}`} />
        <Metric label="Marge" value={formatPercent(totals.margin)} tone={totals.margin >= 0 ? 'positive' : 'negative'} detail={`ROI : ${formatPercent(totals.roi)}`} />
        <Metric label="Seuil de vente" value={formatKamas(totals.breakEven)} detail="Prix minimum / item" />
      </div>

      <div className="section-stack">
        <section className="panel">
          <div className="panel-header"><h2>Opération</h2></div>
          <div className="panel-body">
            <div className="form-grid">
              <div className="field"><label htmlFor="craft-item">Item</label><input id="craft-item" className="input" value={state.itemName} onChange={(event) => setState({ ...state, itemName: event.target.value })} /></div>
              <div className="field"><label htmlFor="craft-qty">Quantité à produire</label><input id="craft-qty" className="input" type="number" min="1" value={state.craftQuantity} onChange={(event) => setState({ ...state, craftQuantity: Math.max(1, toNumber(event.target.value)) })} /></div>
              <div className="field"><label htmlFor="craft-sale">Prix de vente / item</label><input id="craft-sale" className="input" type="number" min="0" value={state.salePrice} onChange={(event) => setState({ ...state, salePrice: toNumber(event.target.value) })} /></div>
              <div className="field"><label htmlFor="craft-tax">Taxe de vente (%)</label><input id="craft-tax" className="input" type="number" min="0" step="0.1" value={state.taxRate} onChange={(event) => setState({ ...state, taxRate: toNumber(event.target.value) })} /></div>
            </div>
            <div className="form-grid form-grid-spaced">
              <div className="field"><label htmlFor="direct-buy">Prix d’achat direct / item</label><input id="direct-buy" className="input" type="number" min="0" value={state.directBuyPrice} onChange={(event) => setState({ ...state, directBuyPrice: toNumber(event.target.value) })} /><span className="field-help">{totals.craftVsBuy >= 0 ? `Craft moins cher de ${formatKamas(totals.craftVsBuy)} / item` : `Achat moins cher de ${formatKamas(Math.abs(totals.craftVsBuy))} / item`}</span></div>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div><h2>Ressources</h2><p className="panel-subtitle">Le stock possédé est déduit du besoin total de la série de crafts.</p></div>
            <button className="btn btn-secondary" type="button" onClick={() => setState((current) => ({ ...current, resources: [...current.resources, { id: uid('res'), name: '', quantityPerCraft: 1, owned: 0, unitPrice: 0 }] }))}><PlusIcon /> Ajouter</button>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Ressource</th><th>Qté / craft</th><th>Stock</th><th>Prix unitaire</th><th>Besoin total</th><th>À acheter</th><th>Coût total</th><th aria-label="Actions" /></tr></thead>
              <tbody>
                {state.resources.map((row) => {
                  const totalRequired = row.quantityPerCraft * Math.max(1, state.craftQuantity)
                  const toBuy = Math.max(0, totalRequired - row.owned)
                  return (
                    <tr key={row.id}>
                      <td><input className="table-input" value={row.name} onChange={(event) => updateRow(row.id, 'name', event.target.value)} placeholder="Nom de la ressource" /></td>
                      <td><input className="table-input table-input-number" type="number" min="0" value={row.quantityPerCraft} onChange={(event) => updateRow(row.id, 'quantityPerCraft', event.target.value)} /></td>
                      <td><input className="table-input table-input-number" type="number" min="0" value={row.owned} onChange={(event) => updateRow(row.id, 'owned', event.target.value)} /></td>
                      <td><input className="table-input table-input-number" type="number" min="0" value={row.unitPrice} onChange={(event) => updateRow(row.id, 'unitPrice', event.target.value)} /></td>
                      <td className="table-number">{totalRequired.toLocaleString('fr-FR')}</td><td className="table-number">{toBuy.toLocaleString('fr-FR')}</td><td className="table-number">{formatKamas(toBuy * row.unitPrice)}</td>
                      <td><button className="btn btn-danger btn-icon" type="button" aria-label={`Supprimer ${row.name || 'la ressource'}`} onClick={() => setState((current) => ({ ...current, resources: current.resources.filter((entry) => entry.id !== row.id) }))}><TrashIcon /></button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel"><div className="panel-header"><h2>Sauvegardes</h2><span className="badge">Propres à cet outil</span></div><div className="panel-body"><SaveBar saves={saves} onSave={(name) => save(name, state)} onLoad={setState} onDelete={remove} defaultName={state.itemName} /></div></section>
      </div>
    </>
  )
}
