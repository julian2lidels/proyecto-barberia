import Layout from "./components/Layout"
import Citas from "./pages/Citas"
import { obtenerSesion } from "./api"

function PanelBarbero() {
  const sesion = obtenerSesion()

  return (
    <Layout subtitulo="Panel del barbero" tituloNormal="Hola," tituloDestacado={sesion?.nombre || ""}>
      <Citas />
    </Layout>
  )
}

export default PanelBarbero
