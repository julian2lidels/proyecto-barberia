function extraerRolDeJWT(token) {
  // El backend genera tokens de 2 partes: base64(payload).firma
  // (no es un JWT estándar de 3 partes)
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

// ... dentro de iniciarSesion:

const data = await api("/auth/login", {
  method: "POST",
  body: JSON.stringify({ usuario: username, password }),
})

const token = data?.token || data?.access_token || ""
// El backend ya devuelve "rol" en la respuesta. El token es de 2 partes (no JWT estándar).
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