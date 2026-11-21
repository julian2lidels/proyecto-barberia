import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import { api } from "../api"

const DIAS_SEMANA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

function Barberos() {
  const [barberos, setBarberos] = useState([])

  // Formulario Barbero
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [especialidad, setEspecialidad] = useState("")

  // Formulario Horario
  const [barberoHorarioId, setBarberoHorarioId] = useState("")
  const [diaSemana, setDiaSemana] = useState("1")
  const [horaInicio, setHoraInicio] = useState("09:00")
  const [horaFin, setHoraFin] = useState("19:00")

  // Formulario Usuario y Contraseña
  const [barberoUsuarioId, setBarberoUsuarioId] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rol, setRol] = useState("barbero")

  const cargarBarberos = () => {
    api("/barberos").then(setBarberos).catch(console.error)
  }

  useEffect(() => {
    cargarBarberos()
  }, [])

  const guardarBarbero = async (e) => {
    e.preventDefault()
    try {
      await api("/barberos", {
        method: "POST",
        body: JSON.stringify({ nombre, email, telefono, especialidad, activo: true }),
      })
      cargarBarberos()
      setNombre("")
      setEmail("")
      setTelefono("")
      setEspecialidad("")
    } catch (err) {
      alert(err.message || "Error al registrar barbero")
    }
  }

  const guardarHorario = async (e) => {
    e.preventDefault()
    try {
      await api("/horarios", {
        method: "POST",
        body: JSON.stringify({
          barbero_id: parseInt(barberoHorarioId, 10),
          dia_semana: parseInt(diaSemana, 10),
          hora_inicio: horaInicio,
          hora_fin: horaFin,
        }),
      })
      alert("Horario asignado correctamente.")
    } catch (err) {
      alert(err.message || "Error al asignar horario")
    }
  }

  const crearCuentaUsuario = async (e) => {
    e.preventDefault()
    try {
      await api("/usuarios", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
          rol,
          barbero_id: rol === "barbero" && barberoUsuarioId ? parseInt(barberoUsuarioId, 10) : null,
        }),
      })
      alert(`Cuenta "${username}" creada con éxito.`)
      setUsername("")
      setPassword("")
      setBarberoUsuarioId("")
    } catch (err) {
      alert(err.message || "Error al crear el usuario")
    }
  }

  return (
    <div className="min-h-screen bg-[#2F251E] text-[#F4EDE4]">
      <Navbar subtitulo="Equipo & Accesos" tituloNormal="Barberos &" tituloDestacado="Usuarios" />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* 1. Registrar Barbero */}
        <div className="bg-[#382C23] border border-[#D4A359]/20 p-8 rounded-2xl">
          <h2 className="font-hairy-serif text-2xl font-bold text-[#FAF3EA] mb-6">1. Registrar Especialista</h2>
          <form onSubmit={guardarBarbero} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#D4A359] mb-2">Nombre</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full bg-[#29201A] border border-[#D4A359]/25 rounded-lg p-3 text-sm" required />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#D4A359] mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#29201A] border border-[#D4A359]/25 rounded-lg p-3 text-sm" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#D4A359] mb-2">Teléfono</label>
              <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full bg-[#29201A] border border-[#D4A359]/25 rounded-lg p-3 text-sm" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#D4A359] mb-2">Especialidad</label>
              <input type="text" value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} className="w-full bg-[#29201A] border border-[#D4A359]/25 rounded-lg p-3 text-sm" placeholder="Corte / Barba" />
            </div>
            <div className="pb-2 text-center">
              <button type="submit" className="btn-hairy-ghost text-xs font-bold text-[#D4A359] hover:text-[#FFF1CE] pb-1 border-b border-[#D4A359]">
                Guardar Especialista →
              </button>
            </div>
          </form>
        </div>

        {/* 2. Crear Usuario y Contraseña */}
        <div className="bg-[#382C23] border border-[#D4A359]/20 p-8 rounded-2xl">
          <h2 className="font-hairy-serif text-2xl font-bold text-[#FAF3EA] mb-6">2. Crear Credenciales de Acceso (Usuario y Contraseña)</h2>
          <form onSubmit={crearCuentaUsuario} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#D4A359] mb-2">Rol</label>
              <select value={rol} onChange={(e) => setRol(e.target.value)} className="w-full bg-[#29201A] border border-[#D4A359]/25 rounded-lg p-3 text-sm">
                <option value="barbero">Barbero</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#D4A359] mb-2">Vincular a Barbero</label>
              <select
                value={barberoUsuarioId}
                onChange={(e) => setBarberoUsuarioId(e.target.value)}
                disabled={rol === "admin"}
                required={rol === "barbero"}
                className="w-full bg-[#29201A] border border-[#D4A359]/25 rounded-lg p-3 text-sm disabled:opacity-40"
              >
                <option value="">Selecciona barbero</option>
                {barberos.map((b) => (
                  <option key={b.id} value={b.id}>{b.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#D4A359] mb-2">Usuario</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[#29201A] border border-[#D4A359]/25 rounded-lg p-3 text-sm" placeholder="ej. carlos.barber" required />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#D4A359] mb-2">Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#29201A] border border-[#D4A359]/25 rounded-lg p-3 text-sm" placeholder="••••••••" required />
            </div>

            <div className="pb-2 text-center">
              <button type="submit" className="btn-hairy-ghost text-xs font-bold text-[#D4A359] hover:text-[#FFF1CE] pb-1 border-b border-[#D4A359]">
                Crear Usuario →
              </button>
            </div>
          </form>
        </div>

        {/* 3. Asignar Horario */}
        <div className="bg-[#382C23] border border-[#D4A359]/20 p-8 rounded-2xl">
          <h2 className="font-hairy-serif text-2xl font-bold text-[#FAF3EA] mb-6">3. Asignar Horario Semanal</h2>
          <form onSubmit={guardarHorario} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#D4A359] mb-2">Barbero</label>
              <select value={barberoHorarioId} onChange={(e) => setBarberoHorarioId(e.target.value)} className="w-full bg-[#29201A] border border-[#D4A359]/25 rounded-lg p-3 text-sm" required>
                <option value="" disabled>Seleccionar</option>
                {barberos.map((b) => (
                  <option key={b.id} value={b.id}>{b.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#D4A359] mb-2">Día</label>
              <select value={diaSemana} onChange={(e) => setDiaSemana(e.target.value)} className="w-full bg-[#29201A] border border-[#D4A359]/25 rounded-lg p-3 text-sm">
                {DIAS_SEMANA.map((dia, idx) => (
                  <option key={idx} value={idx}>{dia}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#D4A359] mb-2">Hora Inicio</label>
              <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} className="w-full bg-[#29201A] border border-[#D4A359]/25 rounded-lg p-3 text-sm" required />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#D4A359] mb-2">Hora Fin</label>
              <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} className="w-full bg-[#29201A] border border-[#D4A359]/25 rounded-lg p-3 text-sm" required />
            </div>
            <div className="pb-2 text-center">
              <button type="submit" className="btn-hairy-ghost text-xs font-bold text-[#D4A359] hover:text-[#FFF1CE] pb-1 border-b border-[#D4A359]">
                Asignar Horario →
              </button>
            </div>
          </form>
        </div>

        {/* Listado de Especialistas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {barberos.map((b) => (
            <div key={b.id} className="bg-[#382C23] border border-[#D4A359]/20 rounded-2xl p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-hairy-serif text-2xl font-bold text-[#FAF3EA]">{b.nombre}</h3>
                  <p className="text-xs text-[#D4A359] uppercase tracking-widest mt-1">{b.especialidad || "General"}</p>
                </div>
                <span className="text-xs font-semibold text-[#BFAEA0]">
                  {b.activo ? "● Activo" : "○ Inactivo"}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-[#D4A359]/15 text-xs text-[#CFC2B4] space-y-1">
                <p>Tel: {b.telefono || "No registrado"}</p>
                <p>Email: {b.email || "No registrado"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Barberos