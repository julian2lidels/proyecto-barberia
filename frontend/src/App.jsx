import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import PortalCliente from "./PortalCliente"
import LoginStaff from "./LoginStaff"
import PanelAdmin from "./PanelAdmin"
import PanelBarbero from "./PanelBarbero"
import RutaProtegida from "./RutaProtegida"
import Barberos from "./pages/Barberos"
import Citas from "./pages/Citas"
import Servicios from "./pages/Servicios"
import Clientes from "./pages/Clientes"
import Layout from "./components/Layout"

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
          path="/admin/barberos"
          element={
            <RutaProtegida rolPermitido="admin">
              <Barberos />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/citas"
          element={
            <RutaProtegida rolPermitido="admin">
              <Layout subtitulo="Agenda" tituloNormal="Todas las" tituloDestacado="Citas">
                <Citas />
              </Layout>
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/servicios"
          element={
            <RutaProtegida rolPermitido="admin">
              <Servicios />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/clientes"
          element={
            <RutaProtegida rolPermitido="admin">
              <Clientes />
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