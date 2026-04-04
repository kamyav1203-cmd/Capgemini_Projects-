/**
 * Base URL for the .NET API.
 * - If `VITE_API_URL` is set (see `.env.development`), requests go there.
 * - If empty, requests use relative `/api/...` (Vite dev server proxies to the API — see `vite.config.js`).
 */
const envBase = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/$/, '')
export const API_BASE =
  envBase ||
  (import.meta.env.DEV ? '' : 'http://localhost:5235')

/**
 * @param {string} path — e.g. `/api/Bills`
 * @param {RequestInit} [init]
 */
export async function apiFetch(path, init = {}) {
  const rel = path.startsWith('/') ? path : `/${path}`
  const url = API_BASE ? `${API_BASE}${rel}` : rel
  const headers = new Headers(init.headers)
  if (init.body != null && typeof init.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const res = await fetch(url, { ...init, headers })
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`
    try {
      const j = await res.json()
      if (j?.message) msg = j.message
      else if (j?.title) msg = j.title
      // ASP.NET model validation returns { errors: { Prop: ["msg"] } }
      if (j?.errors && typeof j.errors === 'object') {
        const first = Object.values(j.errors).flat()[0]
        if (first) msg = Array.isArray(first) ? first[0] : String(first)
      }
    } catch {
      /* ignore */
    }
    throw new Error(msg)
  }
  if (res.status === 204) return null
  const ct = res.headers.get('content-type')
  if (ct && ct.includes('application/json')) return res.json()
  return res.text()
}
