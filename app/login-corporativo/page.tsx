'use client'

import { useState } from 'react'
import { loginCorporativo } from './actions'
import { ShieldCheck, LogIn } from 'lucide-react'

export default function LoginCorporativoPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensaje('')
    setCargando(true)

    const resultado = await loginCorporativo(email, password)
    setMensaje(resultado.message)
    setCargando(false)

    if (resultado.success) {
      window.location.href = resultado.redirect
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-slate-800 relative">
      
      {/* Indicador de Jerarquía */}
      <div className="absolute top-6 right-6 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-amber-300">
        Acceso Corporativo / Personal
      </div>

      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-800">
        
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Portal Corporativo</h1>
          <p className="text-xs text-slate-500 mt-1">Acceso exclusivo para Administradores y Enfermería</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Correo Corporativo *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="personal@sistema.com"
              className="w-full px-3 py-2 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Contraseña *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{cargando ? 'Verificando credenciales...' : 'Ingresar al Sistema'}</span>
          </button>

          {mensaje && (
            <p className={`text-xs text-center font-medium mt-3 p-3 rounded-lg ${mensaje.includes('éxito') || mensaje.includes('Bienvenido') ? 'bg-purple-50 text-purple-700' : 'bg-rose-50 text-rose-700'}`}>
              {mensaje}
            </p>
          )}

          <div className="text-center pt-2 space-y-2">
            <div>
              <a href="/login" className="text-xs text-emerald-600 hover:underline font-medium">
                ← ¿Eres paciente? Inicia sesión aquí
              </a>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}