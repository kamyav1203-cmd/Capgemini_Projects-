import { apiFetch, API_BASE } from './client'

/**
 * @param {{ fromUtc?: string, toUtc?: string, status?: number, search?: string }} params
 */
export function listBills(params = {}) {
  const u = new URLSearchParams()
  if (params.fromUtc) u.set('fromUtc', params.fromUtc)
  if (params.toUtc) u.set('toUtc', params.toUtc)
  if (params.status != null && params.status !== '') u.set('status', String(params.status))
  if (params.search) u.set('search', params.search)
  const q = u.toString()
  return apiFetch(`/api/Bills${q ? `?${q}` : ''}`)
}

export function getBill(id) {
  return apiFetch(`/api/Bills/${id}`)
}

export function createBill(body = {}) {
  return apiFetch('/api/Bills', { method: 'POST', body: JSON.stringify(body) })
}

export function patchBill(id, body) {
  return apiFetch(`/api/Bills/${id}`, { method: 'PATCH', body: JSON.stringify(body) })
}

export function deleteBill(id) {
  return apiFetch(`/api/Bills/${id}`, { method: 'DELETE' })
}

export function addBillLine(billId, body) {
  return apiFetch(`/api/Bills/${billId}/lines`, { method: 'POST', body: JSON.stringify(body) })
}

export function patchBillLine(billId, lineId, body) {
  return apiFetch(`/api/Bills/${billId}/lines/${lineId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export function deleteBillLine(billId, lineId) {
  return apiFetch(`/api/Bills/${billId}/lines/${lineId}`, { method: 'DELETE' })
}

export function finalizeBill(id) {
  return apiFetch(`/api/Bills/${id}/finalize`, { method: 'POST' })
}

/** URL for CSV download (absolute if VITE_API_URL set, else same-origin for Vite proxy). */
export function billCsvUrl(id) {
  const path = `/api/Bills/${id}/export.csv`
  return API_BASE ? `${API_BASE}${path}` : path
}
