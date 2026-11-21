import { useCallback, useEffect, useState } from "react"
import { api, hora, hoyISO, precio } from "../api"

const COLORES = {
  pendiente: "bg-amber-500/15 text-amber-300",
  confirmada: "bg-sky-500/15 text-sky-300",
  completada: "bg-emerald-500/15 text-emerald-300",
  cancelada: "bg-red-500/15 text-red-300",
}

// Lista de citas: el admin ve todas, cada barbero solo las suyas (lo decide el backend)
function Citas() {
  const [fecha, setfecha] = useState(hoyISO())
  const [estado, setestado] = useState("")
  const [citas, setcitas] = useState([])
  const [error, seterror] = useState("")
  const [cargando, setcargando] = useState(false)

  const cargar = useCallback(async () => {
    setcargando(true)
    seterror("")
    const params = new URLSearchParams()
    if (fecha) params.set("fecha", fecha)
    if (estado) params.set("estado", estado)
    try {
      setcitas(await api(`/api/citas?${params.toString()}`, { auth: true }))
    } catch (e) {
      seterror(e.message)
    } finally {
      setcargando(false)
    }
  }, [fecha, estado])

  useEffect(() => {
    cargar()
  }, [cargar])

  const cambiarEstado = async (id, nuevo) => {
    seterror("")
    try {
      await api(`/api/citas/${id}`, { metodo: "PATCH", cuerpo: { estado: nuevo }, auth: true })
      cargar()
    } catch (e) {
      seterror(e.message)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="etiqueta">Fecha</label>
          <input type="date" className="campo" value={fecha} onChange={(e) => setfecha(e.target.value)} />
        </div>
        <div>
          <label className="etiqueta">Estado</label>
          <select className="campo" value={estado} onChange={(e) => setestado(e.target.value)}>
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        <button className="btn-suave" onClick={() => setfecha(hoyISO())}>Hoy</button>
        <button className="btn-suave" onClick={() => setfecha("")}>Todas las fechas</button>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-xs uppercase tracking-widest text-neutral-400">
            <tr>
              <th className="px-5 py-4">Fecha</th>
              <th className="px-5 py-4">Cliente</th>
              <th className="px-5 py-4">Servicio</th>
              <th className="px-5 py-4">Barbero</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((c) => (
              <tr key={c.id} className="border-b border-white/5 align-top">
                <td className="px-5 py-4">
                  <span className="font-bold text-white">{hora(c.inicio)}</span>
                  <span className="block text-xs text-neutral-500">{new Date(c.inicio).toLocaleDateString("es-CO")}</span>
                </td>
                <td className="px-5 py-4">
                  {c.cliente_nombre}
                  <span className="block text-xs text-neutral-500">{c.cliente_telefono}</span>
                </td>
                <td className="px-5 py-4">
                  {c.servicio_nombre}
                  <span className="block text-xs text-neutral-500">{precio(c.servicio_precio)}</span>
                </td>
                <td className="px-5 py-4">{c.barbero_nombre}</td>
                <td className="px-5 py-4">
                  <span className={"rounded-full px-3 py-1 text-xs font-bold " + COLORES[c.estado]}>{c.estado}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {c.estado === "pendiente" && (
                      <button className="btn-suave" onClick={() => cambiarEstado(c.id, "confirmada")}>Confirmar</button>
                    )}
                    {(c.estado === "pendiente" || c.estado === "confirmada") && (
                      <>
                        <button className="btn-suave" onClick={() => cambiarEstado(c.id, "completada")}>Completar</button>
                        <button className="btn-suave" onClick={() => cambiarEstado(c.id, "cancelada")}>Cancelar</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!cargando && citas.length === 0 && (
          <p className="p-10 text-center text-sm text-neutral-500">No hay citas con esos filtros.</p>
        )}
      </div>
    </div>
  )
}

export default Citas
