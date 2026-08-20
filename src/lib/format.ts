export const kama = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 })
export const percent = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 })

export function formatKamas(value: number) {
  const safeValue = Number.isFinite(value) ? value : 0
  return `${kama.format(Math.round(safeValue))} k`
}

export function formatPercent(value: number) {
  const safeValue = Number.isFinite(value) ? value : 0
  return `${percent.format(safeValue)} %`
}

export function toNumber(value: string | number) {
  const parsed = typeof value === 'number' ? value : Number(value.replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : 0
}

export function uid(prefix = 'row') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
