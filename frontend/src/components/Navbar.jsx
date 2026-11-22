import { Link, useLocation, useNavigate } from "react-router-dom"
import { cerrarSesion, obtenerSesion } from "../api"

const ENLACES_ADMIN = [
  { ruta: "/admin", texto: "Panel" },
  { ruta: "/admin/citas", texto: "Citas" },
  { ruta: "/admin/barberos", texto: "Barberos & Usuarios" },
  { ruta: "/admin/servicios", texto: "Servicios" },
  { ruta: "/admin/clientes", texto: "Clientes" },
]

function Navbar({ subtitulo, tituloNormal, tituloDestacado }) {
  const location = useLocation()
  const navigate = useNavigate()
  const sesion = obtenerSesion()
  // El barbero solo ve su panel; los enlaces de administración son solo para el admin
  const enlaces = sesion?.rol === "admin" ? ENLACES_ADMIN : []

  const salir = () => {
    cerrarSesion()
    navigate("/staff/login")
  }

  return (
    <nav className="bg-[#29201A]/95 backdrop-blur-md border-b border-[#D4A359]/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div>
          <p className="text-[10px] text-[#D4A359] font-semibold tracking-[0.3em] uppercase">{subtitulo}</p>
          <h1 className="font-hairy-serif text-2xl font-bold text-[#FAF3EA]">
            {tituloNormal} <span className="italic text-[#D4A359]">{tituloDestacado}</span>
          </h1>
        </div>

        <div className="flex items-center gap-6 flex-wrap text-xs font-semibold">
          {enlaces.map((item) => {
            const activo = location.pathname === item.ruta
            return (
              <Link
                key={item.ruta}
                to={item.ruta}
                className={`btn-hairy-ghost pb-1 ${
                  activo
                    ? "text-[#D4A359] border-b border-[#D4A359]"
                    : "text-[#CFC2B4] hover:text-[#D4A359]"
                }`}
              >
                {item.texto}
              </Link>
            )
          })}

          <button onClick={salir} className="btn-hairy-ghost text-[#E8998D] hover:text-[#FFC4BA] ml-4">
            Salir ✕
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
