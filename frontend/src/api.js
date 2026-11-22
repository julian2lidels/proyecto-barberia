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

export function hora(valor) {
  if (!valor) return ""
  return String(valor).slice(0, 5)
}

export function hoyISO() {
  return new Date().toISOString().split("T")[0]
}

export function precio(valor) {
  return `$${Number(valor || 0).toLocaleString("es-CO")}`
}