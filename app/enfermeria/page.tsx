"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Lock, Calendar, LogOut, Search, Activity, Bluetooth, FileText } from "lucide-react";

export default function EnfermeriaDashboard() {
  const [activeTab, setActiveTab] = useState("buscar");
  const [fechaCDMX, setFechaCDMX] = useState("");

  useEffect(() => {
    const intervalo = setInterval(() => {
      setFechaCDMX(new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }));
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* Sidebar Rojo */}
      <aside className="w-64 bg-slate-900 border-r border-rose-900/30 flex flex-col">
        <div className="p-6 border-b border-rose-900/30">
          <h2 className="text-xl font-bold text-rose-400">AcompañaT</h2>
          <span className="text-xs font-semibold bg-rose-950 text-rose-300 px-2 py-1 rounded mt-2 inline-block">JERARQUÍA: ENFERMERÍA</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button onClick={() => setActiveTab("buscar")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'buscar' ? 'bg-rose-600 text-white' : 'hover:bg-slate-800'}`}><Search size={18}/> Buscar Paciente</button>
          <button onClick={() => setActiveTab("historial")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'historial' ? 'bg-rose-600 text-white' : 'hover:bg-slate-800'}`}><FileText size={18}/> Historial / Citas</button>
          <button onClick={() => setActiveTab("signos")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'signos' ? 'bg-rose-600 text-white' : 'hover:bg-slate-800'}`}><Activity size={18}/> Captura Signos</button>
          <button onClick={() => setActiveTab("bluetooth")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'bluetooth' ? 'bg-rose-600 text-white' : 'hover:bg-slate-800'}`}><Bluetooth size={18}/> Bluetooth</button>
          <hr className="border-slate-800 my-4" />
          <button onClick={() => setActiveTab("perfil")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'perfil' ? 'bg-rose-600 text-white' : 'hover:bg-slate-800'}`}><User size={18}/> Mi Perfil</button>
          <button onClick={() => setActiveTab("seguridad")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'seguridad' ? 'bg-rose-600 text-white' : 'hover:bg-slate-800'}`}><Lock size={18}/> Contraseña</button>
        </nav>
        <div className="p-4 border-t border-rose-900/30">
          <Link href="/login-corporativo" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"><LogOut size={18}/> Cerrar Sesión</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Hola, [Nombre Enfermera]</h1>
            <p className="text-slate-400 mt-1">Estación de Guardia.</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-rose-400">Ciudad de México</p>
            <p className="text-xs text-slate-500">{fechaCDMX}</p>
          </div>
        </header>

        {activeTab === "signos" && (
           <section>
             <h2 className="text-xl font-bold mb-4">Registro de Signos Vitales</h2>
             <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl mb-4 text-xs text-slate-400">
               Registrando como: <strong>[ID/Nombre Enfermera]</strong> | Hora de captura: {fechaCDMX}
             </div>
             {/* Formulario de signos vitales */}
           </section>
        )}
        {/* Aquí van los otros IFs (buscar, historial, bluetooth, etc) siguiendo la misma lógica de los tabs */}
      </main>
    </div>
  );
}