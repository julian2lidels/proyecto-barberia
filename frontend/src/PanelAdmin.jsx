import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Layout from "./components/Layout"
import { api, hora, hoyISO, precio } from "./api"

function PanelAdmin() {
  const [resumen, setResumen] = useState(null)
  const [citas, setCitas] = useState([])
  const [error, setError] = useState("")
  const hoy = hoyISO()

  useEffect(() => {
    api("/api/admin/resumen", { auth: true })
      .then(setResumen)
      .catch((e) => setError(e.message))
    api(`/api/citas?fecha=${hoy}`, { auth: true })
      .then((lista) => setCitas(lista.filter((c) => c.estado !== "cancelada")))
      .catch((e) => setError(e.message))
  }, [hoy])

  const tarjetas = [
    { titulo: "Citas hoy", valor: resumen?.citas_hoy, destacado: true },
    { titulo: "Pendientes por confirmar", valor: resumen?.pendientes },
    { titulo: "Clientes", valor: resumen?.clientes },
    { titulo: "Ingresos del mes", valor: resumen ? precio(resumen.ingresos_mes) : undefined },
  ]

  return (
    <Layout subtitulo="Administración General" tituloNormal="Panel" tituloDestacado="Barbería Monarca">
      {error && <p className="mb-6 text-sm text-red-400">{error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        {tarjetas.map((t) => (
          <div key={t.titulo} className="bg-[#382C23] border border-[#D4A359]/20 p-6 rounded-2xl">
            <p className="text-xs uppercase tracking-widest text-[#BFAEA0]">{t.titulo}</p>
            <p className={`font-hairy-serif text-4xl font-bold mt-2 ${t.destacado ? "text-[#D4A359]" : "text-[#FAF3EA]"}`}>
              {t.valor ?? "—"}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="font-hairy-serif text-3xl font-bold text-[#FAF3EA]">Agenda del día ({hoy})</h2>
        <Link to="/admin/citas" className="btn-hairy-ghost text-xs font-bold text-[#D4A359] hover:text-[#FFF1CE]">
          Ver todas las citas →
        </Link>
      </div>

      {citas.length === 0 ? (
        <div className="bg-[#382C23] border border-[#D4A359]/15 rounded-2xl p-8 text-center text-sm text-[#BFAEA0]">
          No hay citas para hoy.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {citas.map((c) => (
            <div key={c.id} className="bg-[#382C23] border border-[#D4A359]/20 rounded-2xl p-6">
              <div className="flex justify-between items-center text-xs text-[#D4A359] font-semibold mb-2">
                <span>{hora(c.inicio)} - {hora(c.fin)}</span>
                <span>{c.barbero_nombre}</span>
              </div>
              <h3 className="font-hairy-serif text-2xl font-bold text-[#FAF3EA]">{c.cliente_nombre}</h3>
              <p className="text-xs text-[#CFC2B4] mt-1">{c.servicio_nombre} · {c.estado}</p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}

export default PanelAdmin
