import { Link, useNavigate } from "react-router-dom"
import { cerrarSesion, obtenerSesion } from "../api"

function Navbar() {
  const navigate = useNavigate()
  const sesion = obtenerSesion()
  const panel = sesion && sesion.rol === "admin" ? "/admin" : "/panel-barbero"

  const salir = () => {
    cerrarSesion()
    navigate("/")
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-wide text-white">
          <span className="text-amber-400">✂</span> Barbería
        </Link>
        <div className="flex items-center gap-3">
          {sesion && sesion.token ? (
            <>
              <Link to={panel} className="btn-suave">Mi panel</Link>
              <button onClick={salir} className="btn-suave">Salir</button>
            </>
          ) : (
            <Link to="/staff/login" className="btn-suave">Acceso personal</Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
