'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { guardarDatosComplementarios } from '../actions'
import { CheckCircle2 } from 'lucide-react'

export default function ComplementoRegistroPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [rfc, setRfc] = useState('')
  const [telefono, setTelefono] = useState('')
  const [nss, setNss] = useState('')
  const [domicilio, setDomicilio] = useState('')
  const [tipoSangre, setTipoSangre] = useState('')
  const [membresia, setMembresia] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    setMensaje('')

    const resultado = await guardarDatosComplementarios(email, {
      rfc,
      telefono,
      nss,
      domicilio,
      tipoSangre,
      membresia
    })

    setMensaje(resultado.message)
    setCargando(false)

    if (resultado.success) {
      setTimeout(() => {
        window.location.href = `/paciente?email=${encodeURIComponent(email)}`
      }, 1200)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-800">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-slate-900">Datos Complementarios</h1>
          <p className="text-xs text-slate-500 mt-1">Expediente Clínico Electrónico (Opcionales/Médicos)</p>
        </div>

        <form onSubmit={handleGuardar} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">RFC</label>
            <input type="text" maxLength={13} value={rfc} onChange={(e) => setRfc(e.target.value)} placeholder="RFC opcional" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm uppercase" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Teléfono (10 dígitos)</label>
            <input type="text" maxLength={10} value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="5512345678" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">NSS (Número de Seguro Social)</label>
            <input type="text" maxLength={11} value={nss} onChange={(e) => setNss(e.target.value)} placeholder="NSS de 11 dígitos" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Domicilio</label>
            <input type="text" value={domicilio} onChange={(e) => setDomicilio(e.target.value)} placeholder="Calle, número, colonia..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
          </div>

          {/* Menú desplegable para Tipo de Sangre */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Tipo de Sangre</label>
            <select value={tipoSangre} onChange={(e) => setTipoSangre(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
              <option value="">Seleccione tipo de sangre...</option>
              <option value="O+">O Positivo (O+)</option>
              <option value="O-">O Negativo (O-)</option>
              <option value="A+">A Positivo (A+)</option>
              <option value="A-">A Negativo (A-)</option>
              <option value="B+">B Positivo (B+)</option>
              <option value="B-">B Negativo (B-)</option>
              <option value="AB+">AB Positivo (AB+)</option>
              <option value="AB-">AB Negativo (AB-)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Tipo de Membresía</label>
            <input type="text" value={membresia} onChange={(e) => setMembresia(e.target.value)} placeholder="Ej. General, Especial, etc." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
          </div>

          <button type="submit" disabled={cargando} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 mt-4">
            <CheckCircle2 className="w-4 h-4"/>
            <span>{cargando ? 'Guardando...' : 'Finalizar y Entrar al Portal'}</span>
          </button>

          {mensaje && (
            <p className={`text-xs text-center font-medium p-3 rounded-lg ${mensaje === 'Guardado exitoso' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              {mensaje}
            </p>
          )}
        </form>
      </div>
    </main>
  )
}