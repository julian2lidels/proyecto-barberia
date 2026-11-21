const CLAVE_SESION = "barberia_sesion"

export function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION))
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

function mensajeError(datos) {
  const detalle = datos && datos.detail
  if (typeof detalle === "string") return detalle
  if (Array.isArray(detalle) && detalle.length > 0) {
    return "Revisa los datos ingresados: " + (detalle[0].msg || "formato inválido")
  }
  return "Ocurrió un error, intenta de nuevo"
}

// Llama al backend (/api/...). Con auth:true envía el token del personal.
export async function api(ruta, { metodo = "GET", cuerpo, auth = false } = {}) {
  const headers = {}
  if (cuerpo !== undefined) headers["Content-Type"] = "application/json"
  if (auth) {
    const sesion = obtenerSesion()
    if (sesion && sesion.token) headers.Authorization = "Bearer " + sesion.token
  }

  let res
  try {
    res = await fetch(ruta, {
      method: metodo,
      headers,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    })
  } catch {
    throw new Error("No se pudo conectar con el servidor")
  }

  if (res.status === 401 && auth) {
    cerrarSesion()
    window.location.href = "/staff/login"
    throw new Error("Tu sesión venció, inicia sesión de nuevo")
  }

  let datos = null
  try {
    datos = await res.json()
  } catch {
    // respuesta sin cuerpo
  }
  if (!res.ok) throw new Error(mensajeError(datos))
  return datos
}

export function precio(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor)
}

export function fechaHora(iso) {
  return new Date(iso).toLocaleString("es-CO", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function hora(iso) {
  return new Date(iso).toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit" })
}

// Fecha de hoy (hora local del navegador) como AAAA-MM-DD
export function hoyISO() {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, "0")
  const dia = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${mes}-${dia}`
}
