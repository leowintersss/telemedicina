'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function PruebaRegistroSimple() {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')

  const handlePruebaSimple = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensaje('Probando conexión y registro...')

    // Prueba directa únicamente con Auth de Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre: nombre,
          apellido: apellido,
        },
      },
    })

    if (error) {
      setMensaje(`Error de Supabase: ${error.message}`)
    } else {
      setMensaje(`¡Éxito total! Usuario creado con ID: ${data.user?.id}`)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-slate-800">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-xl font-bold mb-4 text-center">Prueba Simple de Registro</h1>

        <form onSubmit={handlePruebaSimple} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">Nombre</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Apellido</label>
            <input
              type="text"
              required
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Contraseña (Cualquiera de más de 6 carac.)</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors"
          >
            Probar Registro Simple
          </button>

          {mensaje && (
            <p className="text-xs text-center font-medium mt-3 text-slate-700 bg-slate-50 p-3 rounded-lg border">
              {mensaje}
            </p>
          )}
        </form>
      </div>
    </main>
  )
}