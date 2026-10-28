"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { registrarSignosVitales } from "./actions";

export default function EnfermeriaDashboard() {
  const [isPending, startTransition] = useTransition();
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);

  // Navegación de Submenús
  const [activeTab, setActiveTab] = useState<"registro" | "perfil" | "seguridad">("registro");

  // Estados: Registro de Signos
  const [pacienteId, setPacienteId] = useState("1");
  const [sistolica, setSistolica] = useState("");
  const [diastolica, setDiastolica] = useState("");
  const [frecuencia, setFrecuencia] = useState("");
  const [oxigeno, setOxigeno] = useState("");
  const [glucosa, setGlucosa] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [notas, setNotas] = useState("");

  // Estados: Perfil
  const [nombreEnfermera, setNombreEnfermera] = useState("Ana López");
  const [telefono, setTelefono] = useState("555-123-4567");

  // Estados: Seguridad
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirmar, setPasswordConfirmar] = useState("");

  const handleRegistroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    startTransition(async () => {
      const res = await registrarSignosVitales({
        pacienteId: Number(pacienteId),
        presionSistolica: sistolica ? Number(sistolica) : undefined,
        presionDiastolica: diastolica ? Number(diastolica) : undefined,
        frecuenciaCardiaca: frecuencia ? Number(frecuencia) : undefined,
        saturacionOxigeno: oxigeno ? Number(oxigeno) : undefined,
        glucosa: glucosa ? Number(glucosa) : undefined,
        temperatura: temperatura ? Number(temperatura) : undefined,
        notas: notas || undefined,
        origen: "enfermeria",
      });

      if (res.success) {
        setMensaje({ texto: `Lectura ingresada exitosamente. Riesgo: ${res.alertaNivel?.toUpperCase()}`, tipo: "exito" });
        setSistolica(""); setDiastolica(""); setFrecuencia("");
        setOxigeno(""); setGlucosa(""); setTemperatura(""); setNotas("");
      } else {
        setMensaje({ texto: "Error al procesar la medición.", tipo: "error" });
      }
    });
  };

  const handlePerfilSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje({ texto: "Datos personales actualizados correctamente.", tipo: "exito" });
  };

  const handleSeguridadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordNueva !== passwordConfirmar) {
      setMensaje({ texto: "Las contraseñas nuevas no coinciden.", tipo: "error" });
      return;
    }
    setMensaje({ texto: "Contraseña actualizada de forma segura.", tipo: "exito" });
    setPasswordActual(""); setPasswordNueva(""); setPasswordConfirmar("");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col">
      
      {/* Barra Superior Integrada */}
      <nav className="border-b border-slate-800 bg-[#020617]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center font-bold text-white text-lg">A</div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">AcompañaT</span>
              <span className="text-xs text-cyan-400 font-medium ml-2 px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800">
                Enfermería
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 border-r border-slate-800 pr-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {nombreEnfermera}
            </div>
            <Link
              href="/"
              className="text-xs font-medium bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800/60 px-3.5 py-2 rounded-xl transition-all"
            >
              Cerrar Sesión
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-6">
        
        {/* Submenús Seleccionables (Tabs) */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-px">
          <button
            onClick={() => { setActiveTab("registro"); setMensaje(null); }}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "registro" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            Registro Clínico
          </button>
          <button
            onClick={() => { setActiveTab("perfil"); setMensaje(null); }}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "perfil" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            Mi Información
          </button>
          <button
            onClick={() => { setActiveTab("seguridad"); setMensaje(null); }}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "seguridad" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            Seguridad y Contraseña
          </button>
        </div>

        {/* Mensajes Globales */}
        {mensaje && (
          <div className={`p-4 rounded-xl border text-sm ${mensaje.tipo === "exito" ? "bg-emerald-950/30 border-emerald-800 text-emerald-300" : "bg-rose-950/30 border-rose-800 text-rose-300"}`}>
            {mensaje.texto}
          </div>
        )}

        {/* CONTENIDO: Pestaña 1 - Registro de Signos */}
        {activeTab === "registro" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Ingreso de Constantes</h2>
                  <p className="text-xs text-slate-400">Captura manual o enlace inalámbrico</p>
                </div>
                {/* Botón de Integración Bluetooth */}
                <button
                  type="button"
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-900/50 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-2"
                >
                  <span className="text-base">📶</span> Importar vía Bluetooth
                </button>
              </div>

              <form onSubmit={handleRegistroSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">Paciente Asignado</label>
                  <select
                    value={pacienteId}
                    onChange={(e) => setPacienteId(e.target.value)}
                    className="w-full max-w-sm bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm"
                  >
                    <option value="1">Paciente 1 - Adulto Mayor (Demo)</option>
                    <option value="2">Paciente 2 - En seguimiento</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {/* Campos de signos vitales (igual que antes, agrupados por brevedad visual) */}
                  {[
                    { label: "Sistólica (mmHg)", val: sistolica, set: setSistolica },
                    { label: "Diastólica (mmHg)", val: diastolica, set: setDiastolica },
                    { label: "SpO2 (%)", val: oxigeno, set: setOxigeno },
                    { label: "Pulso (LPM)", val: frecuencia, set: setFrecuencia },
                    { label: "Glucosa (mg/dL)", val: glucosa, set: setGlucosa },
                    { label: "Temp (°C)", val: temperatura, set: setTemperatura },
                  ].map((campo, i) => (
                    <div key={i}>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">{campo.label}</label>
                      <input
                        type="number" step="0.1" value={campo.val} onChange={(e) => campo.set(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">Observaciones / Evolución</label>
                  <textarea
                    rows={2} value={notas} onChange={(e) => setNotas(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-white outline-none text-sm"
                  />
                </div>

                <button type="submit" disabled={isPending} className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-xl transition-all text-sm">
                  {isPending ? "Guardando..." : "Guardar Registro"}
                </button>
              </form>
            </div>

            {/* Panel lateral Triage */}
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl h-fit">
              <h3 className="text-base font-bold text-white mb-4">Criterios de Semaforización</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/50">
                  <p className="font-semibold text-rose-300">Crítico</p>
                  <p className="text-slate-400 mt-1">SpO2 &lt; 90% | Sistólica ≥ 160</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/50">
                  <p className="font-semibold text-amber-300">Advertencia</p>
                  <p className="text-slate-400 mt-1">SpO2 90-94% | Sistólica ≥ 140</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTENIDO: Pestaña 2 - Mi Información */}
        {activeTab === "perfil" && (
          <div className="max-w-2xl bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-2xl animate-in fade-in duration-300">
            <h2 className="text-lg font-bold text-white mb-6">Actualizar Información Personal</h2>
            <form onSubmit={handlePerfilSubmit} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">Nombre Completo</label>
                <input
                  type="text" value={nombreEnfermera} onChange={(e) => setNombreEnfermera(e.target.value)} required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">Teléfono de Contacto</label>
                <input
                  type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">Correo Electrónico (Solo lectura)</label>
                <input
                  type="email" value="enfermeria@acompanat.com" disabled
                  className="w-full bg-slate-900/50 border border-slate-800/50 rounded-xl px-4 py-2.5 text-slate-500 cursor-not-allowed text-sm"
                />
              </div>
              <button type="submit" className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-medium px-6 py-2.5 rounded-xl transition-all text-sm">
                Guardar Cambios
              </button>
            </form>
          </div>
        )}

        {/* CONTENIDO: Pestaña 3 - Seguridad */}
        {activeTab === "seguridad" && (
          <div className="max-w-2xl bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-2xl animate-in fade-in duration-300">
            <h2 className="text-lg font-bold text-white mb-6">Cambiar Contraseña</h2>
            <form onSubmit={handleSeguridadSubmit} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">Contraseña Actual</label>
                <input
                  type="password" value={passwordActual} onChange={(e) => setPasswordActual(e.target.value)} required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">Nueva Contraseña</label>
                <input
                  type="password" value={passwordNueva} onChange={(e) => setPasswordNueva(e.target.value)} required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">Confirmar Nueva Contraseña</label>
                <input
                  type="password" value={passwordConfirmar} onChange={(e) => setPasswordConfirmar(e.target.value)} required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm"
                />
              </div>
              <button type="submit" className="bg-rose-900/80 hover:bg-rose-800 border border-rose-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all text-sm">
                Actualizar Contraseña
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}