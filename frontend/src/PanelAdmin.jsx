import { useEffect, useState } from "react"
import Navbar from "./components/Navbar"
import Citas from "./pages/Citas"
import Servicios from "./pages/Servicios"
import Barberos from "./pages/Barberos"
import Clientes from "./pages/Clientes"
import { api, precio } from "./api"

const PESTANAS = [
  { id: "citas", etiqueta: "Citas" },
  { id: "servicios", etiqueta: "Servicios" },
  { id: "barberos", etiqueta: "Barberos" },
  { id: "clientes", etiqueta: "Clientes" },
]

function PanelAdmin() {
  const [pestana, setpestana] = useState("citas")
  const [resumen, setresumen] = useState(null)

  useEffect(() => {
    api("/api/admin/resumen", { auth: true })
      .then(setresumen)
      .catch(() => setresumen(null))
  }, [pestana])

  const tarjetas = resumen
    ? [
        { titulo: "Citas de hoy", valor: resumen.citas_hoy },
        { titulo: "Pendientes", valor: resumen.pendientes },
        { titulo: "Clientes", valor: resumen.clientes },
        { titulo: "Ingresos del mes", valor: precio(resumen.ingresos_mes) },
      ]
    : []

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-8 text-3xl font-extrabold text-white">Panel de administración</h1>

        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {tarjetas.map((t) => (
            <div key={t.titulo} className="tarjeta">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">{t.titulo}</p>
              <p className="mt-2 text-2xl font-black text-amber-400">{t.valor}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto border-b border-white/10 pb-3">
          {PESTANAS.map((p) => (
            <button
              key={p.id}
              onClick={() => setpestana(p.id)}
              className={
                "rounded-lg px-4 py-2 text-sm font-bold transition " +
                (pestana === p.id ? "bg-amber-500 text-neutral-950" : "text-neutral-400 hover:text-white")
              }
            >
              {p.etiqueta}
            </button>
          ))}
        </div>

        {pestana === "citas" && <Citas />}
        {pestana === "servicios" && <Servicios />}
        {pestana === "barberos" && <Barberos />}
        {pestana === "clientes" && <Clientes />}
      </div>
    </div>
  )
}

export default PanelAdmin
