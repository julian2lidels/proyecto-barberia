import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "./components/Navbar"
import { api } from "./api"

function PanelAdmin() {
  const [citas, setCitas] = useState([])
  const [barberos, setBarberos] = useState([])
  const [servicios, setServicios] = useState([])
  const [clientes, setClientes] = useState([])

  useEffect(() => {
    api("/citas").then(setCitas).catch(() => {})
    api("/barberos").then(setBarberos).catch(() => {})
    api("/servicios").then(setServicios).catch(() => {})
    api("/clientes").then(setClientes).catch(() => {})
  }, [])

  const hoy = new Date().toISOString().split("T")[0]
  const citasHoy = citas.filter((c) => c.fecha === hoy && c.estado === "confirmada")

  return (
    <div className="min-h-screen bg-[#2F251E] text-[#F4EDE4]">
      <Navbar subtitulo="Administración General" tituloNormal="Panel" tituloDestacado="Barbería Monarca" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Resumen numérico */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          <div className="bg-[#382C23] border border-[#D4A359]/20 p-6 rounded-2xl">
            <p className="text-xs uppercase tracking-widest text-[#BFAEA0]">Citas Hoy</p>
            <p className="font-hairy-serif text-4xl font-bold text-[#D4A359] mt-2">{citasHoy.length}</p>
          </div>
          <div className="bg-[#382C23] border border-[#D4A359]/20 p-6 rounded-2xl">
            <p className="text-xs uppercase tracking-widest text-[#BFAEA0]">Especialistas Activos</p>
            <p className="font-hairy-serif text-4xl font-bold text-[#FAF3EA] mt-2">
              {barberos.filter((b) => b.activo).length}
            </p>
          </div>
          <div className="bg-[#382C23] border border-[#D4A359]/20 p-6 rounded-2xl">
            <p className="text-xs uppercase tracking-widest text-[#BFAEA0]">Servicios</p>
            <p className="font-hairy-serif text-4xl font-bold text-[#FAF3EA] mt-2">
              {servicios.filter((s) => s.activo).length}
            </p>
          </div>
          <div className="bg-[#382C23] border border-[#D4A359]/20 p-6 rounded-2xl">
            <p className="text-xs uppercase tracking-widest text-[#BFAEA0]">Clientes</p>
            <p className="font-hairy-serif text-4xl font-bold text-[#FAF3EA] mt-2">{clientes.length}</p>
          </div>
        </div>

        {/* Estado de los Barberos y Citas de Hoy */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-hairy-serif text-3xl font-bold text-[#FAF3EA]">Agenda del Día ({hoy})</h2>
          <Link to="/admin/citas" className="btn-hairy-ghost text-xs font-bold text-[#D4A359] hover:text-[#FFF1CE]">
            Ver todas las citas →
          </Link>
        </div>

        {citasHoy.length === 0 ? (
          <div className="bg-[#382C23] border border-[#D4A359]/15 rounded-2xl p-8 text-center text-sm text-[#BFAEA0]">
            No hay citas pendientes para hoy.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {citasHoy.map((c) => (
              <div key={c.id} className="bg-[#382C23] border border-[#D4A359]/20 rounded-2xl p-6">
                <div className="flex justify-between items-center text-xs text-[#D4A359] font-semibold mb-2">
                  <span>{c.hora_inicio?.slice(0, 5)} - {c.hora_fin?.slice(0, 5)}</span>
                  <span>{c.barbero_nombre}</span>
                </div>
                <h3 className="font-hairy-serif text-2xl font-bold text-[#FAF3EA]">{c.cliente_nombre}</h3>
                <p className="text-xs text-[#CFC2B4] mt-1">{c.servicio_nombre}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PanelAdmin