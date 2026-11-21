import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import { api, guardarSesion, obtenerSesion } from "./api"

function LoginStaff() {
  const navigate = useNavigate()
  const [usuario, setusuario] = useState("")
  const [password, setpassword] = useState("")
  const [error, seterror] = useState("")
  const [enviando, setenviando] = useState(false)

  const sesionActual = obtenerSesion()
  if (sesionActual && sesionActual.token) {
    return <Navigate to={sesionActual.rol === "admin" ? "/admin" : "/panel-barbero"} replace />
  }

  const entrar = async (e) => {
    e.preventDefault()
    seterror("")
    setenviando(true)
    try {
      const datos = await api("/api/auth/login", { metodo: "POST", cuerpo: { usuario, password } })
      guardarSesion(datos)
      navigate(datos.rol === "admin" ? "/admin" : "/panel-barbero")
    } catch (err) {
      seterror(err.message)
    } finally {
      setenviando(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto mt-16 max-w-md px-6">
        <div className="tarjeta">
          <h1 className="mb-1 text-2xl font-extrabold text-white">Acceso del personal</h1>
          <p className="mb-6 text-sm text-neutral-400">Ingresa con tu usuario de administrador o barbero.</p>
          <form onSubmit={entrar} className="space-y-4">
            <div>
              <label className="etiqueta">Usuario</label>
              <input className="campo" value={usuario} onChange={(e) => setusuario(e.target.value)} autoComplete="username" required />
            </div>
            <div>
              <label className="etiqueta">Contraseña</label>
              <input type="password" className="campo" value={password} onChange={(e) => setpassword(e.target.value)} autoComplete="current-password" required />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" className="btn w-full" disabled={enviando}>
              {enviando ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginStaff
