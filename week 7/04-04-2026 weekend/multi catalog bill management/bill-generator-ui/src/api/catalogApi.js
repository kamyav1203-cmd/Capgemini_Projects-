import { apiFetch } from './client'

/** @param {number | undefined} catalogType */
export function listCatalogItems(catalogType) {
  const q = catalogType == null ? '' : `?catalogType=${catalogType}`
  return apiFetch(`/api/CatalogItems${q}`)
}

export function createCatalogItem(body) {
  return apiFetch('/api/CatalogItems', { method: 'POST', body: JSON.stringify(body) })
}

export function patchCatalogItem(id, body) {
  return apiFetch(`/api/CatalogItems/${id}`, { method: 'PATCH', body: JSON.stringify(body) })
}

export function deleteCatalogItem(id) {
  return apiFetch(`/api/CatalogItems/${id}`, { method: 'DELETE' })
}
