import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createBill, patchBill, addBillLine } from '../api/billsApi'
import { listCatalogItems } from '../api/catalogApi'
import { API_BASE } from '../api/client'
import { BillLineSource, CatalogType } from '../constants/enums'
import { computeTotals, lineTotal } from '../utils/billingMath'

function newKey() {
  return globalThis.crypto?.randomUUID?.() ?? `k-${Date.now()}-${Math.random()}`
}

/**
 * Shopping-cart style flow: add catalog/custom rows here, preview totals,
 * then **Generate bill** to create the draft on the server and go to the bill (or print).
 */
export default function CartPage() {
  const navigate = useNavigate()
  const [catalogTab, setCatalogTab] = useState(CatalogType.EntranceFee)
  const [catalogItems, setCatalogItems] = useState([])
  const [catalogErr, setCatalogErr] = useState(null)
  const [cart, setCart] = useState([])
  const [catalogQty, setCatalogQty] = useState('1')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)

  const [customDesc, setCustomDesc] = useState('')
  const [customPrice, setCustomPrice] = useState('')
  const [customQty, setCustomQty] = useState('1')
  const [customSource, setCustomSource] = useState(BillLineSource.Custom)

  const [discountType, setDiscountType] = useState(0)
  const [discountValue, setDiscountValue] = useState('0')
  const [taxRate, setTaxRate] = useState('8.25')

  useEffect(() => {
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
          setCatalogErr(e?.message ?? 'Could not load catalog. Is the API running?')
          setCatalogItems([])
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [catalogTab])

  const totals = useMemo(() => {
    const lines = cart.map((c) => ({ lineTotal: lineTotal(c.quantity, c.unitPrice) }))
    return computeTotals({
      lines,
      discountType,
      discountValue: Number(discountValue) || 0,
      taxRatePercent: Number(taxRate) || 0,
    })
  }, [cart, discountType, discountValue, taxRate])

  function addCatalogItem(item) {
    const qty = Math.max(1, parseInt(String(catalogQty), 10) || 1)
    setErr(null)
    setCart((prev) => [
      ...prev,
      {
        key: newKey(),
        type: 'catalog',
        catalogItemId: item.id,
        label: item.name,
        quantity: qty,
        unitPrice: Number(item.defaultPrice),
      },
    ])
  }

  function addCustomLine(e) {
    e.preventDefault()
    if (!customDesc.trim()) return
    const qty = Math.max(1, Number(customQty) || 1)
    const price = Number(customPrice)
    if (Number.isNaN(price)) return
    setErr(null)
    setCart((prev) => [
      ...prev,
      {
        key: newKey(),
        type: 'custom',
        source: customSource,
        description: customDesc.trim(),
        quantity: qty,
        unitPrice: price,
        label: customDesc.trim(),
      },
    ])
    setCustomDesc('')
    setCustomPrice('')
  }

  function updateQty(key, qty) {
    const q = Math.max(1, parseInt(String(qty), 10) || 1)
    setCart((prev) => prev.map((r) => (r.key === key ? { ...r, quantity: q } : r)))
  }

  function updateUnitPrice(key, price) {
    const p = Number(price)
    if (Number.isNaN(p)) return
    setCart((prev) => prev.map((r) => (r.key === key ? { ...r, unitPrice: p } : r)))
  }

  function removeRow(key) {
    setCart((prev) => prev.filter((r) => r.key !== key))
  }

  function clearCart() {
    if (cart.length && !window.confirm('Clear all items from the cart?')) return
    setCart([])
    setErr(null)
  }

  /**
   * Creates a draft bill on the server, pushes every cart line, then navigates or opens print.
   * @param {{ openPrint?: boolean }} opts
   */
  async function generateBill(opts = {}) {
    if (cart.length === 0) {
      setErr('Add at least one item to the cart before generating a bill.')
      return
    }
    setBusy(true)
    setErr(null)
    try {
      const bill = await createBill({
        taxRatePercent: Number(taxRate) || 0,
      })
      await patchBill(bill.id, {
        discountType,
        discountValue: Number(discountValue) || 0,
      })

      for (const row of cart) {
        if (row.type === 'catalog') {
          await addBillLine(bill.id, {
            catalogItemId: row.catalogItemId,
            quantity: row.quantity,
            source: BillLineSource.Entrance,
            unitPrice: Number(row.unitPrice),
          })
        } else {
          await addBillLine(bill.id, {
            source: row.source,
            description: row.description,
            quantity: row.quantity,
            unitPrice: row.unitPrice,
          })
        }
      }

      setCart([])

      if (opts.openPrint) {
        const printPath = `/bills/${bill.id}/print`
        const url = printPath
        window.open(url, '_blank', 'noopener,noreferrer')
      }

      navigate(`/bills/${bill.id}`)
    } catch (e) {
      setErr(e?.message ?? 'Could not create bill. Check API and try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page cart-page">
      <div className="page-head">
        <div>
          <h1>Cart — build a new bill</h1>
          <p className="muted">
            Add products here (like a shopping cart). When ready, use <strong>Generate bill</strong> to create the invoice,
            then open <strong>Print</strong> from the bill screen or use <strong>Generate &amp; print</strong>.
          </p>
        </div>
      </div>

      {import.meta.env.DEV && (
        <p className="muted api-hint">
          API: {API_BASE || 'Vite proxy → http://localhost:5235'} — run <code>dotnet run</code> in{' '}
          <code>BillGenerator.Api</code>.
        </p>
      )}

      {err && <p className="error">{err}</p>}
      {catalogErr && <p className="error">{catalogErr}</p>}

      <div className="cart-layout">
        <section className="card">
          <h2>1. Add items</h2>
          <label className="inline-qty">
            Quantity for next catalog click
            <input
              type="number"
              min={1}
              value={catalogQty}
              onChange={(e) => setCatalogQty(e.target.value)}
              disabled={busy}
            />
          </label>
          <div className="tabs small">
            <button
              type="button"
              className={catalogTab === CatalogType.EntranceFee ? 'tab active' : 'tab'}
              onClick={() => setCatalogTab(CatalogType.EntranceFee)}
              disabled={busy}
            >
              Entrance
            </button>
            <button
              type="button"
              className={catalogTab === CatalogType.DonationPreset ? 'tab active' : 'tab'}
              onClick={() => setCatalogTab(CatalogType.DonationPreset)}
              disabled={busy}
            >
              Donation
            </button>
            <button
              type="button"
              className={catalogTab === CatalogType.SellingPrice ? 'tab active' : 'tab'}
              onClick={() => setCatalogTab(CatalogType.SellingPrice)}
              disabled={busy}
            >
              Selling
            </button>
          </div>
          <div className="catalog-pick">
            {catalogItems.map((it) => (
              <button
                key={it.id}
                type="button"
                className="btn chip"
                disabled={busy}
                onClick={() => addCatalogItem(it)}
              >
                + {it.name} ({Number(it.defaultPrice).toFixed(2)})
              </button>
            ))}
            {catalogItems.length === 0 && !catalogErr && (
              <p className="muted">No items in this catalog.</p>
            )}
          </div>

          <hr className="divider" />

          <h3>Custom item</h3>
          <form className="grid two custom-line-form" onSubmit={addCustomLine}>
            <label>
              Description
              <input value={customDesc} onChange={(e) => setCustomDesc(e.target.value)} required disabled={busy} />
            </label>
            <label>
              Unit price
              <input
                type="number"
                step="0.01"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                required
                disabled={busy}
              />
            </label>
            <label>
              Qty
              <input
                type="number"
                min={1}
                value={customQty}
                onChange={(e) => setCustomQty(e.target.value)}
                disabled={busy}
              />
            </label>
            <label>
              Source
              <select
                value={customSource}
                onChange={(e) => setCustomSource(Number(e.target.value))}
                disabled={busy}
              >
                <option value={BillLineSource.Custom}>Custom</option>
                <option value={BillLineSource.Donation}>Donation</option>
                <option value={BillLineSource.Entrance}>Entrance</option>
                <option value={BillLineSource.Selling}>Selling</option>
              </select>
            </label>
            <button type="submit" className="btn primary" disabled={busy}>
              Add to cart
            </button>
          </form>
        </section>

        <section className="card cart-summary">
          <h2>2. Your cart</h2>
          {cart.length === 0 ? (
            <p className="muted">No items yet. Use the buttons on the left to add lines.</p>
          ) : (
            <>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Unit</th>
                      <th>Line</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((row) => (
                      <tr key={row.key}>
                        <td>{row.type === 'catalog' ? row.label : row.description}</td>
                        <td>
                          <input
                            type="number"
                            min={1}
                            className="table-input"
                            value={row.quantity}
                            onChange={(e) => updateQty(row.key, e.target.value)}
                            disabled={busy}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            className="table-input"
                            value={row.unitPrice}
                            onChange={(e) => updateUnitPrice(row.key, e.target.value)}
                            disabled={busy}
                          />
                        </td>
                        <td>{lineTotal(row.quantity, row.unitPrice).toFixed(2)}</td>
                        <td>
                          <button
                            type="button"
                            className="btn small danger"
                            disabled={busy}
                            onClick={() => removeRow(row.key)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" className="btn ghost" onClick={clearCart} disabled={busy}>
                Clear cart
              </button>
            </>
          )}

          <hr className="divider" />

          <h3>Discount &amp; tax (applied when bill is created)</h3>
          <div className="grid two">
            <label>
              Discount type
              <select
                value={discountType}
                onChange={(e) => setDiscountType(Number(e.target.value))}
                disabled={busy}
              >
                <option value={0}>None</option>
                <option value={1}>Percent</option>
                <option value={2}>Fixed amount</option>
              </select>
            </label>
            <label>
              Discount value
              <input
                type="number"
                step="0.01"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                disabled={busy}
              />
            </label>
            <label>
              Tax rate %
              <input
                type="number"
                step="0.0001"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                disabled={busy}
              />
            </label>
          </div>

          <ul className="totals-list cart-totals">
            <li>Subtotal: {totals.subtotal.toFixed(2)}</li>
            <li>Discount: −{totals.discountAmount.toFixed(2)}</li>
            <li>Tax: {totals.taxAmount.toFixed(2)}</li>
            <li className="grand">
              <strong>Estimated total: {totals.grandTotal.toFixed(2)}</strong>
            </li>
          </ul>

          <h2>3. Generate bill &amp; print</h2>
          <p className="muted">
            This creates a <strong>draft</strong> bill with these lines. On the next screen you can adjust, finalize for an
            invoice number, or print anytime.
          </p>
          <div className="cart-actions">
            <button
              type="button"
              className="btn primary"
              disabled={busy || cart.length === 0}
              onClick={() => generateBill({ openPrint: false })}
            >
              {busy ? 'Working…' : 'Generate bill'}
            </button>
            <button
              type="button"
              className="btn primary"
              disabled={busy || cart.length === 0}
              onClick={() => generateBill({ openPrint: true })}
            >
              {busy ? 'Working…' : 'Generate bill & open print'}
            </button>
            <Link to="/" className="btn">
              Back to bills list
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
