import { Navigate } from "react-router-dom"

function RutaProtegida({ children, rolPermitido }) {
  const sesion = JSON.parse(localStorage.getItem("barberia_sesion") || "null")

  if (!sesion || !sesion.rol) {
    return <Navigate to="/staff/login" replace />
  }

  if (rolPermitido && sesion.rol !== rolPermitido) {
    return <Navigate to={sesion.rol === "admin" ? "/admin" : "/panel-barbero"} replace />
  }

  return children
}

export default RutaProtegida