'use client'

import { useState, useEffect } from 'react'
import { obtenerDatosEnfermera, actualizarDatosEnfermera, buscarPacientesEnfermeria, obtenerHistorialEnfermeria, registrarSignosEnfermeria } from './actions'
import { cambiarPassword } from '../actions-seguridad'
import { Search, UserCheck, PlusCircle, ArrowLeft, Calendar, Clock, Stethoscope, Edit3, Save, Lock } from 'lucide-react'

export default function PanelEnfermeriaPage() {
  const [menuActivo, setMenuActivo] = useState<'pacientes' | 'mi-perfil'>('pacientes')
  const [enfermera, setEnfermera] = useState<any>(null)

  // Estados perfil enfermera
  const [editandoPerfil, setEditandoPerfil] = useState(false)
  const [nuevoEmail, setNuevoEmail] = useState('')
  const [nuevoTelefono, setNuevoTelefono] = useState('')
  const [mensajePerfil, setMensajePerfil] = useState('')

  // Estados cambio contraseña
  const [passActual, setPassActual] = useState('')
  const [passNueva, setPassNueva] = useState('')
  const [passConfirmar, setPassConfirmar] = useState('')
  const [mensajePass, setMensajePass] = useState('')

  // Estados pacientes
  const [termino, setTermino] = useState('')
  const [pacientes, setPacientes] = useState<any[]>([])
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<any>(null)
  const [historial, setHistorial] = useState<any[]>([])
  
  const [presion, setPresion] = useState('')
  const [frecuencia, setFrecuencia] = useState('')
  const [temperatura, setTemperatura] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [mensajeChequeo, setMensajeChequeo] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    async function cargarPerfil() {
      const res = await obtenerDatosEnfermera('enfermera@sistema.com')
      if (res.success && res.nurse) {
        setEnfermera(res.nurse)
        setNuevoEmail(res.nurse.email)
        setNuevoTelefono(res.nurse.telefono || '')
      }
    }
    cargarPerfil()
  }, [])

  useEffect(() => {
    if (pacienteSeleccionado) {
      cargarHistorial(pacienteSeleccionado.id)
    }
  }, [pacienteSeleccionado])

  const cargarHistorial = async (id: number) => {
    const res = await obtenerHistorialEnfermeria(id)
    if (res.success) {
      setHistorial(res.historial)
    }
  }

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await buscarPacientesEnfermeria(termino)
    if (res.success) setPacientes(res.pacientes)
  }

  const handleGuardarSignos = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    setMensajeChequeo('')

    const res = await registrarSignosEnfermeria({
      patientId: pacienteSeleccionado.id,
      presion,
      frecuenciaCardiaca: Number(frecuencia),
      temperatura: Number(temperatura),
      observaciones,
    })

    setMensajeChequeo(res.message)
    setCargando(false)

    if (res.success) {
      setPresion('')
      setFrecuencia('')
      setTemperatura('')
      setObservaciones('')
      cargarHistorial(pacienteSeleccionado.id)
    }
  }

  const handleActualizarPerfil = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensajePerfil('')
    const res = await actualizarDatosEnfermera(enfermera.email, nuevoEmail, nuevoTelefono)
    setMensajePerfil(res.message)
    if (res.success) {
      const resP = await obtenerDatosEnfermera(nuevoEmail)
      if (resP.success) setEnfermera(resP.nurse)
      setTimeout(() => setMensajePerfil(''), 3000)
    }
  }

  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensajePass('')
    if (passNueva !== passConfirmar) {
      setMensajePass('Las contraseñas no coinciden.')
      return
    }
    const res = await cambiarPassword('nurses', enfermera.email, passActual, passNueva)
    setMensajePass(res.message)
    if (res.success) {
      setPassActual('')
      setPassNueva('')
      setPassConfirmar('')
    }
  }

  const handleCerrarSesion = () => {
    window.location.href = '/login-corporativo'
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100 relative">
      
      {/* Indicador de Rol */}
      <div className="absolute top-6 right-6 bg-sky-900/40 text-sky-300 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-sky-800">
        Rol: Enfermería
      </div>

      <div className="max-w-4xl mx-auto space-y-6 pt-12 md:pt-0">
        
        {/* Cabecera */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-950 text-sky-400 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Bienvenido(a) {enfermera?.nombre_completo || 'Enfermero(a)'}</h1>
              <p className="text-xs text-slate-400 mt-0.5">Sistema Hospitalario de Gestión de Signos Vitales</p>
            </div>
          </div>
          <button
            onClick={handleCerrarSesion}
            className="px-4 py-2 bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-200 text-xs font-medium rounded-lg transition-colors duration-200"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Menú de Opciones */}
        <div className="flex gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => { setMenuActivo('pacientes'); setPacienteSeleccionado(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${menuActivo === 'pacientes' ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'}`}
          >
            Gestión de Pacientes y Chequeos
          </button>
          <button
            onClick={() => setMenuActivo('mi-perfil')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${menuActivo === 'mi-perfil' ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'}`}
          >
            Mi Información Personal
          </button>
        </div>

        {/* ================= MÓDULO PACIENTES Y CHEQUEOS ================= */}
        {menuActivo === 'pacientes' && (
          <div>
            {!pacienteSeleccionado ? (
              <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 space-y-6">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-sky-400">Búsqueda de Pacientes</h2>
                
                <form onSubmit={handleBuscar} className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={termino}
                      onChange={(e) => setTermino(e.target.value)}
                      placeholder="Buscar por Nombre, CURP o Correo..."
                      className="w-full pl-9 pr-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg text-sm"
                    />
                  </div>
                  <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg text-sm font-medium">
                    Buscar
                  </button>
                </form>

                <div className="space-y-2">
                  {pacientes.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setPacienteSeleccionado(p)}
                      className="p-4 bg-slate-800/50 hover:bg-sky-950/40 border border-slate-700 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div>
                        <h3 className="text-sm font-bold text-white">{p.nombre_completo}</h3>
                        <p className="text-xs text-slate-400">CURP: <span className="uppercase font-medium">{p.curp}</span> • Sangre: {p.tipo_sangre || 'N/D'}</p>
                      </div>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 text-white text-xs font-medium rounded-lg">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Atender / Asignar Signos</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <button onClick={() => setPacienteSeleccionado(null)} className="flex items-center gap-1 text-xs text-sky-400 font-medium hover:underline mb-1">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Volver a la búsqueda</span>
                      </button>
                      <h2 className="text-base font-bold text-white">Asignar Signos Vitales a {pacienteSeleccionado.nombre_completo}</h2>
                    </div>
                  </div>

                  <form onSubmit={handleGuardarSignos} className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Presión Arterial *</label>
                        <input type="text" required value={presion} onChange={(e) => setPresion(e.target.value)} placeholder="120/80" className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Frecuencia Cardíaca *</label>
                        <input type="number" required value={frecuencia} onChange={(e) => setFrecuencia(e.target.value)} placeholder="75" className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Temperatura (°C) *</label>
                        <input type="number" step="0.1" required value={temperatura} onChange={(e) => setTemperatura(e.target.value)} placeholder="36.5" className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg text-sm" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Observaciones / Notas</label>
                      <textarea rows={2} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Notas..." className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg text-sm"></textarea>
                    </div>

                    <button type="submit" disabled={cargando} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2">
                      <PlusCircle className="w-4 h-4" />
                      <span>{cargando ? 'Guardando...' : 'Registrar Signos Vitales'}</span>
                    </button>

                    {mensajeChequeo && <p className="text-xs text-center font-medium p-3 rounded-lg bg-sky-950 text-sky-300">{mensajeChequeo}</p>}
                  </form>
                </div>

                {/* Últimos 10 chequeos */}
                <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-400">Últimos Chequeos Registrados (Máx. 10)</h3>

                  {historial.length > 0 ? (
                    <div className="space-y-3">
                      {historial.map((item, index) => (
                        <div key={item.id || index} className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-700 pb-2">
                            <span className="flex items-center gap-1 font-medium text-slate-300">
                              <Calendar className="w-3.5 h-3.5 text-sky-400" />
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm pt-1">
                            <div><span className="block text-[10px] text-slate-500 uppercase">Presión</span><span className="font-bold text-white">{item.presion}</span></div>
                            <div><span className="block text-[10px] text-slate-500 uppercase">Frecuencia</span><span className="font-bold text-white">{item.frecuencia_cardiaca} lpm</span></div>
                            <div><span className="block text-[10px] text-slate-500 uppercase">Temperatura</span><span className="font-bold text-white">{item.temperatura} °C</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-6 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
                      Sin registros previos para este paciente.
                    </p>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

        {/* ================= MÓDULO MI INFORMACIÓN PERSONAL ================= */}
        {menuActivo === 'mi-perfil' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-sky-400">Mi Información Personal (Enfermería)</h2>
                <button 
                  onClick={() => setEditandoPerfil(!editandoPerfil)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-sky-950 text-slate-200 text-xs font-medium rounded-lg"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{editandoPerfil ? 'Cancelar' : 'Modificar Datos'}</span>
                </button>
              </div>

              {!editandoPerfil ? (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-slate-800/50 rounded-xl">
                    <span className="block text-[10px] text-slate-400 uppercase">Nombre Completo</span>
                    <span className="font-bold text-white">{enfermera?.nombre_completo}</span>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-xl">
                    <span className="block text-[10px] text-slate-400 uppercase">Correo Electrónico</span>
                    <span className="font-medium text-white">{enfermera?.email}</span>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-xl">
                    <span className="block text-[10px] text-slate-400 uppercase">Teléfono</span>
                    <span className="font-medium text-white">{enfermera?.telefono || 'No registrado'}</span>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-xl">
                    <span className="block text-[10px] text-slate-400 uppercase">Rol Asignado</span>
                    <span className="font-medium text-sky-400">Personal de Enfermería Autorizado</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleActualizarPerfil} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Correo Electrónico</label>
                    <input type="email" value={nuevoEmail} onChange={(e) => setNuevoEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Teléfono</label>
                    <input type="text" maxLength={10} value={nuevoTelefono} onChange={(e) => setNuevoTelefono(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg text-sm" />
                  </div>
                  <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 rounded-lg text-xs flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                  </button>
                  {mensajePerfil && (
                    <p className={`text-xs text-center font-medium p-2 rounded-lg ${mensajePerfil === 'Guardado exitoso' ? 'bg-sky-950 text-sky-300' : 'bg-rose-950 text-rose-300'}`}>
                      {mensajePerfil}
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Módulo de Cambio de Contraseña */}
            <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Seguridad / Cambiar Contraseña</span>
              </h3>
              <form onSubmit={handleCambiarPassword} className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-400 uppercase mb-1">Contraseña Actual</label>
                  <input type="password" required value={passActual} onChange={(e) => setPassActual(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 uppercase mb-1">Nueva Contraseña (Mín. 8 caracteres)</label>
                  <input type="password" required minLength={8} value={passNueva} onChange={(e) => setPassNueva(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 uppercase mb-1">Confirmar Nueva Contraseña</label>
                  <input type="password" required minLength={8} value={passConfirmar} onChange={(e) => setPassConfirmar(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg text-sm" />
                </div>
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 rounded-lg text-xs">
                  Actualizar Contraseña
                </button>
                {mensajePass && (
                  <p className={`text-xs text-center p-2 rounded-lg ${mensajePass.includes('éxito') ? 'bg-sky-950 text-sky-300' : 'bg-rose-950 text-rose-300'}`}>
                    {mensajePass}
                  </p>
                )}
              </form>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}