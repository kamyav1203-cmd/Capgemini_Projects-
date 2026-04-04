import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBill } from '../api/billsApi'
import { lineSourceLabel } from '../constants/enums'

/**
 * Minimal print-friendly invoice (use browser Print → Save as PDF).
 */
export default function InvoicePrintPage() {
  const { id } = useParams()
  const [bill, setBill] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const b = await getBill(Number(id))
        if (!cancelled) setBill(b)
      } catch (e) {
        if (!cancelled) setErr(e.message)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  if (err) return <p className="error">{err}</p>
  if (!bill) return <p>Loading…</p>

  const totals = bill.totals

  return (
    <div className="print-page">
      <div className="print-toolbar no-print">
        <button type="button" className="btn primary" onClick={() => window.print()}>
          Print / Save PDF
        </button>
      </div>
      <article className="invoice-sheet">
        <header className="invoice-header">
          <h1>Invoice</h1>
          <div className="invoice-meta">
            <div>
              <strong>Invoice #</strong> {bill.invoiceNumber ?? `DRAFT-${bill.id}`}
            </div>
            <div>
              <strong>Date (UTC)</strong> {new Date(bill.createdAtUtc).toLocaleString()}
            </div>
            <div>
              <strong>Status</strong> {bill.status === 1 ? 'Finalized' : 'Draft'}
            </div>
          </div>
        </header>
        {bill.notes && (
          <p className="invoice-notes">
            <strong>Notes:</strong> {bill.notes}
          </p>
        )}
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Description</th>
              <th className="num">Qty</th>
              <th className="num">Unit</th>
              <th className="num">Total</th>
            </tr>
          </thead>
          <tbody>
            {(bill.lines ?? []).map((ln) => (
              <tr key={ln.id}>
                <td>{lineSourceLabel(ln.source)}</td>
                <td>{ln.description}</td>
                <td className="num">{ln.quantity}</td>
                <td className="num">{Number(ln.unitPrice).toFixed(2)}</td>
                <td className="num">{Number(ln.lineTotal).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {totals && (
          <footer className="invoice-totals">
            <div>Subtotal: {Number(totals.subtotal).toFixed(2)}</div>
            <div>Discount: −{Number(totals.discountAmount).toFixed(2)}</div>
            <div>Tax: {Number(totals.taxAmount).toFixed(2)}</div>
            <div className="grand">Total due: {Number(totals.grandTotal).toFixed(2)}</div>
          </footer>
        )}
      </article>
    </div>
  )
}
