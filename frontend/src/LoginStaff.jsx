import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "./api"

function LoginStaff() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const iniciarSesion = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const data = await api("/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      })
      localStorage.setItem("barberia_sesion", JSON.stringify(data))
      if (data.rol === "admin") {
        navigate("/admin")
      } else {
        navigate("/panel-barbero")
      }
    } catch (err) {
      setError(err.message || "Usuario o contraseña incorrectos")
    }
  }

  return (
    <div className="min-h-screen bg-[#2F251E] flex items-center justify-center px-6 text-[#F4EDE4]">
      <div className="w-full max-w-md bg-[#382C23] border border-[#D4A359]/25 p-10 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <p className="font-hairy-serif text-3xl font-bold tracking-[0.25em] text-[#F7F0E6]">HAIRY</p>
          <p className="text-[10px] tracking-[0.35em] text-[#D4A359] uppercase mt-1">Acceso de Personal</p>
          <div className="w-12 h-[1px] bg-[#D4A359]/50 mx-auto mt-4"></div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-[#3E2520] border border-[#E8998D]/40 text-[#F5BEB5] text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={iniciarSesion} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A359] mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#29201A] border border-[#D4A359]/25 text-[#F4EDE4] rounded-lg p-3.5 focus:outline-none focus:border-[#D4A359]"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A359] mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#29201A] border border-[#D4A359]/25 text-[#F4EDE4] rounded-lg p-3.5 focus:outline-none focus:border-[#D4A359]"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn-hairy-ghost text-xs text-[#BFAEA0] hover:text-[#F4EDE4]"
            >
              ← Volver al sitio
            </button>

            <button
              type="submit"
              className="btn-hairy-ghost text-sm font-bold text-[#D4A359] hover:text-[#FFF1CE] pb-1 border-b border-[#D4A359]"
            >
              Ingresar →
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginStaff