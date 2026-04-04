import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listBills, createBill } from '../api/billsApi'
import { BillStatus, billStatusLabel } from '../constants/enums'

/**
 * Search/filter past bills and start a new draft.
 */
export default function BillsListPage() {
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  async function load() {
    setLoading(true)
    setErr(null)
    try {
      const params = { search: search || undefined }
      if (status !== '') params.status = Number(status)
      if (fromDate) params.fromUtc = `${fromDate}T00:00:00.000Z`
      if (toDate) params.toUtc = `${toDate}T23:59:59.999Z`
      const data = await listBills(params)
      setRows(data)
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

  async function onNewBill() {
    setErr(null)
    try {
      const b = await createBill({})
      navigate(`/bills/${b.id}`)
    } catch (e) {
      setErr(e.message)
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Bills</h1>
        <div className="actions-row">
          <Link to="/cart" className="btn primary">
            Cart — add items &amp; generate bill
          </Link>
          <button type="button" className="btn" onClick={onNewBill}>
            Empty draft bill
          </button>
        </div>
      </div>

      <section className="card filters">
        <div className="grid filters-grid">
          <label>
            Search
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Invoice # or notes"
            />
          </label>
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Any</option>
              <option value={BillStatus.Draft}>Draft</option>
              <option value={BillStatus.Finalized}>Finalized</option>
            </select>
          </label>
          <label>
            From (UTC date)
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </label>
          <label>
            To (UTC date)
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </label>
        </div>
        <button type="button" className="btn" onClick={load} disabled={loading}>
          Apply filters
        </button>
      </section>

      {err && <p className="error">{err}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Invoice</th>
                <th>Created (UTC)</th>
                <th>Status</th>
                <th>Grand total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.invoiceNumber ?? '—'}</td>
                  <td>{new Date(r.createdAtUtc).toLocaleString()}</td>
                  <td>{billStatusLabel(r.status)}</td>
                  <td>{Number(r.grandTotal).toFixed(2)}</td>
                  <td>
                    <Link to={`/bills/${r.id}`}>Open</Link>
                    {' · '}
                    <Link to={`/bills/${r.id}/print`} target="_blank" rel="noreferrer">
                      Print
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="muted">No bills match.</p>}
        </div>
      )}
    </div>
  )
}
