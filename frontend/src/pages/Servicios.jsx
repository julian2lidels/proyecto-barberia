import { useEffect, useState } from "react"
import { api, precio } from "../api"

const VACIO = { nombre: "", descripcion: "", precio: "", duracion_min: "30", activo: true }

function Servicios() {
  const [servicios, setservicios] = useState([])
  const [form, setform] = useState(VACIO)
  const [editando, seteditando] = useState(null)
  const [error, seterror] = useState("")

  const cargar = () => {
    api("/api/admin/servicios", { auth: true })
      .then(setservicios)
      .catch((e) => seterror(e.message))
  }

  useEffect(() => {
    cargar()
  }, [])

  const guardar = async (e) => {
    e.preventDefault()
    seterror("")
    const cuerpo = {
      nombre: form.nombre,
      descripcion: form.descripcion || null,
      precio: Number(form.precio),
      duracion_min: Number(form.duracion_min),
      activo: form.activo,
    }
    try {
      if (editando) {
        await api(`/api/admin/servicios/${editando}`, { metodo: "PUT", cuerpo, auth: true })
      } else {
        await api("/api/admin/servicios", { metodo: "POST", cuerpo, auth: true })
      }
      setform(VACIO)
      seteditando(null)
      cargar()
    } catch (err) {
      seterror(err.message)
    }
  }

  const editar = (s) => {
    seteditando(s.id)
    setform({
      nombre: s.nombre,
      descripcion: s.descripcion || "",
      precio: String(s.precio),
      duracion_min: String(s.duracion_min),
      activo: s.activo,
    })
  }

  const cancelar = () => {
    seteditando(null)
    setform(VACIO)
    seterror("")
  }

  return (
    <div className="space-y-8">
      <form onSubmit={guardar} className="tarjeta grid gap-4 md:grid-cols-4">
        <div>
          <label className="etiqueta">Nombre</label>
          <input className="campo" value={form.nombre} onChange={(e) => setform({ ...form, nombre: e.target.value })} required />
        </div>
        <div className="md:col-span-2">
          <label className="etiqueta">Descripción</label>
          <input className="campo" value={form.descripcion} onChange={(e) => setform({ ...form, descripcion: e.target.value })} />
        </div>
        <div>
          <label className="etiqueta">Precio (COP)</label>
          <input type="number" min="1" className="campo" value={form.precio} onChange={(e) => setform({ ...form, precio: e.target.value })} required />
        </div>
        <div>
          <label className="etiqueta">Duración (min)</label>
          <input type="number" min="10" max="240" step="10" className="campo" value={form.duracion_min} onChange={(e) => setform({ ...form, duracion_min: e.target.value })} required />
        </div>
        <label className="flex items-center gap-2 self-end pb-3 text-sm text-neutral-300">
          <input type="checkbox" checked={form.activo} onChange={(e) => setform({ ...form, activo: e.target.checked })} />
          Visible para reservas
        </label>
        <div className="flex items-end gap-2 md:col-span-2">
          <button type="submit" className="btn">{editando ? "Guardar cambios" : "Agregar servicio"}</button>
          {editando && <button type="button" className="btn-suave py-3" onClick={cancelar}>Cancelar</button>}
        </div>
        {error && <p className="text-sm text-red-400 md:col-span-4">{error}</p>}
      </form>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-xs uppercase tracking-widest text-neutral-400">
            <tr>
              <th className="px-5 py-4">Servicio</th>
              <th className="px-5 py-4">Precio</th>
              <th className="px-5 py-4">Duración</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((s) => (
              <tr key={s.id} className="border-b border-white/5">
                <td className="px-5 py-4">
                  <span className="font-bold text-white">{s.nombre}</span>
                  <span className="block text-xs text-neutral-500">{s.descripcion}</span>
                </td>
                <td className="px-5 py-4">{precio(s.precio)}</td>
                <td className="px-5 py-4">{s.duracion_min} min</td>
                <td className="px-5 py-4">{s.activo ? "Activo" : "Oculto"}</td>
                <td className="px-5 py-4 text-right">
                  <button className="btn-suave" onClick={() => editar(s)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Servicios
