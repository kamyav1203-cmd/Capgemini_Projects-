/** Mirror of backend enums (numeric JSON values). */

export const CatalogType = {
  EntranceFee: 0,
  DonationPreset: 1,
  SellingPrice: 2,
}

export const BillStatus = {
  Draft: 0,
  Finalized: 1,
}

export const DiscountType = {
  None: 0,
  Percent: 1,
  FixedAmount: 2,
}

export const BillLineSource = {
  Entrance: 0,
  Donation: 1,
  Selling: 2,
  Custom: 3,
}

export function catalogTypeLabel(t) {
  switch (t) {
    case CatalogType.EntranceFee:
      return 'Entrance fee'
    case CatalogType.DonationPreset:
      return 'Donation preset'
    case CatalogType.SellingPrice:
      return 'Selling price'
    default:
      return String(t)
  }
}

export function billStatusLabel(s) {
  if (s === BillStatus.Finalized || s === 1 || s === 'Finalized') return 'Finalized'
  return 'Draft'
}

/** Treats API numeric or string enum values as draft vs finalized. */
export function isDraftStatus(s) {
  return s === BillStatus.Draft || s === 0 || s === 'Draft' || s === 'draft'
}

export function lineSourceLabel(s) {
  const map = ['Entrance', 'Donation', 'Selling', 'Custom']
  return map[s] ?? String(s)
}
