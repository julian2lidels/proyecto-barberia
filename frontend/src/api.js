const CLAVE_SESION = "barberia_sesion"

export function obtenerSesion() {
  try {
    const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION) || "null")
    return sesion && sesion.token ? sesion : null
  } catch {
    return null
  }
}

export function guardarSesion(sesion) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION)
}

/**
 * Llama al backend (mismo origen: Nginx reenvía /api al FastAPI).
 * api("/api/servicios")
 * api("/api/admin/servicios", { metodo: "POST", cuerpo: {...}, auth: true })
 */
export async function api(endpoint, { metodo = "GET", cuerpo, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" }

  if (auth) {
    const sesion = obtenerSesion()
    if (sesion) headers.Authorization = `Bearer ${sesion.token}`
  }

  const respuesta = await fetch(endpoint, {
    method: metodo,
    headers,
    body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
  })

  if (!respuesta.ok) {
    // Sesión vencida: se limpia y se vuelve al login
    if (respuesta.status === 401 && auth) {
      cerrarSesion()
      window.location.href = "/staff/login"
    }
    const datos = await respuesta.json().catch(() => ({}))
    let detalle = datos.detail || datos.error
    if (Array.isArray(detalle)) detalle = detalle.map((d) => d.msg).join(". ")
    throw new Error(detalle || `Error ${respuesta.status}`)
  }

  if (respuesta.status === 204) return null
  return respuesta.json()
}

// "2026-11-21T14:30:00" -> "14:30"
export function hora(valor) {
  const m = String(valor || "").match(/(\d{2}):(\d{2})/)
  return m ? `${m[1]}:${m[2]}` : ""
}

// Fecha de hoy en hora LOCAL (toISOString usa UTC y de noche daba el día siguiente)
export function hoyISO() {
  const d = new Date()
  const dos = (n) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`
}

export function precio(valor) {
  return `$${Number(valor || 0).toLocaleString("es-CO")}`
}
