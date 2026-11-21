const API_BASE = "/api/barberia"

export async function api(endpoint, options = {}) {
  const sesion = JSON.parse(localStorage.getItem("barberia_sesion") || "{}")
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  }

  if (sesion.token || sesion.access_token) {
    headers["Authorization"] = `Bearer ${sesion.token || sesion.access_token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error(errData.detail || `Error ${response.status}`)
  }

  if (response.status === 204) return null
  return response.json()
}