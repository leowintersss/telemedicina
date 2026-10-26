
'use client'

export const dynamic = "force-dynamic";
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { obtenerDatosPaciente, obtenerUltimoChequeo, actualizarDatosOpcionales } from './actions'
import { cambiarPassword } from '../actions-seguridad'
import { User, Calendar, Mail, Shield, LogOut, Activity, Heart, Thermometer, Edit3, Save, Lock } from 'lucide-react'

export default function PacientePortalPage() {
  const searchParams = useSearchParams()
  const emailQuery = searchParams.get('email')

  const [paciente, setPaciente] = useState<any>(null)
  const [ultimoChequeo, setUltimoChequeo] = useState<any>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [editando, setEditando] = useState(false)
  const [rfc, setRfc] = useState('')
  const [telefono, setTelefono] = useState('')
  const [nss, setNss] = useState('')
  const [domicilio, setDomicilio] = useState('')
  const [tipoSangre, setTipoSangre] = useState('')
  const [membresia, setMembresia] = useState('')
  const [mensajeGuardado, setMensajeGuardado] = useState('')

  const [cambiandoPass, setCambiandoPass] = useState(false)
  const [passActual, setPassActual] = useState('')
  const [passNueva, setPassNueva] = useState('')
  const [passConfirmar, setPassConfirmar] = useState('')
  const [mensajePass, setMensajePass] = useState('')

  useEffect(() => {
    async function cargarDatos() {
      if (!emailQuery) {
        setError('No se detectó una sesión activa.')
        setCargando(false)
        return
      }

      const resP = await obtenerDatosPaciente(emailQuery)
      if (resP.success) {
        setPaciente(resP.paciente)
        setRfc(resP.paciente.rfc || '')
        setTelefono(resP.paciente.telefono || '')
        setNss(resP.paciente.nss || '')
        setDomicilio(resP.paciente.domicilio || '')
        setTipoSangre(resP.paciente.tipo_sangre || '')
        setMembresia(resP.paciente.membresia || '')
      } else {
        setError(resP.message)
      }

      const resC = await obtenerUltimoChequeo(emailQuery)
      if (resC.success) {
        setUltimoChequeo(resC.chequeo)
      }

      setCargando(false)
    }

    cargarDatos()
  }, [emailQuery])

  const handleActualizar = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensajeGuardado('')
    const res = await actualizarDatosOpcionales(emailQuery || '', {
      rfc, telefono, nss, domicilio, tipoSangre, membresia
    })
    setMensajeGuardado(res.message)
    if (res.success) {
      const resP = await obtenerDatosPaciente(emailQuery || '')
      if (resP.success) setPaciente(resP.paciente)
      setTimeout(() => setMensajeGuardado(''), 3000)
    }
  }

  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensajePass('')

    if (passNueva !== passConfirmar) {
      setMensajePass('Las nuevas contraseñas no coinciden.')
      return
    }

    const res = await cambiarPassword('patients', emailQuery || '', passActual, passNueva)
    setMensajePass(res.message)
    if (res.success) {
      setPassActual('')
      setPassNueva('')
      setPassConfirmar('')
      setTimeout(() => setCambiandoPass(false), 2000)
    }
  }

  const handleCerrarSesion = () => {
    window.location.href = '/login'
  }

  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        <p className="text-sm font-medium animate-pulse">Cargando expediente clínico...</p>
      </main>
    )
  }

  const fechaActual = new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100 relative">
      
      {/* Indicador de Rol */}
      <div className="absolute top-6 right-6 bg-emerald-900/40 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-emerald-800">
        Rol: Paciente
      </div>

      <div className="max-w-4xl mx-auto space-y-6 pt-12 md:pt-0">
        
        {/* Cabecera */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Bienvenido {paciente?.nombre_completo}</h1>
            <p className="text-xs text-slate-400 mt-0.5">Fecha actual: {fechaActual}</p>
          </div>
          <button
            onClick={handleCerrarSesion}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-200 text-xs font-medium rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {error && (
          <div className="bg-rose-950/50 border border-rose-800 p-4 rounded-xl text-rose-300 text-xs text-center">
            {error}
          </div>
        )}

        {paciente && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tarjeta de Resumen */}
            <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                {paciente.nombre_completo.charAt(0)}
              </div>
              <div>
                <h2 className="text-base font-bold text-white">{paciente.nombre_completo}</h2>
                <p className="text-xs text-slate-400">{paciente.email}</p>
              </div>
              <span className="inline-block px-3 py-1 bg-emerald-950 text-emerald-400 text-[11px] font-semibold rounded-full">
                Paciente Activo
              </span>

              {/* Botón para abrir cambio de contraseña */}
              <button
                onClick={() => setCambiandoPass(!cambiandoPass)}
                className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{cambiandoPass ? 'Ocultar Contraseña' : 'Cambiar Contraseña'}</span>
              </button>

              {cambiandoPass && (
                <form onSubmit={handleCambiarPassword} className="space-y-3 pt-3 border-t border-slate-800 text-left">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase mb-1">Contraseña Actual</label>
                    <input type="password" required value={passActual} onChange={(e) => setPassActual(e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-700 bg-slate-800 rounded-lg text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase mb-1">Nueva Contraseña (Mín. 8)</label>
                    <input type="password" required minLength={8} value={passNueva} onChange={(e) => setPassNueva(e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-700 bg-slate-800 rounded-lg text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase mb-1">Confirmar Nueva</label>
                    <input type="password" required minLength={8} value={passConfirmar} onChange={(e) => setPassConfirmar(e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-700 bg-slate-800 rounded-lg text-xs text-white" />
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-lg text-xs font-medium">
                    Actualizar Contraseña
                  </button>
                  {mensajePass && (
                    <p className={`text-[11px] text-center p-1.5 rounded-lg ${mensajePass.includes('éxito') ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}>
                      {mensajePass}
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Detalles y Edición Opcional */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Información General</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-slate-800/50 rounded-xl">
                    <span className="block text-[10px] text-slate-400 uppercase font-medium">Sexo</span>
                    <span className="font-medium text-slate-200">{paciente.sexo}</span>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-xl">
                    <span className="block text-[10px] text-slate-400 uppercase font-medium">Nacimiento</span>
                    <span className="font-medium text-slate-200">{new Date(paciente.fecha_nacimiento).toLocaleDateString()}</span>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-xl">
                    <span className="block text-[10px] text-slate-400 uppercase font-medium">CURP</span>
                    <span className="font-medium text-slate-200 uppercase">{paciente.curp}</span>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-xl">
                    <span className="block text-[10px] text-slate-400 uppercase font-medium">Tipo de Sangre</span>
                    <span className="font-medium text-slate-200">{paciente.tipo_sangre || 'No asignado'}</span>
                  </div>
                </div>
              </div>

              {/* Información Complementaria */}
              <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Información Opcional y Complementaria</h3>
                  <button 
                    onClick={() => setEditando(!editando)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-emerald-950 text-slate-200 text-xs font-medium rounded-lg transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{editando ? 'Cancelar' : 'Modificar Datos'}</span>
                  </button>
                </div>

                {!editando ? (
                  <div className="grid grid-cols-2 gap-3 text-sm pt-2">
                    <div className="p-2.5 bg-slate-800/50 rounded-xl">
                      <span className="block text-[10px] text-slate-400 uppercase">RFC</span>
                      <span className="font-medium text-slate-200">{paciente.rfc || 'No registrado'}</span>
                    </div>
                    <div className="p-2.5 bg-slate-800/50 rounded-xl">
                      <span className="block text-[10px] text-slate-400 uppercase">Teléfono</span>
                      <span className="font-medium text-slate-200">{paciente.telefono || 'No registrado'}</span>
                    </div>
                    <div className="p-2.5 bg-slate-800/50 rounded-xl">
                      <span className="block text-[10px] text-slate-400 uppercase">NSS</span>
                      <span className="font-medium text-slate-200">{paciente.nss || 'No registrado'}</span>
                    </div>
                    <div className="p-2.5 bg-slate-800/50 rounded-xl">
                      <span className="block text-[10px] text-slate-400 uppercase">Membresía</span>
                      <span className="font-medium text-slate-200">{paciente.membresia || 'No registrada'}</span>
                    </div>
                    <div className="col-span-2 p-2.5 bg-slate-800/50 rounded-xl">
                      <span className="block text-[10px] text-slate-400 uppercase">Domicilio</span>
                      <span className="font-medium text-slate-200">{paciente.domicilio || 'No registrado'}</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleActualizar} className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">RFC</label>
                        <input type="text" maxLength={13} value={rfc} onChange={(e) => setRfc(e.target.value)} className="w-full px-3 py-1.5 border border-slate-700 bg-slate-800 rounded-lg text-sm uppercase text-white" />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Teléfono</label>
                        <input type="text" maxLength={10} value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full px-3 py-1.5 border border-slate-700 bg-slate-800 rounded-lg text-sm text-white" />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">NSS</label>
                        <input type="text" maxLength={11} value={nss} onChange={(e) => setNss(e.target.value)} className="w-full px-3 py-1.5 border border-slate-700 bg-slate-800 rounded-lg text-sm text-white" />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Tipo de Sangre</label>
                        <select value={tipoSangre} onChange={(e) => setTipoSangre(e.target.value)} className="w-full px-3 py-1.5 border border-slate-700 bg-slate-800 rounded-lg text-sm text-white">
                          <option value="">Seleccione...</option>
                          <option value="O+">O+</option><option value="O-">O-</option>
                          <option value="A+">A+</option><option value="A-">A-</option>
                          <option value="B+">B+</option><option value="B-">B-</option>
                          <option value="AB+">AB+</option><option value="AB-">AB-</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Domicilio</label>
                      <input type="text" value={domicilio} onChange={(e) => setDomicilio(e.target.value)} className="w-full px-3 py-1.5 border border-slate-700 bg-slate-800 rounded-lg text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Tipo de Membresía</label>
                      <input type="text" value={membresia} onChange={(e) => setMembresia(e.target.value)} className="w-full px-3 py-1.5 border border-slate-700 bg-slate-800 rounded-lg text-sm text-white" />
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-xs flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" />
                      <span>Guardar Cambios</span>
                    </button>
                    {mensajeGuardado && (
                      <p className={`text-xs text-center font-medium p-2 rounded-lg ${mensajeGuardado === 'Guardado exitoso' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}>
                        {mensajeGuardado}
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  )
}