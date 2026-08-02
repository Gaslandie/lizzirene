const API_BASE = (import.meta.env.VITE_API_BASE || '/api/v1').replace(/\/$/, '')

let csrfToken = null
let sessionPromise = null

export class ApiError extends Error {
  constructor(message, { code = 'api_error', status = 0, fields = {} } = {}) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.fields = fields
  }
}

const readResponse = async (response) => {
  const contentType = response.headers.get('content-type') || ''
  let payload = null

  if (contentType.includes('application/json')) {
    payload = await response.json().catch(() => null)
  }

  if (!response.ok) {
    const error = payload?.error
    throw new ApiError(
      error?.message || 'Le service est momentanément indisponible.',
      {
        code: error?.code || 'http_error',
        status: response.status,
        fields: error?.fields || {},
      },
    )
  }

  if (!payload || !Object.hasOwn(payload, 'data')) {
    throw new ApiError('La réponse du serveur est invalide.', {
      code: 'invalid_response',
      status: response.status,
    })
  }

  return payload.data
}

const rawRequest = async (path, options = {}) => {
  const headers = new Headers(options.headers || {})
  let body = options.body

  if (body !== undefined && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      body,
      headers,
      credentials: 'same-origin',
    })
    return await readResponse(response)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      'Connexion impossible. Vérifiez votre réseau puis réessayez.',
      { code: 'network_error' },
    )
  }
}

export const fetchSession = async ({ force = false } = {}) => {
  if (sessionPromise && !force) return sessionPromise
  sessionPromise = rawRequest('/session', { method: 'GET' })
    .then((session) => {
      csrfToken = session.csrfToken || null
      return session
    })
    .finally(() => {
      sessionPromise = null
    })
  return sessionPromise
}

export const apiRequest = async (
  path,
  { method = 'GET', body, headers, retryCsrf = true } = {},
) => {
  const verb = method.toUpperCase()
  const mutation = !['GET', 'HEAD'].includes(verb)
  const requestHeaders = new Headers(headers || {})

  if (mutation) {
    if (!csrfToken) await fetchSession()
    if (csrfToken) requestHeaders.set('X-CSRF-Token', csrfToken)
  }

  try {
    const data = await rawRequest(path, {
      method: verb,
      body,
      headers: requestHeaders,
    })
    if (data?.csrfToken) csrfToken = data.csrfToken
    return data
  } catch (error) {
    if (mutation && retryCsrf && error instanceof ApiError && error.status === 419) {
      await fetchSession({ force: true })
      return apiRequest(path, {
        method: verb,
        body,
        headers,
        retryCsrf: false,
      })
    }
    throw error
  }
}

export const apiUpload = async (path, formData) =>
  apiRequest(path, { method: 'POST', body: formData })

export const apiBase = API_BASE
