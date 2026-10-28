"use client";
import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { User, Lock, Calendar, LogOut, CheckCircle } from "lucide-react";
import { actualizarPerfilPaciente, cambiarPasswordPaciente } from "./actions";

export default function PacienteDashboard() {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("citas");
  const [fechaCDMX, setFechaCDMX] = useState("");
  
  // Estados para los mensajes de éxito de los formularios (a1 y a2)
  const [mensajePerfil, setMensajePerfil] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);
  const [mensajeSeguridad, setMensajeSeguridad] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);

  useEffect(() => {
    // Reloj CDMX
    const intervalo = setInterval(() => {
      setFechaCDMX(new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }));
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  // Manejador del Formulario de Perfil (a1)
  const handlePerfilSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensajePerfil(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await actualizarPerfilPaciente(1, formData); // ID 1 demo
      setMensajePerfil({ texto: res.message, tipo: res.success ? "exito" : "error" });
      if(res.success) (e.target as HTMLFormElement).reset();
    });
  };

  // Manejador del Formulario de Seguridad (a2)
  const handleSeguridadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensajeSeguridad(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await cambiarPasswordPaciente(1, formData); // ID 1 demo
      setMensajeSeguridad({ texto: res.message, tipo: res.success ? "exito" : "error" });
      if(res.success) (e.target as HTMLFormElement).reset();
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* Sidebar Verde */}
      <aside className="w-64 bg-slate-900 border-r border-emerald-900/30 flex flex-col">
        <div className="p-6 border-b border-emerald-900/30">
          <h2 className="text-xl font-bold text-emerald-400">AcompañaT</h2>
          <span className="text-xs font-semibold bg-emerald-950 text-emerald-300 px-2 py-1 rounded mt-2 inline-block">JERARQUÍA: PACIENTE</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => { setActiveTab("citas"); setMensajePerfil(null); setMensajeSeguridad(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'citas' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'hover:bg-slate-800'}`}><Calendar size={18}/> Mis Citas</button>
          <button onClick={() => { setActiveTab("perfil"); setMensajePerfil(null); setMensajeSeguridad(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'perfil' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'hover:bg-slate-800'}`}><User size={18}/> Datos Opcionales</button>
          <button onClick={() => { setActiveTab("seguridad"); setMensajePerfil(null); setMensajeSeguridad(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'seguridad' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'hover:bg-slate-800'}`}><Lock size={18}/> Contraseña</button>
        </nav>
        <div className="p-4 border-t border-emerald-900/30">
          <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-sm text-rose-400 hover:bg-rose-950/30 rounded-xl transition-all"><LogOut size={18}/> Cerrar Sesión</Link>
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Hola, Paciente Demo</h1>
            <p className="text-slate-400 mt-1">Bienvenido a tu portal de salud.</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-emerald-400">Ciudad de México</p>
            <p className="text-xs text-slate-500">{fechaCDMX}</p>
          </div>
        </header>

        {/* a3) Módulo de Citas */}
        {activeTab === "citas" && (
           <section className="animate-in fade-in duration-300 max-w-4xl">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Calendar className="text-emerald-500"/> Próximas Citas Agendadas</h2>
             <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
               {/* Simulación de una cita para el frontend */}
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-950 rounded-xl border border-slate-800/80">
                 <div>
                   <p className="text-emerald-400 font-bold text-lg">15 Nov, 2026</p>
                   <p className="text-white">Revisión Geriátrica de Rutina</p>
                   <p className="text-slate-400 text-xs mt-1">Enfermera: Ana López</p>
                 </div>
                 <div className="mt-3 sm:mt-0 text-right">
                   <p className="text-sm text-slate-300">10:00 AM</p>
                   <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-1 rounded border border-emerald-900/50 mt-1 inline-block">Confirmada</span>
                 </div>
               </div>
             </div>
           </section>
        )}

        {/* a1) Módulo de Datos Opcionales */}
        {activeTab === "perfil" && (
           <section className="animate-in fade-in duration-300 max-w-2xl">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><User className="text-emerald-500"/> Completar Perfil Médico</h2>
             
             {mensajePerfil && (
               <div className={`mb-6 p-4 flex items-center gap-3 rounded-xl border text-sm font-medium ${mensajePerfil.tipo === 'exito' ? 'bg-emerald-950/30 border-emerald-800 text-emerald-400' : 'bg-rose-950/30 border-rose-800 text-rose-400'}`}>
                 {mensajePerfil.tipo === 'exito' && <CheckCircle size={18} />}
                 {mensajePerfil.texto}
               </div>
             )}

             <form onSubmit={handlePerfilSubmit} className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-6">
               <div className="grid grid-cols-2 gap-6">
                 <div>
                   <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Tipo de Sangre</label>
                   <input type="text" name="tipoSangre" placeholder="Ej: O+" className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Alergias Conocidas</label>
                   <input type="text" name="alergias" placeholder="Ej: Penicilina" className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm" />
                 </div>
               </div>
               <div>
                 <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Contacto de Emergencia (Nombre)</label>
                 <input type="text" name="contactoEmergencia" placeholder="Familiar o tutor" className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm" />
               </div>
               <div>
                 <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Teléfono de Emergencia</label>
                 <input type="tel" name="telefonoEmergencia" placeholder="55 1234 5678" className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm" />
               </div>
               <button type="submit" disabled={isPending} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors text-sm">
                 {isPending ? "Guardando información..." : "Guardar Información"}
               </button>
             </form>
           </section>
        )}

        {/* a2) Módulo de Seguridad y Contraseña */}
        {activeTab === "seguridad" && (
           <section className="animate-in fade-in duration-300 max-w-2xl">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Lock className="text-emerald-500"/> Actualizar Contraseña</h2>
             
             {mensajeSeguridad && (
               <div className={`mb-6 p-4 flex items-center gap-3 rounded-xl border text-sm font-medium ${mensajeSeguridad.tipo === 'exito' ? 'bg-emerald-950/30 border-emerald-800 text-emerald-400' : 'bg-rose-950/30 border-rose-800 text-rose-400'}`}>
                 {mensajeSeguridad.tipo === 'exito' && <CheckCircle size={18} />}
                 {mensajeSeguridad.texto}
               </div>
             )}

             <form onSubmit={handleSeguridadSubmit} className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-6">
               <div>
                 <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Contraseña Actual</label>
                 <input type="password" name="passwordActual" required className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm" />
               </div>
               <div>
                 <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Nueva Contraseña</label>
                 <input type="password" name="passwordNueva" required className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm" />
               </div>
               <div>
                 <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Confirmar Nueva Contraseña</label>
                 <input type="password" name="passwordConfirmar" required className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm" />
               </div>
               <button type="submit" disabled={isPending} className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-xl transition-colors text-sm">
                 {isPending ? "Procesando..." : "Actualizar Contraseña"}
               </button>
             </form>
           </section>
        )}
      </main>
    </div>
  );
}