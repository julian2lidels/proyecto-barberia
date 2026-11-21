import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import PortalCliente from "./PortalCliente"
import LoginStaff from "./LoginStaff"
import PanelAdmin from "./PanelAdmin"
import PanelBarbero from "./PanelBarbero"
import RutaProtegida from "./RutaProtegida"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortalCliente />} />
        <Route path="/staff/login" element={<LoginStaff />} />
        <Route
          path="/admin"
          element={
            <RutaProtegida rolPermitido="admin">
              <PanelAdmin />
            </RutaProtegida>
          }
        />
        <Route
          path="/panel-barbero"
          element={
            <RutaProtegida rolPermitido="barbero">
              <PanelBarbero />
            </RutaProtegida>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
