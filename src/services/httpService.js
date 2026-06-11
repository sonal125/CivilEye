/**
 * httpService.js
 *
 * Centralized HTTP layer for CivilEye frontend → backend integration.
 *
 * - Uses fetch consistently
 * - Uses Vite env var VITE_API_BASE_URL (fallback: http://localhost:5001)
 * - Attaches Authorization: Bearer <token> automatically (if present)
 * - Normalizes backend error responses into a single thrown error shape
 * - Emits a global "civileye:unauthorized" event on 401 to enable redirect/logout
 */

const DEFAULT_BASE_URL = 'http://localhost:5001'

export const getApiBaseUrl = () => {
  return (import.meta?.env?.VITE_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '')
}

export const getStoredAuth = () => {
  const raw = localStorage.getItem('civileye_user')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const getAuthToken = () => {
  const auth = getStoredAuth()
  const token = auth?.token
  return token && typeof token === 'string' ? token : null
}

export class HttpError extends Error {
  /**
   * @param {string} message
   * @param {number} status
   * @param {any} details
   */
  constructor(message, status, details) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.details = details ?? null
  }
}

const emitUnauthorized = () => {
  try {
    window.dispatchEvent(new CustomEvent('civileye:unauthorized'))
  } catch {
    // ignore
  }
}

const parseJsonSafely = async (response) => {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

/**
 * Core request helper.
 *
 * @param {'GET'|'POST'|'PATCH'|'PUT'|'DELETE'} method
 * @param {string} path e.g. '/api/complaints'
 * @param {{
 *  query?: Record<string, string | number | boolean | undefined | null>,
 *  body?: any,
 *  headers?: Record<string, string>,
 *  auth?: boolean,
 *  isFormData?: boolean
 * }} opts
 */
export const request = async (method, path, opts = {}) => {
  const baseUrl = getApiBaseUrl()

  const query = opts.query || {}
  const queryString = Object.entries(query)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')

  const url = `${baseUrl}${path}${queryString ? `?${queryString}` : ''}`

  const headers = {
    ...(opts.headers || {})
  }

  if (opts.auth) {
    const token = getAuthToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const init = {
    method,
    headers
  }

  if (opts.body !== undefined) {
    if (opts.isFormData) {
      init.body = opts.body
      // Important: do NOT set Content-Type for FormData; browser adds boundary.
    } else {
      headers['Content-Type'] = headers['Content-Type'] || 'application/json'
      init.body = JSON.stringify(opts.body)
    }
  }

  let response
  try {
    response = await fetch(url, init)
  } catch (err) {
    throw new HttpError('Network error: Unable to reach server', 0, String(err?.message || err))
  }

  const payload = await parseJsonSafely(response)

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && payload.message) ||
      `Request failed (${response.status})`

    const details = (payload && typeof payload === 'object' && payload.details) || null

    if (response.status === 401) {
      localStorage.removeItem('civileye_user')
      emitUnauthorized()
    }

    throw new HttpError(message, response.status, details)
  }

  // Backend uses { success, message, data, meta } shape
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data
  }

  return payload
}
