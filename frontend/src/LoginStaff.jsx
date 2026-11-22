const iniciarSesion = async (e) => {
  e.preventDefault()
  setError("")

  try {
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

    if (!rol) {
      setError("No se pudo obtener el rol de la sesión.")
      return
    }

    const sesionGuardada = {
      ...data,
      token,
      rol,
      username: data?.usuario || data?.username || username,
      nombre: data?.nombre || (username === "admin" ? "Administrador" : username),
    }

    localStorage.setItem("barberia_sesion", JSON.stringify(sesionGuardada))
    localStorage.setItem("sesion", JSON.stringify(sesionGuardada))
    if (token) localStorage.setItem("token", token)

    if (rol === "admin") {
      navigate("/admin")
    } else {
      navigate("/panel-barbero")
    }
  } catch (err) {
    setError(err.message || "Usuario o contraseña incorrectos")
  }
}