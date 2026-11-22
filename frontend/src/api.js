const API_BASE = "/api"

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
    const mensaje =
      typeof errData.detail === "string"
        ? errData.detail
        : Array.isArray(errData.detail)
          ? errData.detail.map((e) => e.msg || JSON.stringify(e)).join(", ")
          : `Error ${response.status}`
    throw new Error(mensaje)
  }

  if (response.status === 204) return null
  return response.json()
}

export function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem("barberia_sesion") || "null")
  } catch {
    return null
  }
}