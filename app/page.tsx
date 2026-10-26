import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-900 selection:text-cyan-50">
      
      {/* Navegación Principal */}
      <nav className="border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center font-bold text-white text-xl">
              A
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">
              AcompañaT
            </span>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/login" 
              className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              Portal Pacientes
            </Link>
            <Link 
              href="/login-corporativo" 
              className="text-sm font-medium bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md transition-colors"
            >
              Acceso Personal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="relative pt-24 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-slate-800 text-cyan-400 text-sm font-semibold tracking-wider mb-6 border border-slate-700">
              Porque estar lejos no significa dejar de cuidar
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 max-w-4xl mx-auto leading-tight">
              Envejezco con <span className="text-cyan-500">dignidad</span>, autonomía y cuidado profesional.
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Vivo mi envejecimiento acompañado y seguro en el lugar que más amo: mi hogar. Atención gerontogeriátrica especializada para tu tranquilidad y la de tu familia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/registro" 
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-all hover:scale-105"
              >
                Solicitar Evaluación Integral
              </Link>
            </div>
          </div>
        </section>

        {/* Servicios Core */}
        <section className="py-24 bg-slate-900/50 border-t border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Soluciones de Cuidado Integral</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Disminuimos la sobrecarga familiar garantizando una vigilancia continua y profesional, sin que el paciente abandone su entorno.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Card 1 */}
              <div className="bg-slate-800/40 border border-slate-700 p-8 rounded-2xl hover:bg-slate-800/60 transition-colors">
                <div className="w-12 h-12 bg-cyan-900/50 rounded-lg flex items-center justify-center mb-6 border border-cyan-800">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Teleenfermería</h3>
                <p className="text-slate-400 leading-relaxed">
                  Monitoreo a distancia con enfoque gerontogeriátrico para pacientes con enfermedades crónicas.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-800/40 border border-slate-700 p-8 rounded-2xl hover:bg-slate-800/60 transition-colors">
                <div className="w-12 h-12 bg-cyan-900/50 rounded-lg flex items-center justify-center mb-6 border border-cyan-800">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Evaluación Integral</h3>
                <p className="text-slate-400 leading-relaxed">
                  Análisis completo de la salud y funcionalidad para prevenir el riesgo de deterioro y fragilidad.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-800/40 border border-slate-700 p-8 rounded-2xl hover:bg-slate-800/60 transition-colors">
                <div className="w-12 h-12 bg-cyan-900/50 rounded-lg flex items-center justify-center mb-6 border border-cyan-800">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Signos Vitales</h3>
                <p className="text-slate-400 leading-relaxed">
                  Vigilancia remota de las condiciones de salud y orientación exacta sobre farmacoterapia.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-slate-800/40 border border-slate-700 p-8 rounded-2xl hover:bg-slate-800/60 transition-colors">
                <div className="w-12 h-12 bg-cyan-900/50 rounded-lg flex items-center justify-center mb-6 border border-cyan-800">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Red de Apoyo</h3>
                <p className="text-slate-400 leading-relaxed">
                  Capacitación continua para familiares y cuidadores primarios, fomentando la autonomía.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Exclusivo en CDMX y Estado de México</h2>
            <p className="text-slate-400 mb-8 text-lg">
              Diseñado para personas mayores de 65 años que valoran su independencia funcional y requieren atención accesible, rápida y cómoda desde el hogar.
            </p>
            <Link 
              href="/login" 
              className="inline-block bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-medium px-8 py-3 rounded-lg transition-colors"
            >
              Acceder al Portal
            </Link>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} AcompañaT. Todos los derechos reservados.</p>
        <p className="mt-2">Atención gerontogeriátrica domiciliaria y servicios de teleenfermería.</p>
      </footer>
    </div>
  );
}