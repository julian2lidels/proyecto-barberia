import { Navigate } from "react-router-dom"
import { obtenerSesion } from "./api"

function RutaProtegida({ children, rolPermitido }) {
  const sesion = obtenerSesion()

  if (!sesion || !sesion.rol) {
    return <Navigate to="/staff/login" replace />
  }

  if (rolPermitido && sesion.rol !== rolPermitido) {
    return <Navigate to={sesion.rol === "admin" ? "/admin" : "/panel-barbero"} replace />
  }

  return children
}

export default RutaProtegida
