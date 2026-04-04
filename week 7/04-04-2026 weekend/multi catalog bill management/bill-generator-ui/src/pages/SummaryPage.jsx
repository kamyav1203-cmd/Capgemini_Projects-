import { useEffect, useState } from 'react'
import { dailySummary } from '../api/reportsApi'

/**
 * Aggregated sales for finalized bills on a single UTC calendar day.
 */
export default function SummaryPage() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    setErr(null)
    try {
      const d = await dailySummary(`${date}T00:00:00.000Z`)
      setData(d)
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="page">
      <h1>Daily sales summary</h1>
      <p className="muted">Totals include only finalized bills whose created time falls on the selected UTC day.</p>
      <section className="card filters">
        <label>
          UTC date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <button type="button" className="btn primary" onClick={load} disabled={loading}>
          Refresh
        </button>
      </section>
      {err && <p className="error">{err}</p>}
      {loading && <p>Loading…</p>}
      {data && !loading && (
        <div className="card summary-grid">
          <div>
            <span className="muted">Bills</span>
            <div className="big">{data.finalizedBillCount}</div>
          </div>
          <div>
            <span className="muted">Gross subtotal</span>
            <div className="big">{Number(data.grossSubtotal).toFixed(2)}</div>
          </div>
          <div>
            <span className="muted">Total discount</span>
            <div className="big">{Number(data.totalDiscount).toFixed(2)}</div>
          </div>
          <div>
            <span className="muted">Total tax</span>
            <div className="big">{Number(data.totalTax).toFixed(2)}</div>
          </div>
          <div>
            <span className="muted">Net grand total</span>
            <div className="big accent">{Number(data.netGrandTotal).toFixed(2)}</div>
          </div>
        </div>
      )}
    </div>
  )
}
