"use client";
import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { User, Lock, LogOut, Search, Activity, Bluetooth, FileText, Users, Shield, CheckCircle } from "lucide-react";
import { registrarEnfermera, obtenerEnfermeras, obtenerCoAminstradores, buscarPacientes, registrarSignosAdmin, obtenerHistorialPaciente, obtenerCitasPaciente } from "./actions";

export default function AdminDashboard() {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("buscar");
  const [fechaCDMX, setFechaCDMX] = useState("");
  const [mensajeGlobal, setMensajeGlobal] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);
  
  // Estados para BD de personal
  const [passAleatoria, setPassAleatoria] = useState(true);
  const [passGeneradaVisual, setPassGeneradaVisual] = useState<string | null>(null);
  const [listaEnfermeras, setListaEnfermeras] = useState<any[]>([]);
  const [listaCoadmins, setListaCoadmins] = useState<any[]>([]);

  // Estados para BD de Pacientes (Módulos Médicos)
  const [queryBusqueda, setQueryBusqueda] = useState("");
  const [resultadosPacientes, setResultadosPacientes] = useState<any[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<{id: number, nombre_completo: string, email: string} | null>(null);
  const [historialSignos, setHistorialSignos] = useState<any[]>([]);
  const [historialCitas, setHistorialCitas] = useState<any[]>([]);

  const cargarDatosUsuarios = async () => {
    const enfermeras = await obtenerEnfermeras();
    const admins = await obtenerCoAminstradores();
    setListaEnfermeras(enfermeras);
    setListaCoadmins(admins);
  };

  useEffect(() => {
    cargarDatosUsuarios();
    const intervalo = setInterval(() => {
      setFechaCDMX(new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }));
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  // --- Funciones de Personal ---
  const handleAltaEnfermera = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensajeGlobal(null);
    setPassGeneradaVisual(null);
    const formData = new FormData(e.currentTarget);
    formData.append("passAleatoria", passAleatoria.toString());

    startTransition(async () => {
      const res = await registrarEnfermera(formData);
      setMensajeGlobal({ texto: res.message, tipo: res.success ? "exito" : "error" });
      if (res.success) {
        if (res.passwordGenerada) setPassGeneradaVisual(res.passwordGenerada);
        (e.target as HTMLFormElement).reset();
        cargarDatosUsuarios();
      }
    });
  };

  // --- Funciones Médicas ---
  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await buscarPacientes(queryBusqueda);
    setResultadosPacientes(res);
  };

  const cargarHistorial = async (pacienteId: number) => {
    startTransition(async () => {
      const signos = await obtenerHistorialPaciente(pacienteId);
      const citas = await obtenerCitasPaciente(pacienteId);
      setHistorialSignos(signos);
      setHistorialCitas(citas);
    });
  };

  const handleSignosSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensajeGlobal(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await registrarSignosAdmin({
        patientId: Number(formData.get("patientId")),
        presion: formData.get("presion") as string,
        frecuenciaCardiaca: Number(formData.get("frecuenciaCardiaca")),
        temperatura: Number(formData.get("temperatura")),
        observaciones: formData.get("observaciones") as string,
      });
      setMensajeGlobal({ texto: res.message, tipo: res.success ? "exito" : "error" });
      if(res.success) (e.target as HTMLFormElement).reset();
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* Sidebar Morado */}
      <aside className="w-64 bg-slate-900 border-r border-purple-900/30 flex flex-col">
        <div className="p-6 border-b border-purple-900/30">
          <h2 className="text-xl font-bold text-purple-400">AcompañaT</h2>
          <span className="text-xs font-semibold bg-purple-950 text-purple-300 px-2 py-1 rounded mt-2 inline-block">JERARQUÍA: ADMIN</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {[
            { id: "buscar", icon: Search, label: "Buscar Paciente" },
            { id: "historial", icon: FileText, label: "Historial / Citas" },
            { id: "signos", icon: Activity, label: "Captura Signos" },
            { id: "bluetooth", icon: Bluetooth, label: "Bluetooth" }
          ].map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setMensajeGlobal(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === item.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'hover:bg-slate-800'}`}>
              <item.icon size={18}/> {item.label}
            </button>
          ))}
          <hr className="border-slate-800 my-4" />
          <button onClick={() => { setActiveTab("enfermeras"); setMensajeGlobal(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'enfermeras' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'hover:bg-slate-800'}`}><Users size={18}/> Personal Enfermería</button>
          <button onClick={() => { setActiveTab("coadmins"); setMensajeGlobal(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'coadmins' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'hover:bg-slate-800'}`}><Shield size={18}/> Co-Administradores</button>
          <hr className="border-slate-800 my-4" />
          <button onClick={() => { setActiveTab("seguridad"); setMensajeGlobal(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'seguridad' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'hover:bg-slate-800'}`}><Lock size={18}/> Contraseña</button>
        </nav>
        <div className="p-4 border-t border-purple-900/30">
          <Link href="/login-corporativo" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"><LogOut size={18}/> Cerrar Sesión</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Hola, Administrador Principal</h1>
            <p className="text-slate-400 mt-1">Panel de Control General.</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-purple-400">Ciudad de México</p>
            <p className="text-xs text-slate-500">{fechaCDMX}</p>
          </div>
        </header>

        {pacienteSeleccionado && (
          <div className="mb-6 p-4 bg-purple-950/30 border border-purple-900/50 rounded-xl flex justify-between items-center max-w-4xl">
            <div>
              <p className="text-xs text-purple-400 uppercase font-bold tracking-wider mb-1">Paciente Activo (Revisión Admin)</p>
              <p className="text-white font-medium">{pacienteSeleccionado.nombre_completo} (ID: {pacienteSeleccionado.id})</p>
            </div>
            <button onClick={() => setPacienteSeleccionado(null)} className="text-xs text-slate-400 hover:text-white border border-slate-700 px-3 py-1.5 rounded-lg transition-colors">Desmarcar</button>
          </div>
        )}

        {mensajeGlobal && (
          <div className={`mb-6 p-4 flex items-center gap-3 rounded-xl border text-sm font-medium max-w-4xl ${mensajeGlobal.tipo === 'exito' ? 'bg-emerald-950/30 border-emerald-800 text-emerald-400' : 'bg-rose-950/30 border-rose-800 text-rose-400'}`}>
            <CheckCircle size={18} /> {mensajeGlobal.texto}
          </div>
        )}

        {/* c3) BÚSQUEDA */}
        {activeTab === "buscar" && (
           <section className="animate-in fade-in duration-300 max-w-4xl">
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Search className="text-purple-500"/> Búsqueda</h2>
             <form onSubmit={handleBuscar} className="flex gap-4 mb-8">
               <input type="text" value={queryBusqueda} onChange={(e)=>setQueryBusqueda(e.target.value)} placeholder="Buscar por Nombre, CURP o Correo..." className="flex-1 bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-3 text-white outline-none text-sm" />
               <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-6 py-3 rounded-xl transition-colors">Buscar</button>
             </form>
             
             <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
               <table className="w-full text-sm text-left">
                 <thead className="bg-slate-950 text-slate-400">
                   <tr><th className="px-6 py-3">Nombre</th><th className="px-6 py-3">CURP</th><th className="px-6 py-3 text-right">Acción</th></tr>
                 </thead>
                 <tbody>
                   {resultadosPacientes.length === 0 ? (
                     <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">Realiza una búsqueda para cargar pacientes</td></tr>
                   ) : (
                     resultadosPacientes.map(p => (
                       <tr key={p.id} className="border-t border-slate-800 hover:bg-slate-800/50">
                         <td className="px-6 py-4 text-white font-medium">{p.nombre_completo}</td>
                         <td className="px-6 py-4 text-slate-400">{p.curp}</td>
                         <td className="px-6 py-4 flex gap-3 justify-end">
                           <button onClick={() => { setPacienteSeleccionado(p); cargarHistorial(p.id); setActiveTab("historial"); }} className="text-slate-400 hover:text-white font-medium text-xs border border-slate-700 px-3 py-1 rounded">Historial</button>
                           <button onClick={() => { setPacienteSeleccionado(p); setActiveTab("signos"); }} className="bg-purple-900/50 text-purple-300 hover:bg-purple-900 border border-purple-800 px-3 py-1 rounded font-medium text-xs">Capturar</button>
                         </td>
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>
             </div>
           </section>
        )}

        {/* c5) CAPTURA DE SIGNOS */}
        {activeTab === "signos" && (
           <section className="animate-in fade-in duration-300 max-w-4xl">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Activity className="text-purple-500"/> Constantes</h2>
             <form onSubmit={handleSignosSubmit} className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-6">
               <div>
                 <label className="block text-xs uppercase text-slate-400 mb-2">ID Paciente</label>
                 <input type="number" name="patientId" defaultValue={pacienteSeleccionado?.id || ""} required className="w-full max-w-xs bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm" />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 <div>
                   <label className="block text-xs uppercase text-slate-400 mb-2">Presión Arterial</label>
                   <input type="text" name="presion" required placeholder="Ej: 120/80" className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs uppercase text-slate-400 mb-2">Frecuencia Cardíaca</label>
                   <input type="number" name="frecuenciaCardiaca" required placeholder="LPM" className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs uppercase text-slate-400 mb-2">Temp (°C)</label>
                   <input type="number" step="0.1" name="temperatura" required placeholder="Ej: 36.5" className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm" />
                 </div>
               </div>
               <div>
                 <label className="block text-xs uppercase text-slate-400 mb-2">Observaciones</label>
                 <textarea name="observaciones" rows={3} className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl p-4 text-white outline-none text-sm" />
               </div>
               <button type="submit" disabled={isPending} className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium px-8 py-3 rounded-xl transition-colors">
                 Guardar Signos (Vía Admin)
               </button>
             </form>
           </section>
        )}

        {/* c4 y c8) HISTORIAL CLÍNICO Y CITAS */}
        {activeTab === "historial" && (
           <section className="animate-in fade-in duration-300 max-w-4xl">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FileText className="text-purple-500"/> Historial Clínico</h2>
             {!pacienteSeleccionado ? (
               <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center"><p className="text-slate-400 mb-4">Selecciona un paciente en Buscar.</p></div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                   <h3 className="font-bold text-white mb-4 border-b border-slate-800 pb-2">Últimos Registros (vital_signs)</h3>
                   <div className="space-y-4">
                     {isPending ? <p className="text-slate-500 text-sm">Cargando...</p> : historialSignos.length === 0 ? <p className="text-slate-500 text-sm">Sin registros.</p> : (
                       historialSignos.map((s, idx) => (
                         <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                           <span className="text-slate-400">{new Date(s.created_at).toLocaleDateString()}</span>
                           <p className="text-slate-300 font-medium mt-1">PA: {s.presion} | FC: {s.frecuencia_cardiaca} | Temp: {s.temperatura}°C</p>
                           {s.observaciones && <p className="text-slate-500 italic mt-1">"{s.observaciones}"</p>}
                         </div>
                       ))
                     )}
                   </div>
                 </div>
                 <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                   <h3 className="font-bold text-white mb-4 border-b border-slate-800 pb-2">Citas del Año</h3>
                   <div className="space-y-3">
                     {historialCitas.map((c, idx) => (
                       <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300">
                         <p className="font-bold text-white">{c.tipo}</p><p>{c.fecha}</p>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             )}
           </section>
        )}

{/* c7) BLUETOOTH CONECTIVIDAD MÉDICA - ADMIN */}
        {activeTab === "bluetooth" && (
           <section className="animate-in fade-in duration-300 max-w-2xl">
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Bluetooth className="text-purple-400"/> Enlace de Dispositivos Médicos (Bluetooth LE)</h2>
             
             <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center space-y-6">
               <div className="relative w-24 h-24 mx-auto flex items-center justify-center bg-slate-950 rounded-full border border-slate-800">
                 <Bluetooth size={40} className="text-purple-400 animate-pulse" />
               </div>
               
               <div>
                 <h3 className="text-lg font-bold text-white mb-2">Sincronización de Constantes (Modo Supervisor)</h3>
                 <p className="text-slate-400 text-sm max-w-md mx-auto">
                   Vincula dispositivos médicos por Bluetooth LE para supervisar la captura remota de signos vitales en el sistema.
                 </p>
               </div>

               <div id="bluetooth-status-admin" className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
                 Estado: Desconectado
               </div>

               <button 
                 onClick={async () => {
                   const statusEl = document.getElementById("bluetooth-status-admin");
                   try {
                     if (!navigator.bluetooth) {
                       alert("Tu navegador no soporta Web Bluetooth. Usa Google Chrome en escritorio o Android.");
                       return;
                     }
                     
                     if(statusEl) statusEl.innerText = "Estado: Buscando dispositivos médicos cercanos...";
                     
                     // Solicitud genérica de dispositivo BLE (filtros de salud estándar)
                     const device = await navigator.bluetooth.requestDevice({
                       acceptAllDevices: true,
                       optionalServices: ['heart_rate', 'blood_pressure', 'health_thermometer']
                     });

                     if(statusEl) statusEl.innerText = `Estado: Conectando con ${device.name || 'Dispositivo médico'}...`;
                     
                     const server = await device.gatt?.connect();
                     if(statusEl) statusEl.innerText = `Estado: ¡Conectado exitosamente a ${device.name || 'Sensor'}!`;
                     
                     setTimeout(() => {
                       if(statusEl) statusEl.innerText = `Estado: Sincronización completada con éxito.`;
                     }, 1500);

                   } catch (error) {
                     console.error("Error Bluetooth Admin:", error);
                     if(statusEl) statusEl.innerText = "Estado: Conexión cancelada o fallida.";
                   }
                 }}
                 className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-8 py-3 rounded-xl transition-colors shadow-lg shadow-purple-900/20 text-sm flex items-center gap-2 mx-auto"
               >
                 <Bluetooth size={18} /> Buscar y Vincular Dispositivo
               </button>
             </div>
           </section>
        )}

        {/* c9) GESTIÓN DE ENFERMERAS */}
        {activeTab === "enfermeras" && (
           <section className="animate-in fade-in duration-300">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Users className="text-purple-500"/> Gestión de Personal de Enfermería</h2>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-fit">
                 <h3 className="text-lg font-bold mb-4 text-white border-b border-slate-800 pb-2">Registrar Nueva Enfermera</h3>
                 <form onSubmit={handleAltaEnfermera} className="space-y-5">
                   <div>
                     <label className="block text-xs uppercase text-slate-400 mb-2">Nombre Completo</label>
                     <input type="text" name="nombre" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-purple-500 text-white" />
                   </div>
                   <div>
                     <label className="block text-xs uppercase text-slate-400 mb-2">Correo Electrónico</label>
                     <input type="email" name="email" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-purple-500 text-white" />
                   </div>
                   <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                     <div className="flex items-center justify-between mb-2">
                       <label className="text-sm font-medium text-slate-300">Generar contraseña aleatoria</label>
                       <button type="button" onClick={() => setPassAleatoria(!passAleatoria)} className={`w-12 h-6 rounded-full transition-colors relative ${passAleatoria ? 'bg-purple-600' : 'bg-slate-700'}`}>
                         <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${passAleatoria ? 'translate-x-7' : 'translate-x-1'}`}></div>
                       </button>
                     </div>
                     {!passAleatoria && (
                       <input type="password" name="password" required={!passAleatoria} placeholder="Contraseña manual..." className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:border-purple-500 text-white mt-3" />
                     )}
                   </div>
                   <button type="submit" disabled={isPending} className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors text-sm">
                     {isPending ? "Registrando en BD..." : "Crear Cuenta"}
                   </button>
                 </form>
                 {passGeneradaVisual && (
                   <div className="mt-4 p-4 bg-purple-950/40 border border-purple-800 rounded-lg text-sm text-center">
                     <p className="text-purple-300 mb-1">Contraseña generada (Cópiala ahora):</p>
                     <p className="text-xl font-mono text-white font-bold tracking-widest">{passGeneradaVisual}</p>
                   </div>
                 )}
               </div>
               <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-fit max-h-[600px] overflow-y-auto">
                 <h3 className="text-lg font-bold mb-4 text-white border-b border-slate-800 pb-2">Plantilla Activa ({listaEnfermeras.length})</h3>
                 <div className="space-y-3">
                    {listaEnfermeras.length === 0 ? <p className="text-sm text-slate-500 text-center py-4">No hay enfermeras registradas.</p> : (
                      listaEnfermeras.map((enf) => (
                        <div key={enf.id} className="flex justify-between items-center p-3 bg-slate-950 border border-slate-800 rounded-lg">
                          <div><p className="text-white text-sm font-medium">{enf.nombre_completo}</p><p className="text-slate-500 text-xs">{enf.email}</p></div>
                          <span className="px-2 py-1 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded text-xs">Activa</span>
                        </div>
                      ))
                    )}
                 </div>
               </div>
             </div>
           </section>
        )}

        {/* c10) CO-ADMINISTRADORES */}
        {activeTab === "coadmins" && (
           <section className="animate-in fade-in duration-300 max-w-4xl">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Shield className="text-purple-500"/> Co-Administradores</h2>
             <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                {listaCoadmins.length === 0 ? <p className="text-sm text-slate-500 text-center py-4">No hay co-administradores registrados.</p> : (
                  listaCoadmins.map((admin) => (
                    <div key={admin.id} className="flex justify-between items-center p-4 bg-slate-950 border border-slate-800 rounded-lg mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 font-bold">{admin.nombre_completo?.charAt(0) || "A"}</div>
                        <div><p className="text-white font-medium">{admin.nombre_completo}</p><p className="text-slate-500 text-xs">{admin.email}</p></div>
                      </div>
                    </div>
                  ))
                )}
             </div>
           </section>
        )}
      </main>
    </div>
  );
}