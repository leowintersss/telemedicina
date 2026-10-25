'use client'

import { useState, useEffect } from 'react'
import { buscarPacientes, obtenerHistorialSignosAdmin, registrarSignosAdmin, obtenerEnfermeras, registrarEnfermera, obtenerAdmins } from './actions'
import { cambiarPassword, adminResetPassword } from '../actions-seguridad'
import { Search, UserCheck, PlusCircle, ArrowLeft, Calendar, Clock, ShieldAlert, Users, UserPlus, FileText, UserCog, Lock, KeyRound } from 'lucide-react'

export default function PanelAdminPage() {
  const [menuActivo, setMenuActivo] = useState<'pacientes' | 'personal' | 'administracion'>('pacientes')

  // Estados módulo Pacientes
  const [termino, setTermino] = useState('')
  const [listaPacientes, setListaPacientes] = useState<any[]>([])
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<any>(null)
  const [historial, setHistorial] = useState<any[]>([])
  const [presion, setPresion] = useState('')
  const [frecuencia, setFrecuencia] = useState('')
  const [temperatura, setTemperatura] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [mensajeChequeo, setMensajeChequeo] = useState('')
  const [cargandoChequeo, setCargandoChequeo] = useState(false)

  // Estados módulo Personal (Enfermeras)
  const [enfermeras, setEnfermeras] = useState<any[]>([])
  const [nombreEnfermera, setNombreEnfermera] = useState('')
  const [emailEnfermera, setEmailEnfermera] = useState('')
  const [passwordEnfermera, setPasswordEnfermera] = useState('')
  const [telefonoEnfermera, setTelefonoEnfermera] = useState('')
  const [mensajeEnfermera, setMensajeEnfermera] = useState('')

  // Estados módulo Administración
  const [listaAdmins, setListaAdmins] = useState<any[]>([])
  const [passActualAdmin, setPassActualAdmin] = useState('')
  const [passNuevaAdmin, setPassNuevaAdmin] = useState('')
  const [passConfirmarAdmin, setPassConfirmarAdmin] = useState('')
  const [mensajePassAdmin, setMensajePassAdmin] = useState('')

  // Estados para Recuperación / Restablecimiento Admin
  const [emailReset, setEmailReset] = useState('')
  const [rolReset, setRolReset] = useState<'nurses' | 'admins'>('nurses')
  const [nuevoPassTemp, setNuevoPassTemp] = useState('')
  const [mensajeReset, setMensajeReset] = useState('')

  useEffect(() => {
    cargarDatosGenerales()
  }, [])

  useEffect(() => {
    if (pacienteSeleccionado) {
      cargarHistorialPaciente(pacienteSeleccionado.id)
    }
  }, [pacienteSeleccionado])

  const cargarDatosGenerales = async () => {
    const resEnf = await obtenerEnfermeras()
    if (resEnf.success) setEnfermeras(resEnf.enfermeras)

    const resAdm = await obtenerAdmins()
    if (resAdm.success) setListaAdmins(resAdm.admins)
  }

  const cargarHistorialPaciente = async (id: number) => {
    const res = await obtenerHistorialSignosAdmin(id)
    if (res.success) setHistorial(res.historial)
  }

  const handleBuscarPacientes = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await buscarPacientes(termino)
    if (res.success) setListaPacientes(res.pacientes)
  }

  const handleGuardarChequeo = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargandoChequeo(true)
    setMensajeChequeo('')
    const res = await registrarSignosAdmin({
      patientId: pacienteSeleccionado.id,
      presion,
      frecuenciaCardiaca: Number(frecuencia),
      temperatura: Number(temperatura),
      observaciones,
    })
    setMensajeChequeo(res.message)
    setCargandoChequeo(false)
    if (res.success) {
      setPresion('')
      setFrecuencia('')
      setTemperatura('')
      setObservaciones('')
      cargarHistorialPaciente(pacienteSeleccionado.id)
    }
  }

  const handleAltaEnfermera = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensajeEnfermera('')
    const res = await registrarEnfermera({
      nombre: nombreEnfermera,
      email: emailEnfermera,
      password: passwordEnfermera,
      telefono: telefonoEnfermera,
    })
    setMensajeEnfermera(res.message)
    if (res.success) {
      setNombreEnfermera('')
      setEmailEnfermera('')
      setPasswordEnfermera('')
      setTelefonoEnfermera('')
      cargarDatosGenerales()
    }
  }

  const handleCambiarPasswordAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensajePassAdmin('')
    if (passNuevaAdmin !== passConfirmarAdmin) {
      setMensajePassAdmin('Las contraseñas no coinciden.')
      return
    }
    const res = await cambiarPassword('admins', 'admin1@sistema.com', passActualAdmin, passNuevaAdmin)
    setMensajePassAdmin(res.message)
    if (res.success) {
      setPassActualAdmin('')
      setPassNuevaAdmin('')
      setPassConfirmarAdmin('')
    }
  }

  const handleAdminReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensajeReset('')
    const res = await adminResetPassword(rolReset, emailReset, nuevoPassTemp)
    setMensajeReset(res.message)
    if (res.success) {
      setEmailReset('')
      setNuevoPassTemp('')
    }
  }

  const handleCerrarSesion = () => {
    window.location.href = '/login-corporativo'
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100 relative">
      
      {/* Indicador de Rol */}
      <div className="absolute top-6 right-6 bg-purple-900/40 text-purple-300 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-purple-800">
        Rol: Admin
      </div>

      <div className="max-w-5xl mx-auto space-y-6 pt-12 md:pt-0">
        
        {/* Cabecera */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-950 text-purple-400 rounded-xl flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Bienvenido Administrador Supremo</h1>
              <p className="text-xs text-slate-400 mt-0.5">Control Central del Sistema Médico Hospitalario</p>
            </div>
          </div>
          <button
            onClick={handleCerrarSesion}
            className="px-4 py-2 bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-200 text-xs font-medium rounded-lg transition-colors duration-200"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Menú de Navegación */}
        <div className="flex gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => { setMenuActivo('pacientes'); setPacienteSeleccionado(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${menuActivo === 'pacientes' ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'}`}
          >
            <FileText className="w-4 h-4" />
            <span>Pacientes</span>
          </button>

          <button
            onClick={() => setMenuActivo('personal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${menuActivo === 'personal' ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'}`}
          >
            <Users className="w-4 h-4" />
            <span>Personal (Enfermería)</span>
          </button>

          <button
            onClick={() => setMenuActivo('administracion')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${menuActivo === 'administracion' ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'}`}
          >
            <UserCog className="w-4 h-4" />
            <span>Administración (Co-Admins)</span>
          </button>
        </div>

        {/* ================= MÓDULO PACIENTES ================= */}
        {menuActivo === 'pacientes' && (
          <div>
            {!pacienteSeleccionado ? (
              <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 space-y-6">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-purple-400">Buscar Paciente en el Sistema</h2>
                
                <form onSubmit={handleBuscarPacientes} className="flex gap-3">
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
                  <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-medium">
                    Buscar
                  </button>
                </form>

                <div className="space-y-2">
                  {listaPacientes.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setPacienteSeleccionado(p)}
                      className="p-4 bg-slate-800/50 hover:bg-purple-950/40 border border-slate-700 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div>
                        <h3 className="text-sm font-bold text-white">{p.nombre_completo}</h3>
                        <p className="text-xs text-slate-400">CURP: <span className="uppercase font-medium">{p.curp}</span> • Correo: {p.email}</p>
                      </div>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Ver Expediente / Chequeo</span>
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
                      <button onClick={() => setPacienteSeleccionado(null)} className="flex items-center gap-1 text-xs text-purple-400 font-medium hover:underline mb-1">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Volver a la búsqueda</span>
                      </button>
                      <h2 className="text-base font-bold text-white">Expediente de {pacienteSeleccionado.nombre_completo}</h2>
                      <p className="text-xs text-slate-400">CURP: <span className="uppercase">{pacienteSeleccionado.curp}</span> | Tel: {pacienteSeleccionado.telefono || 'No reg.'} | Sangre: {pacienteSeleccionado.tipo_sangre || 'N/D'}</p>
                    </div>
                  </div>

                  <form onSubmit={handleGuardarChequeo} className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-400">Generar Nuevo Chequeo Médico</h3>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Presión *</label>
                        <input type="text" required value={presion} onChange={(e) => setPresion(e.target.value)} placeholder="120/80" className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Frecuencia *</label>
                        <input type="number" required value={frecuencia} onChange={(e) => setFrecuencia(e.target.value)} placeholder="75" className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Temperatura *</label>
                        <input type="number" step="0.1" required value={temperatura} onChange={(e) => setTemperatura(e.target.value)} placeholder="36.5" className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg text-sm" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Observaciones</label>
                      <textarea rows={2} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Notas..." className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg text-sm"></textarea>
                    </div>

                    <button type="submit" disabled={cargandoChequeo} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2">
                      <PlusCircle className="w-4 h-4" />
                      <span>{cargandoChequeo ? 'Guardando...' : 'Guardar Chequeo'}</span>
                    </button>

                    {mensajeChequeo && <p className="text-xs text-center font-medium p-3 rounded-lg bg-purple-950 text-purple-300">{mensajeChequeo}</p>}
                  </form>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-400">Historial de Revisiones (Reciente a Antiguo)</h3>

                  {historial.length > 0 ? (
                    <div className="space-y-3">
                      {historial.map((item, index) => (
                        <div key={item.id || index} className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-700 pb-2">
                            <span className="flex items-center gap-1 font-medium text-slate-300">
                              <Calendar className="w-3.5 h-3.5 text-purple-400" />
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
                      Sin historial registrado.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= MÓDULO PERSONAL ================= */}
        {menuActivo === 'personal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-purple-400">Personal de Enfermería a Cargo</h2>
              <div className="space-y-3">
                {enfermeras.map((enf) => (
                  <div key={enf.id} className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl">
                    <h3 className="text-sm font-bold text-white">{enf.nombre_completo}</h3>
                    <p className="text-xs text-slate-400">Correo: {enf.email}</p>
                    <p className="text-xs text-slate-400">Teléfono: {enf.telefono || 'No reg.'}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-purple-400">Dar de Alta Nueva Enfermera</h2>
              <form onSubmit={handleAltaEnfermera} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Nombre Completo *</label>
                  <input type="text" required value={nombreEnfermera} onChange={(e) => setNombreEnfermera(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Correo Electrónico *</label>
                  <input type="email" required value={emailEnfermera} onChange={(e) => setEmailEnfermera(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Contraseña (Mín. 8) *</label>
                  <input type="password" required minLength={8} value={passwordEnfermera} onChange={(e) => setPasswordEnfermera(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Teléfono</label>
                  <input type="text" maxLength={10} value={telefonoEnfermera} onChange={(e) => setTelefonoEnfermera(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg text-sm" />
                </div>
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Registrar Enfermera</span>
                </button>
                {mensajeEnfermera && <p className="text-xs text-center p-2 rounded-lg bg-purple-950 text-purple-300">{mensajeEnfermera}</p>}
              </form>
            </div>
          </div>
        )}

        {/* ================= MÓDULO ADMINISTRACIÓN ================= */}
        {menuActivo === 'administracion' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Lista de Co-Admins */}
            <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-purple-400">Co-Administradores Oficiales</h2>
              <div className="space-y-3">
                {listaAdmins.map((adm) => (
                  <div key={adm.id} className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl space-y-1">
                    <h3 className="text-sm font-bold text-white">{adm.nombre_completo}</h3>
                    <p className="text-xs text-slate-400">Correo: {adm.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-purple-950 text-purple-300 text-[10px] font-bold rounded-full border border-purple-800">
                      Acceso Supremo
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel de Seguridad Admin y Recuperación */}
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Cambiar Mi Contraseña (Admin)</span>
                </h2>
                <form onSubmit={handleCambiarPasswordAdmin} className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase mb-1">Contraseña Actual</label>
                    <input type="password" required value={passActualAdmin} onChange={(e) => setPassActualAdmin(e.target.value)} className="w-full px-3 py-1.5 border border-slate-700 bg-slate-800 rounded-lg text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase mb-1">Nueva Contraseña (Mín. 8)</label>
                    <input type="password" required minLength={8} value={passNuevaAdmin} onChange={(e) => setPassNuevaAdmin(e.target.value)} className="w-full px-3 py-1.5 border border-slate-700 bg-slate-800 rounded-lg text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase mb-1">Confirmar Nueva</label>
                    <input type="password" required minLength={8} value={passConfirmarAdmin} onChange={(e) => setPassConfirmarAdmin(e.target.value)} className="w-full px-3 py-1.5 border border-slate-700 bg-slate-800 rounded-lg text-xs text-white" />
                  </div>
                  <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1.5 rounded-lg text-xs font-medium">
                    Actualizar Contraseña
                  </button>
                  {mensajePassAdmin && <p className="text-xs text-center p-2 rounded-lg bg-purple-950 text-purple-300">{mensajePassAdmin}</p>}
                </form>
              </div>

              {/* Recuperación de contraseña para personal */}
              <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  <span>Restablecer Contraseña de Personal</span>
                </h2>
                <form onSubmit={handleAdminReset} className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase mb-1">Rol de Destino</label>
                    <select value={rolReset} onChange={(e) => setRolReset(e.target.value as any)} className="w-full px-3 py-1.5 border border-slate-700 bg-slate-800 rounded-lg text-xs text-white">
                      <option value="nurses">Enfermería</option>
                      <option value="admins">Co-Administrador</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase mb-1">Correo Electrónico</label>
                    <input type="email" required value={emailReset} onChange={(e) => setEmailReset(e.target.value)} placeholder="correo@sistema.com" className="w-full px-3 py-1.5 border border-slate-700 bg-slate-800 rounded-lg text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase mb-1">Nueva Contraseña Temporal (Mín. 8)</label>
                    <input type="password" required minLength={8} value={nuevoPassTemp} onChange={(e) => setNuevoPassTemp(e.target.value)} className="w-full px-3 py-1.5 border border-slate-700 bg-slate-800 rounded-lg text-xs text-white" />
                  </div>
                  <button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white py-1.5 rounded-lg text-xs font-medium">
                    Restablecer Credenciales
                  </button>
                  {mensajeReset && <p className="text-xs text-center p-2 rounded-lg bg-purple-950 text-purple-300">{mensajeReset}</p>}
                </form>
              </div>

            </div>

          </div>
        )}

      </div>
    </main>
  )
}