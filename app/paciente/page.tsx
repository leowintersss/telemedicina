"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Lock, Calendar, LogOut } from "lucide-react";
// Asegúrate de importar tus server actions reales aquí

export default function PacienteDashboard() {
  const [activeTab, setActiveTab] = useState("citas");
  const [fechaCDMX, setFechaCDMX] = useState("");

  useEffect(() => {
    // Actualizar reloj CDMX
    const intervalo = setInterval(() => {
      setFechaCDMX(new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }));
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* Sidebar Verde */}
      <aside className="w-64 bg-slate-900 border-r border-emerald-900/30 flex flex-col">
        <div className="p-6 border-b border-emerald-900/30">
          <h2 className="text-xl font-bold text-emerald-400">AcompañaT</h2>
          <span className="text-xs font-semibold bg-emerald-950 text-emerald-300 px-2 py-1 rounded mt-2 inline-block">JERARQUÍA: PACIENTE</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab("citas")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'citas' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}><Calendar size={18}/> Mis Citas</button>
          <button onClick={() => setActiveTab("perfil")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'perfil' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}><User size={18}/> Datos Opcionales</button>
          <button onClick={() => setActiveTab("seguridad")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'seguridad' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}><Lock size={18}/> Contraseña</button>
        </nav>
        <div className="p-4 border-t border-emerald-900/30">
          <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-sm text-rose-400 hover:bg-rose-950/30 rounded-xl transition-all"><LogOut size={18}/> Cerrar Sesión</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Hola, [Nombre del Paciente]</h1>
            <p className="text-slate-400 mt-1">Bienvenido a tu portal de salud.</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-emerald-400">Ciudad de México</p>
            <p className="text-xs text-slate-500">{fechaCDMX}</p>
          </div>
        </header>

        {activeTab === "citas" && (
           <section>
             <h2 className="text-xl font-bold mb-4">Próximas Citas</h2>
             {/* Aquí va el componente de Calendario / Lista de citas */}
             <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-sm text-slate-400">Calendario interactivo en construcción...</div>
           </section>
        )}
        {activeTab === "perfil" && (
           <section>
             <h2 className="text-xl font-bold mb-4">Completar Perfil</h2>
             {/* Formulario que llame a tu action de actualizarDatosOpcionales */}
           </section>
        )}
        {activeTab === "seguridad" && (
           <section>
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Lock className="text-emerald-500"/> Actualizar Contraseña</h2>
             {/* Formulario de contraseña (Actual, Nueva, Confirmar) con mensaje de éxito */}
           </section>
        )}
      </main>
    </div>
  );
}