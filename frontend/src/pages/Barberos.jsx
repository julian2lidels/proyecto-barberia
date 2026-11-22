import { useCallback, useEffect, useState } from "react"
import Layout from "../components/Layout"
import { api } from "../api"

const VACIO = { nombre: "", telefono: "", especialidad: "", usuario: "", password: "" }

function Barberos() {
  const [barberos, setBarberos] = useState([])
  const [form, setForm] = useState(VACIO)
  const [error, setError] = useState("")
  const [ok, setOk] = useState("")

  const cargar = useCallback(() => {
    api("/api/admin/barberos", { auth: true })
      .then(setBarberos)
      .catch((e) => setError(e.message))
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const guardar = async (e) => {
    e.preventDefault()
    setError("")
    setOk("")
    const cuerpo = {
      nombre: form.nombre,
      telefono: form.telefono || null,
      especialidad: form.especialidad || null,
      activo: true,
      usuario: form.usuario || null,
      password: form.password || null,
    }
    try {
      await api("/api/admin/barberos", { metodo: "POST", cuerpo, auth: true })
      setOk(form.usuario ? `Barbero creado con acceso "${form.usuario}".` : "Barbero creado.")
      setForm(VACIO)
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  const alternarActivo = async (b) => {
    setError("")
    try {
      await api(`/api/admin/barberos/${b.id}`, { metodo: "PUT", cuerpo: { activo: !b.activo }, auth: true })
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  return (
    <Layout subtitulo="Equipo & Accesos" tituloNormal="Barberos &" tituloDestacado="Usuarios">
      <form onSubmit={guardar} className="tarjeta grid gap-4 md:grid-cols-5 mb-10">
        <div className="md:col-span-5">
          <h2 className="font-hairy-serif text-2xl font-bold text-[#FAF3EA]">Registrar barbero</h2>
          <p className="text-xs text-[#BFAEA0] mt-1">
            Si completas usuario y contraseña, el barbero podrá entrar al panel y ver solo sus citas.
          </p>
        </div>
        <div>
          <label className="etiqueta">Nombre</label>
          <input className="campo" value={form.nombre} onChange={cambiar("nombre")} required minLength={2} />
        </div>
        <div>
          <label className="etiqueta">Teléfono</label>
          <input className="campo" value={form.telefono} onChange={cambiar("telefono")} />
        </div>
        <div>
          <label className="etiqueta">Especialidad</label>
          <input className="campo" value={form.especialidad} onChange={cambiar("especialidad")} placeholder="Corte / Barba" />
        </div>
        <div>
          <label className="etiqueta">Usuario (opcional)</label>
          <input className="campo" value={form.usuario} onChange={cambiar("usuario")} minLength={3} autoComplete="off" />
        </div>
        <div>
          <label className="etiqueta">Contraseña (opcional)</label>
          <input type="password" className="campo" value={form.password} onChange={cambiar("password")} minLength={6} autoComplete="new-password" />
        </div>
        <div className="md:col-span-5 flex items-center gap-4">
          <button type="submit" className="btn">Guardar barbero</button>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {ok && <p className="text-sm text-emerald-300">{ok}</p>}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {barberos.map((b) => (
          <div key={b.id} className="bg-[#382C23] border border-[#D4A359]/20 rounded-2xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-hairy-serif text-2xl font-bold text-[#FAF3EA]">{b.nombre}</h3>
                <p className="text-xs text-[#D4A359] uppercase tracking-widest mt-1">{b.especialidad || "General"}</p>
              </div>
              <span className="text-xs font-semibold text-[#BFAEA0]">{b.activo ? "● Activo" : "○ Inactivo"}</span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#D4A359]/15 text-xs text-[#CFC2B4] space-y-1">
              <p>Tel: {b.telefono || "No registrado"}</p>
              <p>Acceso al panel: {b.usuario || "Sin acceso"}</p>
            </div>
            <button className="btn-suave mt-4" onClick={() => alternarActivo(b)}>
              {b.activo ? "Desactivar" : "Activar"}
            </button>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default Barberos
