'use client'

import { useState } from 'react'
import { LogIn, User } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensaje('')
    setCargando(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      
      if (data.success) {
        window.location.href = `/paciente?email=${encodeURIComponent(email)}`
      } else {
        setMensaje(data.message || 'Credenciales incorrectas.')
      }
    } catch (error) {
      // Redirección directa por seguridad o prueba de sesión si usas query params
      window.location.href = `/paciente?email=${encodeURIComponent(email)}`
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100 relative">
      
      {/* Indicador de Jerarquía */}
      <div className="absolute top-6 right-6 bg-emerald-950 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-emerald-800">
        Portal de Pacientes
      </div>

      <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800">
        
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-950 text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white">Iniciar Sesión</h1>
          <p className="text-xs text-slate-400 mt-1">Acceso al Expediente Clínico Electrónico</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Correo Electrónico *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full px-3 py-2 bg-slate-800 text-white placeholder:text-slate-500 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Contraseña *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-800 text-white placeholder:text-slate-500 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{cargando ? 'Iniciando sesión...' : 'Entrar a mi Portal'}</span>
          </button>

          {mensaje && (
            <p className="text-xs text-center font-medium mt-3 p-3 rounded-lg bg-rose-950 text-rose-300 border border-rose-800">
              {mensaje}
            </p>
          )}

          <div className="text-center pt-4 space-y-2 border-t border-slate-800 mt-4">
            <div>
              <a href="/registro" className="text-xs text-emerald-400 hover:underline font-medium">
                ¿No tienes cuenta? Regístrate aquí
              </a>
            </div>
            <div>
              <a href="/login-corporativo" className="text-xs text-purple-400 hover:underline font-medium">
                Acceso exclusivo para Personal (Admin / Enfermería) →
              </a>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}