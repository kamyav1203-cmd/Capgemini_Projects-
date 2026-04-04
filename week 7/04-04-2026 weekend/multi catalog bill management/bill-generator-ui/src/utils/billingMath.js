/**
 * Client-side totals (must match server `BillingMath` in the API).
 * Order: line totals → subtotal → discount → tax on (subtotal − discount) → grand total.
 */

function round2(n) {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100
}

export function lineTotal(quantity, unitPrice) {
  return round2(Number(quantity) * Number(unitPrice))
}

export function subtotal(lines) {
  return round2(lines.reduce((s, l) => s + Number(l.lineTotal ?? 0), 0))
}

export function discountAmount(sub, discountType, discountValue) {
  if (discountType === 0 || sub <= 0) return 0
  if (discountType === 1) {
    const pct = Math.min(100, Math.max(0, Number(discountValue)))
    return round2(sub * (pct / 100))
  }
  return round2(Math.min(Number(discountValue), sub))
}

export function taxableBase(sub, discountAmt) {
  return round2(Math.max(0, sub - discountAmt))
}

export function taxAmount(taxable, taxRatePercent) {
  if (taxable <= 0 || !taxRatePercent) return 0
  return round2(taxable * (Number(taxRatePercent) / 100))
}

export function grandTotal(taxable, taxAmt) {
  return round2(taxable + taxAmt)
}

/** @param {object} bill — detail DTO with lines, discountType, discountValue, taxRatePercent */
export function computeTotals(bill) {
  const lines = bill.lines ?? []
  const sub = subtotal(lines)
  const disc = discountAmount(sub, bill.discountType, bill.discountValue)
  const base = taxableBase(sub, disc)
  const tax = taxAmount(base, bill.taxRatePercent)
  const grand = grandTotal(base, tax)
  return {
    subtotal: sub,
    discountAmount: disc,
    taxableBase: base,
    taxAmount: tax,
    grandTotal: grand,
  }
}
