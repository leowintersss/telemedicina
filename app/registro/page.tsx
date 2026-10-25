'use client'

import { useState } from 'react'
import { registrarPaso1 } from './actions'
import { UserPlus } from 'lucide-react'

export default function RegistroPage() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [dia, setDia] = useState('')
  const [mes, setMes] = useState('')
  const [anio, setAnio] = useState('')
  const [sexo, setSexo] = useState('') // Inicia vacío obligado
  const [curp, setCurp] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleRegistroPaso1 = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensaje('')

    if (password.length < 8) {
      setMensaje('La contraseña debe tener un mínimo de 8 caracteres.')
      return
    }

    if (!sexo) {
      setMensaje('Debe seleccionar una opción en el campo Sexo.')
      return
    }

    setCargando(true)
    const resultado = await registrarPaso1({ nombre, email, password, dia, mes, anio, sexo, curp })
    setCargando(false)

    setMensaje(resultado.message)

    if (resultado.success) {
      // Redirigir al formulario de datos complementarios pasando el email
      window.location.href = `/registro/complemento?email=${encodeURIComponent(resultado.email!)}`
    }
  }

  // Listas para selectores de fecha
  const dias = Array.from({ length: 31 }, (_, i) => i + 1)
  const meses = [
    { num: '1', nombre: 'Enero' }, { num: '2', nombre: 'Febrero' }, { num: '3', nombre: 'Marzo' },
    { num: '4', nombre: 'Abril' }, { num: '5', nombre: 'Mayo' }, { num: '6', nombre: 'Junio' },
    { num: '7', nombre: 'Julio' }, { num: '8', nombre: 'Agosto' }, { num: '9', nombre: 'Septiembre' },
    { num: '10', nombre: 'Octubre' }, { num: '11', nombre: 'Noviembre' }, { num: '12', nombre: 'Diciembre' }
  ]
  const anios = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-800">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-slate-900">Registro de Paciente (Paso 1)</h1>
          <p className="text-xs text-slate-500 mt-1">Expediente Clínico Electrónico</p>
        </div>

        <form onSubmit={handleRegistroPaso1} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Nombre Completo *</label>
            <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre completo" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Correo Electrónico *</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Contraseña (Mínimo 8 caracteres) *</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
          </div>

          {/* Selectores independientes para Fecha de Nacimiento */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Fecha de Nacimiento *</label>
            <div className="grid grid-cols-3 gap-2">
              <select required value={dia} onChange={(e) => setDia(e.target.value)} className="px-2 py-2 border border-slate-300 rounded-lg text-sm bg-white">
                <option value="">Día</option>
                {dias.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <select required value={mes} onChange={(e) => setMes(e.target.value)} className="px-2 py-2 border border-slate-300 rounded-lg text-sm bg-white">
                <option value="">Mes</option>
                {meses.map(m => <option key={m.num} value={m.num}>{m.nombre}</option>)}
              </select>

              <select required value={anio} onChange={(e) => setAnio(e.target.value)} className="px-2 py-2 border border-slate-300 rounded-lg text-sm bg-white">
                <option value="">Año</option>
                {anios.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          {/* Sexo obligatorio sin seleccionar por defecto */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Sexo *</label>
            <select required value={sexo} onChange={(e) => setSexo(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
              <option value="" disabled>Seleccione una opción...</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">CURP *</label>
            <input type="text" required maxLength={18} value={curp} onChange={(e) => setCurp(e.target.value)} placeholder="CURP de 18 caracteres" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm uppercase" />
          </div>

          <button type="submit" disabled={cargando} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 mt-4">
            <UserPlus className="w-4 h-4"/>
            <span>{cargando ? 'Registrando...' : 'Continuar a Datos Complementarios'}</span>
          </button>

          {mensaje && <p className="text-xs text-center font-medium p-3 rounded-lg bg-rose-50 text-rose-700">{mensaje}</p>}

          <div className="text-center pt-2">
            <a href="/login" className="text-xs text-emerald-600 hover:underline font-medium">¿Ya tienes cuenta? Inicia sesión →</a>
          </div>
        </form>
      </div>
    </main>
  )
}