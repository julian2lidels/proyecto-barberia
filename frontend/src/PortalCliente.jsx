import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { api, hoyISO } from "./api"

const IMAGEN_LOCAL = `${import.meta.env.BASE_URL}fondo-barberia.jpg`
const IMAGEN_RESPALDO = "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1920&q=80"

function PortalCliente() {
  const [barberos, setBarberos] = useState([])
  const [servicios, setServicios] = useState([])
  const [errorCarga, setErrorCarga] = useState("")
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [fondoUrl, setFondoUrl] = useState(IMAGEN_LOCAL)

  const [nombreCliente, setNombreCliente] = useState("")
  const [telefonoCliente, setTelefonoCliente] = useState("")
  const [barberoId, setBarberoId] = useState("")
  const [servicioId, setServicioId] = useState("")
  const [fecha, setFecha] = useState("")
  const [horaInicio, setHoraInicio] = useState("")
  const [horarios, setHorarios] = useState([])
  const [notas, setNotas] = useState("")
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" })

  const navigate = useNavigate()

  useEffect(() => {
    const img = new Image()
    img.src = IMAGEN_LOCAL
    img.onerror = () => setFondoUrl(IMAGEN_RESPALDO)
  }, [])

  useEffect(() => {
    Promise.all([
      api("/api/barberos"),
      api("/api/servicios"),
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

  // Horas libres del barbero para el servicio y la fecha elegidos
  useEffect(() => {
    setHoraInicio("")
    if (!barberoId || !servicioId || !fecha) {
      setHorarios([])
      return
    }
    api(`/api/disponibilidad?id_barbero=${barberoId}&id_servicio=${servicioId}&fecha=${fecha}`)
      .then((d) => setHorarios(d.horarios || []))
      .catch(() => setHorarios([]))
  }, [barberoId, servicioId, fecha])

  const irASeccion = (id) => {
    setMenuAbierto(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  const reservarTurno = async (e) => {
    e.preventDefault()
    setMensaje({ tipo: "", texto: "" })

    try {
      await api("/api/citas", {
        metodo: "POST",
        cuerpo: {
          nombre: nombreCliente,
          telefono: telefonoCliente,
          id_barbero: parseInt(barberoId, 10),
          id_servicio: parseInt(servicioId, 10),
          inicio: `${fecha}T${horaInicio}:00`,
          notas: notas || null,
        },
      })
      setMensaje({
        tipo: "ok",
        texto: "Tu cita en Barbería Monarca ha sido reservada con éxito. Te esperamos.",
      })
      setNombreCliente("")
      setTelefonoCliente("")
      setBarberoId("")
      setServicioId("")
      setFecha("")
      setHoraInicio("")
      setHorarios([])
      setNotas("")
    } catch (err) {
      setMensaje({
        tipo: "error",
        texto: err.message || "Ese horario no está disponible con el barbero elegido.",
      })
    }
  }

  return (
    <div id="inicio" className="min-h-screen bg-[#0E0D0C] text-[#F4EDE4] selection:bg-[#D4A359] selection:text-[#0E0D0C]">
      {/* Encabezado responsive con menú móvil */}
      <header className="sticky top-0 z-50 bg-[#0E0D0C]/85 backdrop-blur-md border-b border-[#D4A359]/20">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => irASeccion("inicio")}
            className="btn-hairy-ghost text-left group"
          >
            <span className="block font-hairy-serif text-xl sm:text-2xl font-bold tracking-[0.22em] text-[#FAF3EA] group-hover:text-[#D4A359] transition-colors">
              BARBERÍA MONARCA
            </span>
            <span className="block text-[9px] tracking-[0.34em] text-[#D4A359]">
              CORTE CLÁSICO &amp; BARBA
            </span>
          </button>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold">
            <button onClick={() => irASeccion("inicio")} className="btn-hairy-ghost">
              Inicio
            </button>
            <button onClick={() => irASeccion("servicios")} className="btn-hairy-ghost">
              Servicios
            </button>
            <button onClick={() => irASeccion("barberos")} className="btn-hairy-ghost">
              Barberos
            </button>
            <button
              onClick={() => irASeccion("reservar")}
              className="btn-hairy-ghost text-[#D4A359] hover:text-[#FCE2A6]"
            >
              Reservar Cita
            </button>
          </nav>

          {/* Botón Menú Móvil */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Abrir menú"
            className="md:hidden btn-hairy-ghost text-[#D4A359] p-2"
          >
            {menuAbierto ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Menú desplegable en Celular */}
        {menuAbierto && (
          <div className="md:hidden bg-[#141210]/95 border-t border-[#D4A359]/15 px-6 py-5 flex flex-col gap-4 text-xs font-semibold">
            <button onClick={() => irASeccion("inicio")} className="btn-hairy-ghost text-left">
              Inicio
            </button>
            <button onClick={() => irASeccion("servicios")} className="btn-hairy-ghost text-left">
              Servicios
            </button>
            <button onClick={() => irASeccion("barberos")} className="btn-hairy-ghost text-left">
              Barberos
            </button>
            <button
              onClick={() => irASeccion("reservar")}
              className="btn-hairy-ghost text-left text-[#D4A359]"
            >
              Reservar Cita →
            </button>
          </div>
        )}
      </header>

      {/* Hero con Imagen + Degradado Negro */}
      <section className="relative min-h-[82vh] sm:min-h-[88vh] flex items-center justify-center px-5 sm:px-6 py-20 text-center overflow-hidden border-b border-[#D4A359]/15">
        {/* Capa 1: Imagen de fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${fondoUrl}")` }}
        />

        {/* Capa 2: Degradado negro elegante */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-[#0E0D0C]" />

        {/* Contenido centrado */}
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-3 sm:gap-4 mb-5 text-[#D4A359]">
            <span className="h-[1px] w-8 sm:w-12 bg-[#D4A359]/60"></span>
            <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="6" cy="18" r="2.5" />
              <circle cx="18" cy="18" r="2.5" />
              <path d="M7.8 16.2L19 4M16.2 16.2L5 4" />
            </svg>
            <span className="h-[1px] w-8 sm:w-12 bg-[#D4A359]/60"></span>
          </div>

          <p className="text-[10px] sm:text-xs font-semibold text-[#D4A359] uppercase tracking-[0.32em] sm:tracking-[0.38em] mb-3">
            Barbería Clásica &amp; Tradicional
          </p>

          <h1 className="font-hairy-serif text-4xl sm:text-6xl md:text-7xl font-bold text-[#FAF3EA] leading-tight">
            El Arte del <span className="italic text-[#D4A359]">Estilo</span> y la Navaja
          </h1>

          <p className="text-[#D6CCC2] text-sm sm:text-base mt-5 max-w-xl leading-relaxed px-2">
            Cortes de precisión, perfilado y ritual de barba tradicional diseñados a tu medida. Agenda tu turno sin filas ni esperas.
          </p>

          {/* Botones sin recuadro */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <button
              onClick={() => irASeccion("reservar")}
              className="btn-hairy-ghost text-sm font-bold text-[#D4A359] hover:text-[#FFF1CE] pb-1 border-b border-[#D4A359]"
            >
              Agendar Turno →
            </button>
            <button
              onClick={() => irASeccion("servicios")}
              className="btn-hairy-ghost text-xs sm:text-sm font-semibold text-[#EAE0D5] hover:text-[#D4A359]"
            >
              Explorar Carta de Servicios
            </button>
          </div>
        </div>
      </section>

      {/* Aviso de error si falla conexión */}
      {errorCarga && (
        <div className="max-w-4xl mx-auto mt-8 px-5">
          <p className="text-center text-xs text-[#E8998D] bg-[#241412] border border-[#E8998D]/30 py-3 px-4 rounded-lg">
            {errorCarga}
          </p>
        </div>
      )}

      {/* Carta de Servicios */}
      <section id="servicios" className="max-w-5xl mx-auto px-5 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[10px] sm:text-xs font-semibold text-[#D4A359] uppercase tracking-[0.35em]">
            Carta de Cortes
          </p>
          <h2 className="font-hairy-serif text-3xl sm:text-5xl font-bold text-[#FAF3EA] mt-2">
            Servicios &amp; Tarifas
          </h2>
          <div className="w-16 h-[1px] bg-[#D4A359]/60 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-6 sm:gap-y-8">
          {servicios.map((s) => (
            <div
              key={s.id}
              onClick={() => {
                setServicioId(String(s.id))
                irASeccion("reservar")
              }}
              className="group cursor-pointer pb-4 sm:pb-5 border-b border-[#D4A359]/20 hover:border-[#D4A359] transition-colors flex justify-between items-start gap-4"
            >
              <div>
                <h3 className="font-hairy-serif text-xl sm:text-2xl font-semibold text-[#FAF3EA] group-hover:text-[#D4A359] transition-colors">
                  {s.nombre}
                </h3>
                <p className="text-xs text-[#B5ABA0] mt-1 leading-relaxed">
                  {s.descripcion || "Servicio profesional de barbería"} ·{" "}
                  <span className="text-[#D4A359]">{s.duracion_min} min</span>
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="font-hairy-serif text-xl sm:text-2xl font-bold text-[#D4A359] block">
                  ${Number(s.precio).toLocaleString()}
                </span>
                <span className="btn-hairy-ghost text-[10px] text-[#B5ABA0] group-hover:text-[#FAF3EA]">
                  Elegir
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Equipo de Barberos */}
      <section id="barberos" className="bg-[#141311] border-y border-[#D4A359]/15 py-16 sm:py-24 px-5 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-[10px] sm:text-xs font-semibold text-[#D4A359] uppercase tracking-[0.35em]">
              Nuestros Profesionales
            </p>
            <h2 className="font-hairy-serif text-3xl sm:text-5xl font-bold text-[#FAF3EA] mt-2">
              Nuestros Barberos
            </h2>
            <div className="w-16 h-[1px] bg-[#D4A359]/60 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
            {barberos.map((b) => (
              <div
                key={b.id}
                onClick={() => {
                  setBarberoId(String(b.id))
                  irASeccion("reservar")
                }}
                className="group cursor-pointer bg-[#1A1816] p-7 sm:p-8 rounded-2xl border border-[#D4A359]/15 hover:border-[#D4A359]/60 transition-all text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-5 rounded-full bg-[#0E0D0C] border border-[#D4A359]/40 flex items-center justify-center font-hairy-serif text-2xl sm:text-3xl font-bold text-[#D4A359] group-hover:border-[#D4A359] transition-colors">
                  {b.nombre?.charAt(0)}
                </div>
                <h3 className="font-hairy-serif text-2xl font-bold text-[#FAF3EA] group-hover:text-[#D4A359] transition-colors">
                  {b.nombre}
                </h3>
                <p className="text-xs text-[#B5ABA0] uppercase tracking-[0.2em] mt-1">
                  {b.especialidad || "Barbero Clásico"}
                </p>
                <div className="mt-5">
                  <span className="btn-hairy-ghost text-xs font-semibold text-[#D4A359] group-hover:text-[#FFF1CE]">
                    Reservar con {b.nombre?.split(" ")[0]} →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario de Reserva Adaptable */}
      <section id="reservar" className="max-w-4xl mx-auto px-5 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-[10px] sm:text-xs font-semibold text-[#D4A359] uppercase tracking-[0.35em]">
            Agenda en Línea
          </p>
          <h2 className="font-hairy-serif text-3xl sm:text-5xl font-bold text-[#FAF3EA] mt-2">
            Reserva tu Turno
          </h2>
          <div className="w-16 h-[1px] bg-[#D4A359]/60 mx-auto mt-4"></div>
        </div>

        {mensaje.texto && (
          <div
            className={`mb-8 p-4 rounded-xl text-center text-sm font-medium border ${
              mensaje.tipo === "ok"
                ? "bg-[#142417] border-[#76C882]/40 text-[#B4EEBC]"
                : "bg-[#261412] border-[#E8998D]/40 text-[#F5BEB5]"
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        <form
          onSubmit={reservarTurno}
          className="bg-[#161412] border border-[#D4A359]/20 p-6 sm:p-12 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7"
        >
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4A359] mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              className="w-full bg-[#0E0D0C] border border-[#D4A359]/25 text-[#F4EDE4] text-base sm:text-sm rounded-lg p-3.5 focus:outline-none focus:border-[#D4A359]"
              placeholder="Ej. Julián Medina"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4A359] mb-2">
              Teléfono / WhatsApp
            </label>
            <input
              type="tel"
              value={telefonoCliente}
              onChange={(e) => setTelefonoCliente(e.target.value)}
              className="w-full bg-[#0E0D0C] border border-[#D4A359]/25 text-[#F4EDE4] text-base sm:text-sm rounded-lg p-3.5 focus:outline-none focus:border-[#D4A359]"
              placeholder="300 123 4567"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4A359] mb-2">
              Servicio
            </label>
            <select
              value={servicioId}
              onChange={(e) => setServicioId(e.target.value)}
              className="w-full bg-[#0E0D0C] border border-[#D4A359]/25 text-[#F4EDE4] text-base sm:text-sm rounded-lg p-3.5 focus:outline-none focus:border-[#D4A359]"
              required
            >
              <option value="" disabled>Selecciona un servicio</option>
              {servicios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre} — ${Number(s.precio).toLocaleString()} ({s.duracion_min} min)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4A359] mb-2">
              Barbero
            </label>
            <select
              value={barberoId}
              onChange={(e) => setBarberoId(e.target.value)}
              className="w-full bg-[#0E0D0C] border border-[#D4A359]/25 text-[#F4EDE4] text-base sm:text-sm rounded-lg p-3.5 focus:outline-none focus:border-[#D4A359]"
              required
            >
              <option value="" disabled>Selecciona un barbero</option>
              {barberos.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nombre} {b.especialidad ? `(${b.especialidad})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4A359] mb-2">
              Fecha
            </label>
            <input
              type="date"
              min={hoyISO()}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full bg-[#0E0D0C] border border-[#D4A359]/25 text-[#F4EDE4] text-base sm:text-sm rounded-lg p-3.5 focus:outline-none focus:border-[#D4A359]"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4A359] mb-2">
              Hora
            </label>
            <select
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className="w-full bg-[#0E0D0C] border border-[#D4A359]/25 text-[#F4EDE4] text-base sm:text-sm rounded-lg p-3.5 focus:outline-none focus:border-[#D4A359] disabled:opacity-50"
              disabled={horarios.length === 0}
              required
            >
              <option value="" disabled>
                {!barberoId || !servicioId || !fecha
                  ? "Elige servicio, barbero y fecha"
                  : horarios.length === 0
                    ? "Sin horas libres ese día"
                    : "Selecciona una hora"}
              </option>
              {horarios.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4A359] mb-2">
              Preferencias o Notas (Opcional)
            </label>
            <input
              type="text"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="w-full bg-[#0E0D0C] border border-[#D4A359]/25 text-[#F4EDE4] text-base sm:text-sm rounded-lg p-3.5 focus:outline-none focus:border-[#D4A359]"
              placeholder="Ej. Corte clásico con tijera, arreglo de barba..."
            />
          </div>

          <div className="md:col-span-2 pt-3 text-center">
            <button
              type="submit"
              className="btn-hairy-ghost text-base font-bold text-[#D4A359] hover:text-[#FFF1CE] pb-1.5 border-b border-[#D4A359] hover:border-[#FFF1CE]"
            >
              Confirmar Reserva →
            </button>
          </div>
        </form>
      </section>

      {/* Pie de página */}
      <footer className="border-t border-[#D4A359]/15 py-10 px-5 text-center text-xs text-[#9C9288]">
        <p className="font-hairy-serif text-base tracking-[0.25em] text-[#D4A359] mb-2">
          BARBERÍA MONARCA
        </p>
        <p>
          Todos los derechos reservados{" "}
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