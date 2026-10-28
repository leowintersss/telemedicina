"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, Lock, Calendar, LogOut, Search, Activity, 
  Bluetooth, FileText, Users, Shield 
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("enfermeras");
  const [fechaCDMX, setFechaCDMX] = useState("");
  
  // Toggle para la contraseña de nuevas enfermeras (c9)
  const [passAleatoria, setPassAleatoria] = useState(true);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setFechaCDMX(new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }));
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* Sidebar Morado (c) */}
      <aside className="w-64 bg-slate-900 border-r border-purple-900/30 flex flex-col">
        <div className="p-6 border-b border-purple-900/30">
          <h2 className="text-xl font-bold text-purple-400">AcompañaT</h2>
          <span className="text-xs font-semibold bg-purple-950 text-purple-300 px-2 py-1 rounded mt-2 inline-block">JERARQUÍA: ADMIN</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {/* Opciones de Pacientes (c3 a c8) */}
          <button onClick={() => setActiveTab("buscar")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'buscar' ? 'bg-purple-600 text-white' : 'hover:bg-slate-800'}`}><Search size={18}/> Buscar Paciente</button>
          <button onClick={() => setActiveTab("historial")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'historial' ? 'bg-purple-600 text-white' : 'hover:bg-slate-800'}`}><FileText size={18}/> Historial / Citas</button>
          <button onClick={() => setActiveTab("signos")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'signos' ? 'bg-purple-600 text-white' : 'hover:bg-slate-800'}`}><Activity size={18}/> Captura Signos</button>
          <button onClick={() => setActiveTab("bluetooth")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'bluetooth' ? 'bg-purple-600 text-white' : 'hover:bg-slate-800'}`}><Bluetooth size={18}/> Bluetooth</button>
          
          <hr className="border-slate-800 my-4" />
          
          {/* Gestión Interna (c9 y c10) */}
          <button onClick={() => setActiveTab("enfermeras")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'enfermeras' ? 'bg-purple-600 text-white' : 'hover:bg-slate-800'}`}><Users size={18}/> Personal Enfermería</button>
          <button onClick={() => setActiveTab("coadmins")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'coadmins' ? 'bg-purple-600 text-white' : 'hover:bg-slate-800'}`}><Shield size={18}/> Co-Administradores</button>
          
          <hr className="border-slate-800 my-4" />
          
          {/* Perfil Admin (c1 y c2) */}
          <button onClick={() => setActiveTab("perfil")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'perfil' ? 'bg-purple-600 text-white' : 'hover:bg-slate-800'}`}><User size={18}/> Mi Perfil</button>
          <button onClick={() => setActiveTab("seguridad")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'seguridad' ? 'bg-purple-600 text-white' : 'hover:bg-slate-800'}`}><Lock size={18}/> Contraseña</button>
        </nav>
        
        <div className="p-4 border-t border-purple-900/30">
          <Link href="/login-corporativo" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"><LogOut size={18}/> Cerrar Sesión</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Hola, [Nombre Admin]</h1>
            <p className="text-slate-400 mt-1">Panel de Control General.</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-purple-400">Ciudad de México</p>
            <p className="text-xs text-slate-500">{fechaCDMX}</p>
          </div>
        </header>

        {/* c9: Gestión de Enfermeras */}
        {activeTab === "enfermeras" && (
           <section className="animate-in fade-in duration-300">
             <h2 className="text-xl font-bold mb-6">Gestión de Personal de Enfermería</h2>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Formulario Alta Nueva Enfermera */}
               <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <h3 className="text-lg font-bold mb-4 text-purple-400">Registrar Nueva Enfermera</h3>
                 <form className="space-y-4">
                   <div>
                     <label className="block text-xs uppercase text-slate-400 mb-1">Nombre Completo</label>
                     <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm outline-none focus:border-purple-500" />
                   </div>
                   <div>
                     <label className="block text-xs uppercase text-slate-400 mb-1">Correo Electrónico</label>
                     <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm outline-none focus:border-purple-500" />
                   </div>
                   
                   {/* Toggle Contraseña */}
                   <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 mt-4">
                     <div className="flex items-center justify-between mb-3">
                       <label className="text-sm font-medium">Generar contraseña aleatoria (8 dígitos)</label>
                       <button 
                         type="button"
                         onClick={() => setPassAleatoria(!passAleatoria)}
                         className={`w-12 h-6 rounded-full transition-colors relative ${passAleatoria ? 'bg-purple-600' : 'bg-slate-700'}`}
                       >
                         <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${passAleatoria ? 'translate-x-7' : 'translate-x-1'}`}></div>
                       </button>
                     </div>
                     {!passAleatoria && (
                       <input 
                         type="password" 
                         placeholder="Ingresar contraseña temporal manual" 
                         className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:border-purple-500" 
                       />
                     )}
                   </div>
                   
                   <button type="button" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-2.5 rounded-lg transition-colors text-sm">
                     Crear Cuenta
                   </button>
                 </form>
               </div>

               {/* Lista de Enfermeras */}
               <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <h3 className="text-lg font-bold mb-4">Plantilla Activa</h3>
                 <div className="space-y-3 text-sm text-slate-400">
                    <p>Módulo de visualización de enfermeras en construcción...</p>
                 </div>
               </div>
             </div>
           </section>
        )}

        {/* c10: Co-Administradores */}
        {activeTab === "coadmins" && (
           <section className="animate-in fade-in duration-300">
             <h2 className="text-xl font-bold mb-4">Co-Administradores del Sistema</h2>
             <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-sm text-slate-400">Lista y permisos de administradores secundarios en construcción...</div>
           </section>
        )}

        {/* c2: Seguridad y Candado */}
        {activeTab === "seguridad" && (
           <section className="animate-in fade-in duration-300">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
               <Lock className="text-purple-500"/> Actualizar Contraseña
             </h2>
             <div className="max-w-md bg-slate-900 p-6 rounded-xl border border-slate-800">
               {/* Formulario c2 */}
               <p className="text-sm text-slate-400">Formulario de 3 campos (Actual, Nueva, Confirmar)...</p>
             </div>
           </section>
        )}

        {/* Placeholder para los demás tabs (c3 a c8) */}
        {["buscar", "historial", "signos", "bluetooth", "perfil"].includes(activeTab) && (
           <section className="animate-in fade-in duration-300">
             <h2 className="text-xl font-bold mb-4 capitalize">Módulo: {activeTab}</h2>
             <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-sm text-slate-400">
               Interfaz en integración con la base de datos...
             </div>
           </section>
        )}
      </main>
    </div>
  );
}