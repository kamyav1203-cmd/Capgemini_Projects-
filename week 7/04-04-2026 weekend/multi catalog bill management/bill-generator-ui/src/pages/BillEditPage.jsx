import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getBill,
  patchBill,
  addBillLine,
  patchBillLine,
  deleteBillLine,
  finalizeBill,
  billCsvUrl,
} from '../api/billsApi'
import { API_BASE } from '../api/client'
import { listCatalogItems } from '../api/catalogApi'
import {
  BillLineSource,
  CatalogType,
  billStatusLabel,
  isDraftStatus,
  lineSourceLabel,
} from '../constants/enums'
import { computeTotals } from '../utils/billingMath'

const DRAFT_KEY = 'billDraftBackup'

/**
 * Build and edit a single bill: lines from multiple catalogs, discounts, tax, finalize.
 */
export default function BillEditPage() {
  const { id } = useParams()
  const billId = Number.parseInt(String(id ?? ''), 10)
  const [bill, setBill] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const [catalogTab, setCatalogTab] = useState(CatalogType.EntranceFee)
  const [catalogItems, setCatalogItems] = useState([])
  const [customDesc, setCustomDesc] = useState('')
  const [customPrice, setCustomPrice] = useState('')
  const [customQty, setCustomQty] = useState('1')
  const [customSource, setCustomSource] = useState(BillLineSource.Custom)
  /** Default quantity when adding a catalog row to the bill. */
  const [catalogQty, setCatalogQty] = useState('1')
  const [catalogErr, setCatalogErr] = useState(null)
  const [lineBusy, setLineBusy] = useState(false)

  const refresh = useCallback(async () => {
    if (!Number.isFinite(billId)) return
    const b = await getBill(billId)
    setBill(b)
  }, [billId])

  useEffect(() => {
    if (!Number.isFinite(billId)) {
      setLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setErr(null)
      try {
        const b = await getBill(billId)
        if (!cancelled) setBill(b)
      } catch (e) {
        if (!cancelled) setErr(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [billId])

  useEffect(() => {
    if (!Number.isFinite(billId)) return
    let cancelled = false
    ;(async () => {
      try {
        const data = await listCatalogItems(catalogTab)
        if (!cancelled) {
          setCatalogErr(null)
          setCatalogItems(data.filter((x) => x.isActive))
        }
      } catch (e) {
        if (!cancelled) {
          setCatalogErr(e?.message ?? 'Could not load catalog (is the API running on port 5235?)')
          setCatalogItems([])
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [catalogTab])

  // Optional local backup of the in-progress draft (survives accidental refresh).
  useEffect(() => {
    if (!bill || !isDraftStatus(bill.status)) return
    const handle = setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ billId: bill.id, savedAt: new Date().toISOString(), bill }),
        )
      } catch {
        /* quota or private mode */
      }
    }, 900)
    return () => clearTimeout(handle)
  }, [bill])

  const isDraft = bill && isDraftStatus(bill.status)
  const totals = bill ? bill.totals ?? computeTotals(bill) : null

  async function onPatchHeader(partial) {
    if (!isDraft) return
    setErr(null)
    try {
      const updated = await patchBill(billId, partial)
      setBill(updated)
    } catch (e) {
      setErr(e.message)
    }
  }

  async function onAddFromCatalog(item) {
    if (!isDraft || lineBusy) return
    const qty = Math.max(1, parseInt(String(catalogQty), 10) || 1)
    setErr(null)
    setLineBusy(true)
    try {
      const updated = await addBillLine(billId, {
        catalogItemId: item.id,
        quantity: qty,
        // Explicit default for model binding; server still aligns Source with catalog type.
        source: BillLineSource.Entrance,
      })
      setBill(updated)
    } catch (e) {
      setErr(e.message)
    } finally {
      setLineBusy(false)
    }
  }

  async function onAddCustom(e) {
    e.preventDefault()
    if (!isDraft || lineBusy) return
    setErr(null)
    setLineBusy(true)
    try {
      const updated = await addBillLine(billId, {
        source: customSource,
        description: customDesc.trim(),
        quantity: Number(customQty) || 1,
        unitPrice: Number(customPrice),
      })
      setBill(updated)
      setCustomDesc('')
      setCustomPrice('')
    } catch (e) {
      setErr(e.message)
    } finally {
      setLineBusy(false)
    }
  }

  async function onLineBlur(line, field, raw) {
    if (!isDraft) return
    const next = { ...line }
    if (field === 'quantity') next.quantity = Math.max(1, Number(raw) || 1)
    if (field === 'unitPrice') next.unitPrice = Number(raw)
    if (field === 'description') next.description = String(raw).trim()
    setErr(null)
    try {
      const updated = await patchBillLine(billId, line.id, {
        quantity: next.quantity,
        unitPrice: next.unitPrice,
        description: next.description,
      })
      setBill(updated)
    } catch (e) {
      setErr(e.message)
      await refresh()
    }
  }

  async function onDeleteLine(lineId) {
    if (!isDraft) return
    if (!window.confirm('Remove this line?')) return
    setErr(null)
    try {
      const updated = await deleteBillLine(billId, lineId)
      setBill(updated)
    } catch (e) {
      setErr(e.message)
    }
  }

  async function onFinalize() {
    if (!isDraft) return
    if (!window.confirm('Finalize this bill? It will be locked and receive an invoice number.')) return
    setErr(null)
    try {
      const updated = await finalizeBill(billId)
      setBill(updated)
    } catch (e) {
      setErr(e.message)
    }
  }

  if (!Number.isFinite(billId)) return <p className="error">Invalid bill link.</p>
  if (loading) return <p>Loading bill…</p>
  if (err && !bill) return <p className="error">{err}</p>
  if (!bill) return <p>Bill not found.</p>

  return (
    <div className="page bill-edit">
      <div className="page-head">
        <div>
          <Link to="/">← Bills</Link>
          <h1>
            Bill #{bill.id}{' '}
            <span className="badge">{billStatusLabel(bill.status)}</span>
          </h1>
          <p className="muted">
            Invoice: {bill.invoiceNumber ?? '—'} · Created (UTC): {new Date(bill.createdAtUtc).toLocaleString()}
          </p>
        </div>
        <div className="actions-row">
          <a className="btn" href={billCsvUrl(billId)} target="_blank" rel="noreferrer">
            Download CSV
          </a>
          <Link className="btn" to={`/bills/${billId}/print`} target="_blank" rel="noreferrer">
            Print view
          </Link>
          {isDraft && (
            <button type="button" className="btn primary" onClick={onFinalize}>
              Finalize invoice
            </button>
          )}
        </div>
      </div>

      {err && <p className="error">{err}</p>}

      {import.meta.env.DEV && (
        <p className="muted api-hint">
          API: {API_BASE || 'same origin (Vite → http://localhost:5235 proxy)'} — run{' '}
          <code>dotnet run</code> in <code>BillGenerator.Api</code> first.
        </p>
      )}

      {!isDraft && bill && (
        <section className="card banner-finalized">
          <strong>This bill is finalized.</strong> You cannot add or edit lines. Create a new bill from the Bills page to
          build another invoice.
        </section>
      )}

      {isDraft && (
        <section className="card build-bill">
          <h2>Add items to this bill</h2>
          <p className="muted">
            Pick a catalog tab, set quantity, then click an item — or add a fully custom line below.
          </p>
          <label className="inline-qty">
            Quantity for next catalog add
            <input
              type="number"
              min={1}
              value={catalogQty}
              onChange={(e) => setCatalogQty(e.target.value)}
              disabled={lineBusy}
            />
          </label>
          <div className="tabs small">
            <button
              type="button"
              className={catalogTab === CatalogType.EntranceFee ? 'tab active' : 'tab'}
              onClick={() => setCatalogTab(CatalogType.EntranceFee)}
              disabled={lineBusy}
            >
              Entrance
            </button>
            <button
              type="button"
              className={catalogTab === CatalogType.DonationPreset ? 'tab active' : 'tab'}
              onClick={() => setCatalogTab(CatalogType.DonationPreset)}
              disabled={lineBusy}
            >
              Donation
            </button>
            <button
              type="button"
              className={catalogTab === CatalogType.SellingPrice ? 'tab active' : 'tab'}
              onClick={() => setCatalogTab(CatalogType.SellingPrice)}
              disabled={lineBusy}
            >
              Selling
            </button>
          </div>
          {catalogErr && <p className="error">{catalogErr}</p>}
          <div className="catalog-pick">
            {catalogItems.map((it) => (
              <button
                key={it.id}
                type="button"
                className="btn chip"
                disabled={lineBusy}
                onClick={() => onAddFromCatalog(it)}
              >
                + {it.name} ({Number(it.defaultPrice).toFixed(2)})
              </button>
            ))}
            {catalogItems.length === 0 && !catalogErr && (
              <p className="muted">No active items in this catalog.</p>
            )}
          </div>

          <hr className="divider" />

          <h3>Custom line (not in catalog)</h3>
          <form className="grid two custom-line-form" onSubmit={onAddCustom}>
            <label>
              Description
              <input
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                required
                disabled={lineBusy}
              />
            </label>
            <label>
              Unit price
              <input
                type="number"
                step="0.01"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                required
                disabled={lineBusy}
              />
            </label>
            <label>
              Quantity
              <input
                type="number"
                min={1}
                value={customQty}
                onChange={(e) => setCustomQty(e.target.value)}
                disabled={lineBusy}
              />
            </label>
            <label>
              Source label
              <select
                value={customSource}
                onChange={(e) => setCustomSource(Number(e.target.value))}
                disabled={lineBusy}
              >
                <option value={BillLineSource.Custom}>Custom</option>
                <option value={BillLineSource.Donation}>Donation (custom amount)</option>
                <option value={BillLineSource.Entrance}>Entrance</option>
                <option value={BillLineSource.Selling}>Selling</option>
              </select>
            </label>
            <button type="submit" className="btn primary" disabled={lineBusy}>
              {lineBusy ? 'Adding…' : 'Add custom line'}
            </button>
          </form>
        </section>
      )}

      <section className="card">
        <h3>Totals</h3>
        {totals && (
          <ul className="totals-list">
            <li>Subtotal: {Number(totals.subtotal).toFixed(2)}</li>
            <li>Discount: −{Number(totals.discountAmount).toFixed(2)}</li>
            <li>Tax ({Number(bill.taxRatePercent).toFixed(2)}%): {Number(totals.taxAmount).toFixed(2)}</li>
            <li className="grand">
              <strong>Grand total: {Number(totals.grandTotal).toFixed(2)}</strong>
            </li>
          </ul>
        )}
      </section>

      <section className="card grid two">
        <div>
          <h3>Discount</h3>
          <label>
            Type
            <select
              value={bill.discountType}
              disabled={!isDraft}
              onChange={(e) => onPatchHeader({ discountType: Number(e.target.value) })}
            >
              <option value={0}>None</option>
              <option value={1}>Percent</option>
              <option value={2}>Fixed amount</option>
            </select>
          </label>
          <label>
            Value
            <input
              type="number"
              step="0.01"
              defaultValue={bill.discountValue}
              key={`disc-${bill.discountValue}-${bill.discountType}`}
              disabled={!isDraft}
              onBlur={(e) => onPatchHeader({ discountValue: Number(e.target.value) })}
            />
          </label>
        </div>
        <div>
          <h3>Tax rate (%)</h3>
          <label>
            Rate
            <input
              type="number"
              step="0.0001"
              defaultValue={bill.taxRatePercent}
              key={`tax-${bill.taxRatePercent}`}
              disabled={!isDraft}
              onBlur={(e) => onPatchHeader({ taxRatePercent: Number(e.target.value) })}
            />
          </label>
          <label>
            Notes
            <textarea
              defaultValue={bill.notes ?? ''}
              key={`notes-${bill.notes}`}
              disabled={!isDraft}
              onBlur={(e) => onPatchHeader({ notes: e.target.value })}
            />
          </label>
        </div>
      </section>

      <section className="card">
        <h3>Line items</h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Line</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(bill.lines ?? []).map((ln) => (
                <tr key={ln.id}>
                  <td>{lineSourceLabel(ln.source)}</td>
                  <td>
                    {isDraft ? (
                      <input
                        defaultValue={ln.description}
                        onBlur={(e) => onLineBlur(ln, 'description', e.target.value)}
                      />
                    ) : (
                      ln.description
                    )}
                  </td>
                  <td>
                    {isDraft ? (
                      <input
                        type="number"
                        min={1}
                        defaultValue={ln.quantity}
                        onBlur={(e) => onLineBlur(ln, 'quantity', e.target.value)}
                      />
                    ) : (
                      ln.quantity
                    )}
                  </td>
                  <td>
                    {isDraft ? (
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={ln.unitPrice}
                        onBlur={(e) => onLineBlur(ln, 'unitPrice', e.target.value)}
                      />
                    ) : (
                      Number(ln.unitPrice).toFixed(2)
                    )}
                  </td>
                  <td>{Number(ln.lineTotal).toFixed(2)}</td>
                  <td>
                    {isDraft && (
                      <button type="button" className="btn small danger" onClick={() => onDeleteLine(ln.id)}>
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
