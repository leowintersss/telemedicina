"use client";
import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { User, Lock, LogOut, Search, Activity, Bluetooth, FileText, Users, Shield, CheckCircle } from "lucide-react";
import { registrarEnfermera, obtenerEnfermeras, obtenerCoAminstradores } from "./actions";

export default function AdminDashboard() {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("enfermeras");
  const [fechaCDMX, setFechaCDMX] = useState("");
  const [mensajeGlobal, setMensajeGlobal] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);
  
  // c9) Estados para alta de enfermeras
  const [passAleatoria, setPassAleatoria] = useState(true);
  const [passGeneradaVisual, setPassGeneradaVisual] = useState<string | null>(null);
  
  // Datos simulados (en producción vienen del useEffect y las actions)
  const listaEnfermeras = [{ id: 1, nombre: "Ana López", email: "ana@acompanat.com" }, { id: 2, nombre: "María Pérez", email: "maria@acompanat.com" }];
  const listaCoadmins = [{ id: 1, nombre: "Carlos Mendoza", rol: "Co-Admin" }];

  useEffect(() => {
    const intervalo = setInterval(() => {
      setFechaCDMX(new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }));
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

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
      }
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
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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

        {mensajeGlobal && (
          <div className={`mb-6 p-4 flex items-center gap-3 rounded-xl border text-sm font-medium max-w-4xl ${mensajeGlobal.tipo === 'exito' ? 'bg-emerald-950/30 border-emerald-800 text-emerald-400' : 'bg-rose-950/30 border-rose-800 text-rose-400'}`}>
            <CheckCircle size={18} /> {mensajeGlobal.texto}
          </div>
        )}

        {/* c9) Gestión de Enfermeras */}
        {activeTab === "enfermeras" && (
           <section className="animate-in fade-in duration-300">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Users className="text-purple-500"/> Gestión de Personal de Enfermería</h2>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Alta Nueva Enfermera */}
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
                   
                   {/* Toggle de Contraseña */}
                   <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                     <div className="flex items-center justify-between mb-2">
                       <label className="text-sm font-medium text-slate-300">Generar contraseña aleatoria</label>
                       <button type="button" onClick={() => setPassAleatoria(!passAleatoria)} className={`w-12 h-6 rounded-full transition-colors relative ${passAleatoria ? 'bg-purple-600' : 'bg-slate-700'}`}>
                         <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${passAleatoria ? 'translate-x-7' : 'translate-x-1'}`}></div>
                       </button>
                     </div>
                     {!passAleatoria && (
                       <input type="password" name="password" required={!passAleatoria} placeholder="Escribe la contraseña manual..." className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:border-purple-500 text-white mt-3" />
                     )}
                   </div>
                   
                   <button type="submit" disabled={isPending} className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors text-sm">
                     {isPending ? "Registrando..." : "Crear Cuenta"}
                   </button>
                 </form>

                 {passGeneradaVisual && (
                   <div className="mt-4 p-4 bg-purple-950/40 border border-purple-800 rounded-lg text-sm text-center">
                     <p className="text-purple-300 mb-1">Contraseña generada (Copia y entrégala a la enfermera):</p>
                     <p className="text-xl font-mono text-white font-bold tracking-widest">{passGeneradaVisual}</p>
                   </div>
                 )}
               </div>

               {/* Lista de Enfermeras */}
               <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <h3 className="text-lg font-bold mb-4 text-white border-b border-slate-800 pb-2">Plantilla Activa</h3>
                 <div className="space-y-3">
                    {listaEnfermeras.map((enf) => (
                      <div key={enf.id} className="flex justify-between items-center p-3 bg-slate-950 border border-slate-800 rounded-lg">
                        <div>
                          <p className="text-white text-sm font-medium">{enf.nombre}</p>
                          <p className="text-slate-500 text-xs">{enf.email}</p>
                        </div>
                        <span className="px-2 py-1 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded text-xs">Activa</span>
                      </div>
                    ))}
                 </div>
               </div>
             </div>
           </section>
        )}

        {/* c10) Co-Administradores */}
        {activeTab === "coadmins" && (
           <section className="animate-in fade-in duration-300 max-w-4xl">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Shield className="text-purple-500"/> Co-Administradores del Sistema</h2>
             <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                {listaCoadmins.map((admin) => (
                  <div key={admin.id} className="flex justify-between items-center p-4 bg-slate-950 border border-slate-800 rounded-lg mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 font-bold">{admin.nombre.charAt(0)}</div>
                      <div>
                        <p className="text-white font-medium">{admin.nombre}</p>
                        <p className="text-slate-500 text-xs">{admin.rol}</p>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
           </section>
        )}

        {/* Módulos Médicos Compartidos (Simulados para Admin) */}
        {["buscar", "historial", "signos", "bluetooth", "seguridad"].includes(activeTab) && (
           <section className="animate-in fade-in duration-300 max-w-4xl">
             <h2 className="text-xl font-bold mb-4 capitalize">Módulo: {activeTab.replace("-", " ")}</h2>
             <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-sm text-slate-400">
               Interfaz operativa conectada. Los administradores tienen acceso de sólo lectura o soporte en estos módulos.
             </div>
           </section>
        )}
      </main>
    </div>
  );
}