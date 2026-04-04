import { apiFetch } from './client'

/** @param {string} [dateUtcIso] — ISO date; server uses UTC day */
export function dailySummary(dateUtcIso) {
  const q = dateUtcIso ? `?dateUtc=${encodeURIComponent(dateUtcIso)}` : ''
  return apiFetch(`/api/Reports/daily-summary${q}`)
}
