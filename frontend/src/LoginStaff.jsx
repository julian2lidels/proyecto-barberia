function extraerRolDeJWT(token) {

  try {
    const partes = token.split(".")
    const payloadB64 = partes.length >= 2 ? partes[0] : partes[0]
    // Añadir padding si hace falta para atob
    const padded = payloadB64 + "=".repeat((4 - (payloadB64.length % 4)) % 4)
    const payload = JSON.parse(atob(padded))
    return payload.rol || payload.role || null
  } catch {
    return null
  }
}

const data = await api("/auth/login", {
  method: "POST",
  body: JSON.stringify({ usuario: username, password }),
})

const token = data?.token || data?.access_token || ""

const rol =
  data?.rol ||
  data?.usuario?.rol ||
  (token ? extraerRolDeJWT(token) : null) ||
  (username === "admin" ? "admin" : "barbero")

const sesionGuardada = {
  ...data,
  token,
  rol,
  username: data?.usuario || data?.username || username,
  nombre: data?.nombre || (username === "admin" ? "Administrador" : username),
}