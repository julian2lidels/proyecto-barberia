import Navbar from "./Navbar"

// Marco común de las pantallas del personal: barra superior + contenido
function Layout({ subtitulo, tituloNormal, tituloDestacado, children }) {
  return (
    <div className="min-h-screen bg-[#2F251E] text-[#F4EDE4]">
      <Navbar subtitulo={subtitulo} tituloNormal={tituloNormal} tituloDestacado={tituloDestacado} />
      <main className="max-w-7xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}

export default Layout
