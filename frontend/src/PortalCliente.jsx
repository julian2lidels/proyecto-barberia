import { useEffect, useState } from "react"
import Navbar from "./components/Navbar"
import { api, fechaHora, hoyISO, precio } from "./api"

const FORM_VACIO = { id_servicio: "", id_barbero: "", fecha: "", hora: "", nombre: "", telefono: "", email: "" }

function PortalCliente() {
  const [servicios, setservicios] = useState([])
  const [barberos, setbarberos] = useState([])
  const [errorCarga, seterrorCarga] = useState("")

  const [form, setform] = useState(FORM_VACIO)
  const [horarios, sethorarios] = useState([])
  const [cargandoHorarios, setcargandoHorarios] = useState(false)
  const [recarga, setrecarga] = useState(0)
  const [enviando, setenviando] = useState(false)
  const [error, seterror] = useState("")
  const [confirmada, setconfirmada] = useState(null)

  const [telConsulta, settelConsulta] = useState("")
  const [misCitas, setmisCitas] = useState(null)
  const [errorConsulta, seterrorConsulta] = useState("")

  useEffect(() => {
    Promise.all([api("/api/servicios"), api("/api/barberos")])
      .then(([s, b]) => {
        setservicios(s)
        setbarberos(b)
      })
      .catch((e) => seterrorCarga(e.message))
  }, [])

  // Cada vez que cambia servicio, barbero o fecha, se consultan las horas libres
  useEffect(() => {
    const { id_servicio, id_barbero, fecha } = form
    if (!id_servicio || !id_barbero || !fecha) {
      sethorarios([])
      return
    }
    let vigente = true
    setcargandoHorarios(true)
    api(`/api/disponibilidad?id_barbero=${id_barbero}&id_servicio=${id_servicio}&fecha=${fecha}`)
      .then((d) => {
        if (vigente) sethorarios(d.horarios)
      })
      .catch((e) => {
        if (vigente) {
          sethorarios([])
          seterror(e.message)
        }
      })
      .finally(() => {
        if (vigente) setcargandoHorarios(false)
      })
    return () => {
      vigente = false
    }
  }, [form.id_servicio, form.id_barbero, form.fecha, recarga])

  const cambiar = (campo, valor) => {
    seterror("")
    setform((prev) => {
      const nuevo = { ...prev, [campo]: valor }
      if (["id_servicio", "id_barbero", "fecha"].includes(campo)) nuevo.hora = ""
      return nuevo
    })
  }

  const elegirServicio = (id) => {
    cambiar("id_servicio", String(id))
    const destino = document.getElementById("reservar")
    if (destino) destino.scrollIntoView({ behavior: "smooth" })
  }

  const reservar = async (e) => {
    e.preventDefault()
    seterror("")
    if (!form.hora) {
      seterror("Elige una hora disponible")
      return
    }
    setenviando(true)
    try {
      const cita = await api("/api/citas", {
        metodo: "POST",
        cuerpo: {
          nombre: form.nombre,
          telefono: form.telefono,
          email: form.email || null,
          id_barbero: Number(form.id_barbero),
          id_servicio: Number(form.id_servicio),
          inicio: `${form.fecha}T${form.hora}:00`,
        },
      })
      setconfirmada(cita)
      setform(FORM_VACIO)
    } catch (err) {
      seterror(err.message)
      setrecarga((n) => n + 1) // refresca las horas por si alguien tomó ese turno
    } finally {
      setenviando(false)
    }
  }

  const consultar = async (e) => {
    e.preventDefault()
    seterrorConsulta("")
    setmisCitas(null)
    try {
      setmisCitas(await api(`/api/citas/consulta?telefono=${encodeURIComponent(telConsulta)}`))
    } catch (err) {
      seterrorConsulta(err.message)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <header className="relative overflow-hidden px-6 py-24 text-center">
        <div className="pointer-events-none absolute left-1/2 top-[-10rem] h-[30rem] w-[40rem] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]"></div>
        <p className="relative mb-3 text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Corte · Barba · Estilo</p>
        <h1 className="relative text-4xl font-black tracking-tight text-white sm:text-6xl">Tu mejor versión empieza aquí</h1>
        <p className="relative mx-auto mt-5 max-w-xl text-neutral-400">
          Reserva tu cita en línea, elige a tu barbero y llega sin esperas.
        </p>
        <a href="#reservar" className="btn relative mt-8">Reservar cita</a>
      </header>

      <main className="mx-auto max-w-6xl space-y-24 px-6 pb-24">
        {errorCarga && <p className="text-center text-red-400">{errorCarga}</p>}

        <section>
          <h2 className="mb-8 text-2xl font-extrabold text-white">Servicios</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {servicios.map((s) => (
              <div key={s.id} className="tarjeta flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold text-white">{s.nombre}</h3>
                    <span className="font-black text-amber-400">{precio(s.precio)}</span>
                  </div>
                  <p className="mt-2 text-sm text-neutral-400">{s.descripcion}</p>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">{s.duracion_min} min</span>
                  <button onClick={() => elegirServicio(s.id)} className="btn-suave">Reservar</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-8 text-2xl font-extrabold text-white">Nuestros barberos</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {barberos.map((b) => (
              <div key={b.id} className="tarjeta flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15 text-xl font-black text-amber-400">
                  {b.nombre.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white">{b.nombre}</h3>
                  <p className="text-sm text-neutral-400">{b.especialidad}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="reservar" className="scroll-mt-24">
          <h2 className="mb-8 text-2xl font-extrabold text-white">Reserva tu cita</h2>

          {confirmada ? (
            <div className="tarjeta border-amber-500/40 text-center">
              <p className="text-4xl">✅</p>
              <h3 className="mt-3 text-xl font-bold text-white">¡Cita registrada!</h3>
              <p className="mt-2 text-neutral-300">
                {confirmada.servicio_nombre} con {confirmada.barbero_nombre}
              </p>
              <p className="font-bold text-amber-400">{fechaHora(confirmada.inicio)}</p>
              <p className="mt-2 text-sm text-neutral-500">Queda pendiente de confirmación por la barbería.</p>
              <button onClick={() => setconfirmada(null)} className="btn mt-6">Reservar otra</button>
            </div>
          ) : (
            <form onSubmit={reservar} className="tarjeta space-y-6">
              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="etiqueta">Servicio</label>
                  <select className="campo" value={form.id_servicio} onChange={(e) => cambiar("id_servicio", e.target.value)} required>
                    <option value="">Elige un servicio</option>
                    {servicios.map((s) => (
                      <option key={s.id} value={s.id}>{s.nombre} · {precio(s.precio)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="etiqueta">Barbero</label>
                  <select className="campo" value={form.id_barbero} onChange={(e) => cambiar("id_barbero", e.target.value)} required>
                    <option value="">Elige un barbero</option>
                    {barberos.map((b) => (
                      <option key={b.id} value={b.id}>{b.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="etiqueta">Fecha</label>
                  <input type="date" className="campo" min={hoyISO()} value={form.fecha} onChange={(e) => cambiar("fecha", e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="etiqueta">Hora disponible</label>
                {!form.id_servicio || !form.id_barbero || !form.fecha ? (
                  <p className="text-sm text-neutral-500">Elige servicio, barbero y fecha para ver las horas libres.</p>
                ) : cargandoHorarios ? (
                  <p className="text-sm text-neutral-500">Buscando horas libres...</p>
                ) : horarios.length === 0 ? (
                  <p className="text-sm text-neutral-500">No hay horas libres ese día, prueba otra fecha u otro barbero.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {horarios.map((h) => (
                      <button
                        type="button"
                        key={h}
                        onClick={() => cambiar("hora", h)}
                        className={
                          "rounded-lg border px-3 py-2 text-sm font-semibold transition " +
                          (form.hora === h
                            ? "border-amber-500 bg-amber-500 text-neutral-950"
                            : "border-white/10 bg-white/5 text-neutral-200 hover:bg-white/10")
                        }
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="etiqueta">Tu nombre</label>
                  <input className="campo" value={form.nombre} onChange={(e) => cambiar("nombre", e.target.value)} required />
                </div>
                <div>
                  <label className="etiqueta">Teléfono / WhatsApp</label>
                  <input className="campo" inputMode="tel" placeholder="3001234567" value={form.telefono} onChange={(e) => cambiar("telefono", e.target.value)} required />
                </div>
                <div>
                  <label className="etiqueta">Correo (opcional)</label>
                  <input type="email" className="campo" value={form.email} onChange={(e) => cambiar("email", e.target.value)} />
                </div>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}
              <button type="submit" className="btn" disabled={enviando}>
                {enviando ? "Reservando..." : "Confirmar reserva"}
              </button>
            </form>
          )}
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-extrabold text-white">Consulta tus próximas citas</h2>
          <form onSubmit={consultar} className="flex max-w-xl flex-col gap-3 sm:flex-row">
            <input className="campo" inputMode="tel" placeholder="Tu teléfono" value={telConsulta} onChange={(e) => settelConsulta(e.target.value)} required />
            <button type="submit" className="btn">Buscar</button>
          </form>
          {errorConsulta && <p className="mt-3 text-sm text-red-400">{errorConsulta}</p>}
          {misCitas && (
            <div className="mt-5 max-w-xl space-y-3">
              {misCitas.length === 0 && <p className="text-sm text-neutral-500">No tienes citas próximas con ese teléfono.</p>}
              {misCitas.map((c) => (
                <div key={c.id} className="tarjeta flex items-center justify-between py-4">
                  <div>
                    <p className="font-bold text-white">{c.servicio_nombre} · {c.barbero_nombre}</p>
                    <p className="text-sm text-neutral-400">{fechaHora(c.inicio)}</p>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">{c.estado}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} Barbería · Todos los derechos reservados
      </footer>
    </div>
  )
}

export default PortalCliente
