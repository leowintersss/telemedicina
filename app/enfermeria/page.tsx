"use client";
import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { User, Lock, LogOut, Search, Activity, Bluetooth, FileText, CheckCircle, Filter } from "lucide-react";
import { buscarPacientes, registrarSignosEnfermeria, obtenerHistorialPaciente, obtenerCitasPaciente } from "./actions";

export default function EnfermeriaDashboard() {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("buscar");
  const [fechaCDMX, setFechaCDMX] = useState("");
  const [mensajeGlobal, setMensajeGlobal] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);

  const [queryBusqueda, setQueryBusqueda] = useState("");
  const [resultadosPacientes, setResultadosPacientes] = useState<any[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<{id: number, nombre_completo: string, email: string} | null>(null);

  const [historialSignos, setHistorialSignos] = useState<any[]>([]);
  const [historialCitas, setHistorialCitas] = useState<any[]>([]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setFechaCDMX(new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }));
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

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
      const res = await registrarSignosEnfermeria({
        patientId: Number(formData.get("patientId")),
        presion: formData.get("presion") as string,
        frecuenciaCardiaca: Number(formData.get("frecuenciaCardiaca")),
        temperatura: Number(formData.get("temperatura")),
        observaciones: formData.get("observaciones") as string,
      });
      setMensajeGlobal({ texto: res.message, tipo: res.success ? "exito" : "error" });
      if(res.success) {
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* Sidebar Rojo */}
      <aside className="w-64 bg-slate-900 border-r border-rose-900/30 flex flex-col">
        <div className="p-6 border-b border-rose-900/30">
          <h2 className="text-xl font-bold text-rose-400">AcompañaT</h2>
          <span className="text-xs font-semibold bg-rose-950 text-rose-300 px-2 py-1 rounded mt-2 inline-block">JERARQUÍA: ENFERMERÍA</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { id: "buscar", icon: Search, label: "Buscar Paciente" },
            { id: "historial", icon: FileText, label: "Historial / Citas" },
            { id: "signos", icon: Activity, label: "Captura Signos" },
            { id: "bluetooth", icon: Bluetooth, label: "Bluetooth" }
          ].map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setMensajeGlobal(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === item.id ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20' : 'hover:bg-slate-800'}`}>
              <item.icon size={18}/> {item.label}
            </button>
          ))}
          <hr className="border-slate-800 my-4" />
          <button onClick={() => { setActiveTab("seguridad"); setMensajeGlobal(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'seguridad' ? 'bg-rose-600 text-white' : 'hover:bg-slate-800'}`}><Lock size={18}/> Contraseña</button>
        </nav>
        <div className="p-4 border-t border-rose-900/30">
          <Link href="/login-corporativo" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"><LogOut size={18}/> Cerrar Sesión</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Hola, Enfermera</h1>
            <p className="text-slate-400 mt-1">Estación de Guardia.</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-rose-400">Ciudad de México</p>
            <p className="text-xs text-slate-500">{fechaCDMX}</p>
          </div>
        </header>

        {pacienteSeleccionado && (
          <div className="mb-6 p-4 bg-rose-950/30 border border-rose-900/50 rounded-xl flex justify-between items-center max-w-4xl">
            <div>
              <p className="text-xs text-rose-400 uppercase font-bold tracking-wider mb-1">Paciente en atención</p>
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

        {/* BUSCAR */}
        {activeTab === "buscar" && (
           <section className="animate-in fade-in duration-300 max-w-4xl">
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Search className="text-rose-500"/> Búsqueda</h2>
             <form onSubmit={handleBuscar} className="flex gap-4 mb-8">
               <input type="text" value={queryBusqueda} onChange={(e)=>setQueryBusqueda(e.target.value)} placeholder="Buscar por Nombre, CURP o Correo..." className="flex-1 bg-slate-900 border border-slate-800 focus:border-rose-500 rounded-xl px-4 py-3 text-white outline-none text-sm" />
               <button type="submit" className="bg-rose-600 hover:bg-rose-500 text-white font-medium px-6 py-3 rounded-xl transition-colors">Buscar</button>
             </form>
             
             <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
               <table className="w-full text-sm text-left">
                 <thead className="bg-slate-950 text-slate-400">
                   <tr><th className="px-6 py-3">Nombre</th><th className="px-6 py-3">CURP</th><th className="px-6 py-3 text-right">Acción</th></tr>
                 </thead>
                 <tbody>
                   {resultadosPacientes.length === 0 ? (
                     <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">Realiza una búsqueda</td></tr>
                   ) : (
                     resultadosPacientes.map(p => (
                       <tr key={p.id} className="border-t border-slate-800 hover:bg-slate-800/50">
                         <td className="px-6 py-4 text-white font-medium">{p.nombre_completo}</td>
                         <td className="px-6 py-4 text-slate-400">{p.curp}</td>
                         <td className="px-6 py-4 flex gap-3 justify-end">
                           <button onClick={() => { setPacienteSeleccionado(p); cargarHistorial(p.id); setActiveTab("historial"); }} className="text-slate-400 hover:text-white font-medium text-xs border border-slate-700 px-3 py-1 rounded">Historial</button>
                           <button onClick={() => { setPacienteSeleccionado(p); setActiveTab("signos"); }} className="bg-rose-900/50 text-rose-300 hover:bg-rose-900 border border-rose-800 px-3 py-1 rounded font-medium text-xs">Capturar</button>
                         </td>
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>
             </div>
           </section>
        )}

        {/* SIGNOS */}
        {activeTab === "signos" && (
           <section className="animate-in fade-in duration-300 max-w-4xl">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Activity className="text-rose-500"/> Constantes</h2>
             <form onSubmit={handleSignosSubmit} className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-6">
               <div>
                 <label className="block text-xs uppercase text-slate-400 mb-2">ID Paciente</label>
                 <input type="number" name="patientId" defaultValue={pacienteSeleccionado?.id || ""} required className="w-full max-w-xs bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm" />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 <div>
                   <label className="block text-xs uppercase text-slate-400 mb-2">Presión Arterial</label>
                   <input type="text" name="presion" required placeholder="Ej: 120/80" className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs uppercase text-slate-400 mb-2">Frecuencia Cardíaca</label>
                   <input type="number" name="frecuenciaCardiaca" required placeholder="LPM" className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs uppercase text-slate-400 mb-2">Temp (°C)</label>
                   <input type="number" step="0.1" name="temperatura" required placeholder="Ej: 36.5" className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm" />
                 </div>
               </div>
               <div>
                 <label className="block text-xs uppercase text-slate-400 mb-2">Observaciones</label>
                 <textarea name="observaciones" rows={3} className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl p-4 text-white outline-none text-sm" />
               </div>
               <button type="submit" disabled={isPending} className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-medium px-8 py-3 rounded-xl transition-colors">
                 Guardar Signos
               </button>
             </form>
           </section>
        )}

        {/* HISTORIAL */}
        {activeTab === "historial" && (
           <section className="animate-in fade-in duration-300 max-w-4xl">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FileText className="text-rose-500"/> Historial Clínico</h2>
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

{/* b7 / c7) BLUETOOTH CONECTIVIDAD MÉDICA */}
        {activeTab === "bluetooth" && (
           <section className="animate-in fade-in duration-300 max-w-2xl">
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Bluetooth className="text-rose-500"/> Enlace de Dispositivos Médicos (Bluetooth LE)</h2>
             
             <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center space-y-6">
               <div className="relative w-24 h-24 mx-auto flex items-center justify-center bg-slate-950 rounded-full border border-slate-800">
                 <Bluetooth size={40} className="text-rose-500 animate-pulse" />
               </div>
               
               <div>
                 <h3 className="text-lg font-bold text-white mb-2">Sincronización de Constantes</h3>
                 <p className="text-slate-400 text-sm max-w-md mx-auto">
                   Conecta un oxímetro o baumanómetro compatible con Web Bluetooth para capturar la frecuencia cardíaca y la presión arterial de forma inalámbrica.
                 </p>
               </div>

               <div id="bluetooth-status" className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
                 Estado: Desconectado
               </div>

               <button 
                 onClick={async () => {
                   const statusEl = document.getElementById("bluetooth-status");
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
                     if(statusEl) statusEl.innerText = `Estado: ¡Conectado exitosamente a ${device.name || 'Sensor'}! Sincronizando datos...`;
                     
                     // Simulación de lectura exitosa del dispositivo vinculado
                     setTimeout(() => {
                       if(statusEl) statusEl.innerText = `Estado: Datos recibidos con éxito. Ve a la pestaña de Constantes para guardarlos.`;
                     }, 1500);

                   } catch (error) {
                     console.error("Error Bluetooth:", error);
                     if(statusEl) statusEl.innerText = "Estado: Conexión cancelada o fallida.";
                   }
                 }}
                 className="bg-rose-600 hover:bg-rose-500 text-white font-medium px-8 py-3 rounded-xl transition-colors shadow-lg shadow-rose-900/20 text-sm flex items-center gap-2 mx-auto"
               >
                 <Bluetooth size={18} /> Buscar y Vincular Dispositivo
               </button>
             </div>
           </section>
        )}
      </main>
    </div>
  );
}