import { useEffect, useState } from "react"
import { api } from "../api"

function Clientes() {
  const [clientes, setclientes] = useState([])
  const [error, seterror] = useState("")

  useEffect(() => {
    api("/api/admin/clientes", { auth: true })
      .then(setclientes)
      .catch((e) => seterror(e.message))
  }, [])

  return (
    <div>
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-xs uppercase tracking-widest text-neutral-400">
            <tr>
              <th className="px-5 py-4">Cliente</th>
              <th className="px-5 py-4">Teléfono</th>
              <th className="px-5 py-4">Correo</th>
              <th className="px-5 py-4">Citas</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id} className="border-b border-white/5">
                <td className="px-5 py-4 font-bold text-white">{c.nombre}</td>
                <td className="px-5 py-4">{c.telefono}</td>
                <td className="px-5 py-4">{c.email || "—"}</td>
                <td className="px-5 py-4">{c.total_citas}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {clientes.length === 0 && (
          <p className="p-10 text-center text-sm text-neutral-500">Todavía no hay clientes registrados.</p>
        )}
      </div>
    </div>
  )
}

export default Clientes
