import { useEffect, useState } from "react"
import { api } from "../api"

const VACIO = { nombre: "", telefono: "", especialidad: "", usuario: "", password: "" }

function Barberos() {
  const [barberos, setbarberos] = useState([])
  const [form, setform] = useState(VACIO)
  const [error, seterror] = useState("")

  const cargar = () => {
    api("/api/admin/barberos", { auth: true })
      .then(setbarberos)
      .catch((e) => seterror(e.message))
  }

  useEffect(() => {
    cargar()
  }, [])

  const guardar = async (e) => {
    e.preventDefault()
    seterror("")
    try {
      await api("/api/admin/barberos", {
        metodo: "POST",
        auth: true,
        cuerpo: {
          nombre: form.nombre,
          telefono: form.telefono || null,
          especialidad: form.especialidad || null,
          usuario: form.usuario || null,
          password: form.password || null,
        },
      })
      setform(VACIO)
      cargar()
    } catch (err) {
      seterror(err.message)
    }
  }

  const alternarActivo = async (b) => {
    seterror("")
    try {
      await api(`/api/admin/barberos/${b.id}`, { metodo: "PUT", cuerpo: { activo: !b.activo }, auth: true })
      cargar()
    } catch (err) {
      seterror(err.message)
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={guardar} className="tarjeta grid gap-4 md:grid-cols-3">
        <div>
          <label className="etiqueta">Nombre</label>
          <input className="campo" value={form.nombre} onChange={(e) => setform({ ...form, nombre: e.target.value })} required />
        </div>
        <div>
          <label className="etiqueta">Teléfono</label>
          <input className="campo" value={form.telefono} onChange={(e) => setform({ ...form, telefono: e.target.value })} />
        </div>
        <div>
          <label className="etiqueta">Especialidad</label>
          <input className="campo" value={form.especialidad} onChange={(e) => setform({ ...form, especialidad: e.target.value })} />
        </div>
        <div>
          <label className="etiqueta">Usuario de acceso (opcional)</label>
          <input className="campo" value={form.usuario} onChange={(e) => setform({ ...form, usuario: e.target.value })} autoComplete="off" />
        </div>
        <div>
          <label className="etiqueta">Contraseña (mín. 6)</label>
          <input type="password" className="campo" value={form.password} onChange={(e) => setform({ ...form, password: e.target.value })} autoComplete="new-password" />
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn w-full">Agregar barbero</button>
        </div>
        {error && <p className="text-sm text-red-400 md:col-span-3">{error}</p>}
      </form>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-xs uppercase tracking-widest text-neutral-400">
            <tr>
              <th className="px-5 py-4">Barbero</th>
              <th className="px-5 py-4">Especialidad</th>
              <th className="px-5 py-4">Acceso al panel</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {barberos.map((b) => (
              <tr key={b.id} className="border-b border-white/5">
                <td className="px-5 py-4">
                  <span className="font-bold text-white">{b.nombre}</span>
                  <span className="block text-xs text-neutral-500">{b.telefono}</span>
                </td>
                <td className="px-5 py-4">{b.especialidad || "—"}</td>
                <td className="px-5 py-4">{b.usuario || "Sin acceso"}</td>
                <td className="px-5 py-4">{b.activo ? "Activo" : "Inactivo"}</td>
                <td className="px-5 py-4 text-right">
                  <button className="btn-suave" onClick={() => alternarActivo(b)}>
                    {b.activo ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Barberos
