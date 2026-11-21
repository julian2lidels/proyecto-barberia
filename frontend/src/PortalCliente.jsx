import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "./api"

function PortalCliente() {
  const [barberos, setBarberos] = useState([])
  const [servicios, setServicios] = useState([])
  const [errorCarga, setErrorCarga] = useState("")

  const [nombreCliente, setNombreCliente] = useState("")
  const [telefonoCliente, setTelefonoCliente] = useState("")
  const [barberoId, setBarberoId] = useState("")
  const [servicioId, setServicioId] = useState("")
  const [fecha, setFecha] = useState("")
  const [horaInicio, setHoraInicio] = useState("")
  const [notas, setNotas] = useState("")
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" })

  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api("/publico/barberos"),
      api("/publico/servicios"),
    ])
      .then(([dataBarberos, dataServicios]) => {
        setBarberos(dataBarberos || [])
        setServicios(dataServicios || [])
        setErrorCarga("")
      })
      .catch((err) => {
        setErrorCarga(err.message || "No se pudo cargar el catálogo en este momento.")
      })
  }, [])

  const irASeccion = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  const reservarTurno = async (e) => {
    e.preventDefault()
    setMensaje({ tipo: "", texto: "" })

    try {
      await api("/publico/reservar", {
        method: "POST",
        body: JSON.stringify({
          nombre_cliente: nombreCliente,
          telefono_cliente: telefonoCliente,
          barbero_id: parseInt(barberoId, 10),
          servicio_id: parseInt(servicioId, 10),
          fecha,
          hora_inicio: horaInicio,
          notas,
        }),
      })
      setMensaje({
        tipo: "ok",
        texto: "Tu cita en Hairy ha sido reservada con éxito. Te esperamos.",
      })
      setNombreCliente("")
      setTelefonoCliente("")
      setBarberoId("")
      setServicioId("")
      setFecha("")
      setHoraInicio("")
      setNotas("")
    } catch (err) {
      setMensaje({
        tipo: "error",
        texto: err.message || "Ese horario no está disponible con el especialista elegido.",
      })
    }
  }

  return (
    <div id="inicio" className="min-h-screen bg-[#2F251E] text-[#F4EDE4] selection:bg-[#D4A359] selection:text-[#231B15]">
      {/* Encabezado limpio estilo Hairy con botones sin recuadro */}
      <header className="sticky top-0 z-50 bg-[#29201A]/90 backdrop-blur-md border-b border-[#D4A359]/20">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <button
            onClick={() => irASeccion("inicio")}
            className="btn-hairy-ghost text-left group"
          >
            <span className="block font-hairy-serif text-2xl sm:text-3xl font-bold tracking-[0.25em] text-[#F7F0E6] group-hover:text-[#D4A359] transition-colors">
              HAIRY
            </span>
            <span className="block text-[9px] tracking-[0.35em] text-[#D4A359] mt-0.5">
              BARBERÍA &amp; SALÓN
            </span>
          </button>

          <nav className="flex items-center gap-6 sm:gap-9 text-xs font-semibold">
            <button onClick={() => irASeccion("inicio")} className="btn-hairy-ghost">
              Inicio
            </button>
            <button onClick={() => irASeccion("servicios")} className="btn-hairy-ghost">
              Servicios
            </button>
            <button onClick={() => irASeccion("barberos")} className="btn-hairy-ghost">
              Especialistas
            </button>
            <button
              onClick={() => irASeccion("reservar")}
              className="btn-hairy-ghost text-[#D4A359] hover:text-[#FCE2A6] active:text-[#B58338]"
            >
              Reservar Cita
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Editorial Hairy */}
      <section className="relative py-24 sm:py-32 px-6 text-center bg-gradient-to-b from-[#3D3026] via-[#342921] to-[#2F251E] border-b border-[#D4A359]/15">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          {/* Ornamento dorado clásico */}
          <div className="flex items-center gap-4 mb-6 text-[#D4A359]">
            <span className="h-[1px] w-12 bg-[#D4A359]/50"></span>
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="6" cy="18" r="2.5" />
              <circle cx="18" cy="18" r="2.5" />
              <path d="M7.8 16.2L19 4M16.2 16.2L5 4" />
            </svg>
            <span className="h-[1px] w-12 bg-[#D4A359]/50"></span>
          </div>

          <p className="text-xs font-semibold text-[#D4A359] uppercase tracking-[0.38em] mb-4">
            Barbería Clásica &amp; Salón de Belleza
          </p>

          <h1 className="font-hairy-serif text-5xl sm:text-7xl font-bold text-[#FAF3EA] leading-tight">
            El Arte del <span className="italic text-[#D4A359]">Estilo</span> y el Cuidado
          </h1>

          <p className="text-[#CFC2B4] text-sm sm:text-base mt-6 max-w-xl leading-relaxed">
            Cortes de precisión, ritual de barba tradicional y tratamientos capilares diseñados a tu medida. Agenda tu sesión sin filas ni esperas.
          </p>

          {/* Botones sin recuadro en el hero */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-10">
            <button
              onClick={() => irASeccion("reservar")}
              className="btn-hairy-ghost text-sm font-bold text-[#D4A359] hover:text-[#FFF1CE] active:text-[#A97832] pb-1 border-b border-[#D4A359]"
            >
              Agendar Turno →
            </button>
            <button
              onClick={() => irASeccion("servicios")}
              className="btn-hairy-ghost text-sm font-semibold text-[#E6DDD3] hover:text-[#D4A359] active:text-[#A97832]"
            >
              Explorar Carta de Servicios
            </button>
          </div>
        </div>
      </section>

      {/* Mensaje de error si falla conexión */}
      {errorCarga && (
        <div className="max-w-4xl mx-auto mt-8 px-6">
          <p className="text-center text-xs text-[#E8998D] bg-[#3E2620] border border-[#E8998D]/30 py-3 px-4 rounded-lg">
            {errorCarga}
          </p>
        </div>
      )}

      {/* Carta de Servicios */}
      <section id="servicios" className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-[#D4A359] uppercase tracking-[0.35em]">
            Carta de Tratamientos
          </p>
          <h2 className="font-hairy-serif text-4xl sm:text-5xl font-bold text-[#FAF3EA] mt-2">
            Servicios &amp; Tarifas
          </h2>
          <div className="w-16 h-[1px] bg-[#D4A359]/60 mx-auto mt-5"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-8">
          {servicios.map((s) => (
            <div
              key={s.id}
              onClick={() => {
                setServicioId(String(s.id))
                irASeccion("reservar")
              }}
              className="group cursor-pointer pb-5 border-b border-[#D4A359]/20 hover:border-[#D4A359] transition-colors flex justify-between items-start gap-4"
            >
              <div>
                <h3 className="font-hairy-serif text-2xl font-semibold text-[#F7F0E6] group-hover:text-[#D4A359] transition-colors">
                  {s.nombre}
                </h3>
                <p className="text-xs text-[#BFAEA0] mt-1.5 leading-relaxed">
                  {s.descripcion || "Atención personalizada de barbería y salón"} ·{" "}
                  <span className="text-[#D4A359]/90">{s.duracion_minutos} min</span>
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="font-hairy-serif text-2xl font-bold text-[#D4A359] block">
                  ${Number(s.precio).toLocaleString()}
                </span>
                <span className="btn-hairy-ghost text-[10px] text-[#BFAEA0] group-hover:text-[#F7F0E6]">
                  Elegir
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Equipo de Especialistas / Barberos */}
      <section id="barberos" className="bg-[#382C23] border-y border-[#D4A359]/15 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-[#D4A359] uppercase tracking-[0.35em]">
              Nuestros Profesionales
            </p>
            <h2 className="font-hairy-serif text-4xl sm:text-5xl font-bold text-[#FAF3EA] mt-2">
              Barberos &amp; Estilistas
            </h2>
            <div className="w-16 h-[1px] bg-[#D4A359]/60 mx-auto mt-5"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {barberos.map((b) => (
              <div
                key={b.id}
                onClick={() => {
                  setBarberoId(String(b.id))
                  irASeccion("reservar")
                }}
                className="group cursor-pointer bg-[#2F251E] p-8 rounded-2xl border border-[#D4A359]/15 hover:border-[#D4A359]/60 transition-all text-center"
              >
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#3D3026] border border-[#D4A359]/40 flex items-center justify-center font-hairy-serif text-3xl font-bold text-[#D4A359] group-hover:border-[#D4A359] transition-colors">
                  {b.nombre?.charAt(0)}
                </div>
                <h3 className="font-hairy-serif text-2xl font-bold text-[#FAF3EA] group-hover:text-[#D4A359] transition-colors">
                  {b.nombre}
                </h3>
                <p className="text-xs text-[#BFAEA0] uppercase tracking-[0.2em] mt-1.5">
                  {b.especialidad || "Barbero & Estilista"}
                </p>
                <div className="mt-6">
                  <span className="btn-hairy-ghost text-xs font-semibold text-[#D4A359] group-hover:text-[#FFF1CE]">
                    Reservar con {b.nombre?.split(" ")[0]} →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario de Reserva */}
      <section id="reservar" className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-[#D4A359] uppercase tracking-[0.35em]">
            Agenda en Línea
          </p>
          <h2 className="font-hairy-serif text-4xl sm:text-5xl font-bold text-[#FAF3EA] mt-2">
            Reserva tu Sesión
          </h2>
          <div className="w-16 h-[1px] bg-[#D4A359]/60 mx-auto mt-5"></div>
        </div>

        {mensaje.texto && (
          <div
            className={`mb-8 p-4 rounded-xl text-center text-sm font-medium border ${
              mensaje.tipo === "ok"
                ? "bg-[#263528] border-[#76C882]/40 text-[#B4EEBC]"
                : "bg-[#3E2520] border-[#E8998D]/40 text-[#F5BEB5]"
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        <form
          onSubmit={reservarTurno}
          className="bg-[#382C23] border border-[#D4A359]/20 p-8 sm:p-12 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-7"
        >
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A359] mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              className="w-full bg-[#29201A] border border-[#D4A359]/25 text-[#F4EDE4] rounded-lg p-3.5 focus:outline-none focus:border-[#D4A359]"
              placeholder="Ej. Julián Medina"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A359] mb-2">
              Teléfono / WhatsApp
            </label>
            <input
              type="tel"
              value={telefonoCliente}
              onChange={(e) => setTelefonoCliente(e.target.value)}
              className="w-full bg-[#29201A] border border-[#D4A359]/25 text-[#F4EDE4] rounded-lg p-3.5 focus:outline-none focus:border-[#D4A359]"
              placeholder="300 123 4567"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A359] mb-2">
              Servicio
            </label>
            <select
              value={servicioId}
              onChange={(e) => setServicioId(e.target.value)}
              className="w-full bg-[#29201A] border border-[#D4A359]/25 text-[#F4EDE4] rounded-lg p-3.5 focus:outline-none focus:border-[#D4A359]"
              required
            >
              <option value="" disabled>Selecciona un tratamiento</option>
              {servicios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre} — ${Number(s.precio).toLocaleString()} ({s.duracion_minutos} min)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A359] mb-2">
              Especialista
            </label>
            <select
              value={barberoId}
              onChange={(e) => setBarberoId(e.target.value)}
              className="w-full bg-[#29201A] border border-[#D4A359]/25 text-[#F4EDE4] rounded-lg p-3.5 focus:outline-none focus:border-[#D4A359]"
              required
            >
              <option value="" disabled>Selecciona un especialista</option>
              {barberos.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nombre} {b.especialidad ? `(${b.especialidad})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A359] mb-2">
              Fecha
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full bg-[#29201A] border border-[#D4A359]/25 text-[#F4EDE4] rounded-lg p-3.5 focus:outline-none focus:border-[#D4A359]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A359] mb-2">
              Hora
            </label>
            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className="w-full bg-[#29201A] border border-[#D4A359]/25 text-[#F4EDE4] rounded-lg p-3.5 focus:outline-none focus:border-[#D4A359]"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A359] mb-2">
              Preferencias o Notas (Opcional)
            </label>
            <input
              type="text"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="w-full bg-[#29201A] border border-[#D4A359]/25 text-[#F4EDE4] rounded-lg p-3.5 focus:outline-none focus:border-[#D4A359]"
              placeholder="Ej. Corte clásico con tijera, arreglo de barba, hidratación..."
            />
          </div>

          {/* Botón sin recuadro que cambia de color al pasar el cursor y al oprimir */}
          <div className="md:col-span-2 pt-4 text-center">
            <button
              type="submit"
              className="btn-hairy-ghost text-base font-bold text-[#D4A359] hover:text-[#FFF1CE] active:text-[#A97832] pb-1.5 border-b border-[#D4A359] hover:border-[#FFF1CE]"
            >
              Confirmar Reserva →
            </button>
          </div>
        </form>
      </section>

      {/* Pie de página discreto con acceso oculto para personal */}
      <footer className="border-t border-[#D4A359]/15 py-10 text-center text-xs text-[#A8988A]">
        <p className="font-hairy-serif text-base tracking-[0.25em] text-[#D4A359] mb-2">
          Barbería Monarca &amp; Barberia
        </p>
        <p>
          Julian Medina y Julian Moreno{" "}
          <span
            onDoubleClick={() => navigate("/staff/login")}
            className="cursor-default select-none"
          >
            © 2026
          </span>
        </p>
      </footer>
    </div>
  )
}

export default PortalCliente