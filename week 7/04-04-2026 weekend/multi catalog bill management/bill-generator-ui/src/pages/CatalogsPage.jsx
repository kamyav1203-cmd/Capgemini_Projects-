import { useEffect, useState } from 'react'
import {
  listCatalogItems,
  createCatalogItem,
  patchCatalogItem,
  deleteCatalogItem,
} from '../api/catalogApi'
import { CatalogType, catalogTypeLabel } from '../constants/enums'

const TABS = [
  { key: CatalogType.EntranceFee, label: 'Entrance fees' },
  { key: CatalogType.DonationPreset, label: 'Donations' },
  { key: CatalogType.SellingPrice, label: 'Selling prices' },
]

/**
 * Manage catalog rows (add / edit / delete) per catalog type.
 */
export default function CatalogsPage() {
  const [tab, setTab] = useState(CatalogType.EntranceFee)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [editing, setEditing] = useState(null)

  async function load() {
    setLoading(true)
    setErr(null)
    try {
      const data = await listCatalogItems(tab)
      setItems(data)
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  async function onAdd(e) {
    e.preventDefault()
    setErr(null)
    try {
      await createCatalogItem({
        catalogType: tab,
        name: name.trim(),
        defaultPrice: Number(price),
        sortOrder: items.length,
      })
      setName('')
      setPrice('')
      await load()
    } catch (ex) {
      setErr(ex.message)
    }
  }

  async function toggleActive(item) {
    setErr(null)
    try {
      await patchCatalogItem(item.id, { isActive: !item.isActive })
      await load()
    } catch (ex) {
      setErr(ex.message)
    }
  }

  async function onSaveEdit(e) {
    e.preventDefault()
    if (!editing) return
    setErr(null)
    try {
      await patchCatalogItem(editing.id, {
        name: editing.name.trim(),
        defaultPrice: Number(editing.defaultPrice),
      })
      setEditing(null)
      await load()
    } catch (ex) {
      setErr(ex.message)
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Remove or deactivate this catalog item?')) return
    setErr(null)
    try {
      await deleteCatalogItem(id)
      await load()
    } catch (ex) {
      setErr(ex.message)
    }
  }

  return (
    <div className="page">
      <h1>Catalogs</h1>
      <p className="muted">
        Pre-defined entrance tickets, donation presets, and sellable items. Custom donation amounts are added on the bill
        as custom lines.
      </p>

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={tab === t.key ? 'tab active' : 'tab'}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="badge">{catalogTypeLabel(tab)}</p>
      {err && <p className="error">{err}</p>}

      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Default price</th>
                  <th>Active</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>
                      {editing?.id === it.id ? (
                        <input
                          value={editing.name}
                          onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                        />
                      ) : (
                        it.name
                      )}
                    </td>
                    <td>
                      {editing?.id === it.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editing.defaultPrice}
                          onChange={(e) =>
                            setEditing({ ...editing, defaultPrice: e.target.value })
                          }
                        />
                      ) : (
                        Number(it.defaultPrice).toFixed(2)
                      )}
                    </td>
                    <td>{it.isActive ? 'Yes' : 'No'}</td>
                    <td className="actions">
                      {editing?.id === it.id ? (
                        <>
                          <button type="button" className="btn small" onClick={onSaveEdit}>
                            Save
                          </button>
                          <button type="button" className="btn small ghost" onClick={() => setEditing(null)}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button type="button" className="btn small" onClick={() => setEditing({ ...it })}>
                            Edit
                          </button>
                          <button type="button" className="btn small" onClick={() => toggleActive(it)}>
                            Toggle active
                          </button>
                          <button type="button" className="btn small danger" onClick={() => onDelete(it.id)}>
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form className="card add-form" onSubmit={onAdd}>
            <h3>Add item</h3>
            <div className="grid two">
              <label>
                Name
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label>
                Default price
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </label>
            </div>
            <button type="submit" className="btn primary">
              Add to catalog
            </button>
          </form>
        </>
      )}
    </div>
  )
}
