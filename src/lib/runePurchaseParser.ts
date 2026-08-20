export type ParsedRunePurchase = {
  id: string
  sourceName: string
  lineIndex: number
  raw: string
  rune: string
  quantity: number
  totalPrice: number
}

export type AggregatedRunePurchase = {
  rune: string
  quantity: number
  totalPrice: number
  unitPrice: number
}

const purchasePattern = /([\d][\d\s\u00a0\u202f]*)\s*[xX×]\s*[\[({|]?\s*(Rune\s+[^\]\)}|]+?)\s*[\])}|]?\s*\(\s*([\d][\d\s\u00a0\u202f.,]*)\s*ka(?:m|rn)as?\s*\)/i

function parseInteger(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits ? Number.parseInt(digits, 10) : 0
}

function normalizeRuneName(value: string) {
  return value
    .replace(/\s+/g, ' ')
    .replace(/^[|\s]+|[|\s]+$/g, '')
    .trim()
}

export function parseRunePurchases(text: string, sourceName: string, sourceIndex = 0): ParsedRunePurchase[] {
  const normalizedText = text
    .replace(/[\u00a0\u202f]/g, ' ')
    .replace(/\]\s*\r?\n\s*\(/g, '] (')

  const lines = normalizedText.split(/\r?\n/)
  const purchases: ParsedRunePurchase[] = []

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim()
    if (!line || !/rune/i.test(line)) continue

    let candidate = line
    let match = candidate.match(purchasePattern)

    if (!match && index + 1 < lines.length && /kamas?/i.test(lines[index + 1])) {
      candidate = `${line} ${lines[index + 1].trim()}`
      match = candidate.match(purchasePattern)
    }

    if (!match) continue

    const quantity = parseInteger(match[1])
    const rune = normalizeRuneName(match[2])
    const totalPrice = parseInteger(match[3])

    if (!quantity || !totalPrice || !/^Rune\s+/i.test(rune)) continue

    purchases.push({
      id: `ocr-${sourceIndex}-${index}-${quantity}-${totalPrice}`,
      sourceName,
      lineIndex: index,
      raw: candidate,
      rune,
      quantity,
      totalPrice,
    })
  }

  return purchases
}

export function aggregateRunePurchases(purchases: ParsedRunePurchase[]): AggregatedRunePurchase[] {
  const grouped = new Map<string, { rune: string; quantity: number; totalPrice: number }>()

  for (const purchase of purchases) {
    const key = purchase.rune.toLocaleLowerCase('fr-FR')
    const existing = grouped.get(key)

    if (existing) {
      existing.quantity += purchase.quantity
      existing.totalPrice += purchase.totalPrice
    } else {
      grouped.set(key, {
        rune: purchase.rune,
        quantity: purchase.quantity,
        totalPrice: purchase.totalPrice,
      })
    }
  }

  return [...grouped.values()].map((group) => ({
    ...group,
    unitPrice: group.quantity ? group.totalPrice / group.quantity : 0,
  }))
}
