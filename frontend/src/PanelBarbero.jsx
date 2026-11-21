import Navbar from "./components/Navbar"
import Citas from "./pages/Citas"
import { obtenerSesion } from "./api"

function PanelBarbero() {
  const sesion = obtenerSesion()

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Panel del barbero</p>
        <h1 className="mb-8 mt-2 text-3xl font-extrabold text-white">Hola, {sesion ? sesion.nombre : ""}</h1>
        <Citas />
      </div>
    </div>
  )
}

export default PanelBarbero
