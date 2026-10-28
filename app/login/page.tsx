"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginPaciente } from "./actions";

export default function LoginPaciente() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await loginPaciente(formData);
      if (res.success) {
        router.push(res.url!);
      } else {
        setError(res.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-emerald-900/30 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-400 mb-2">AcompañaT</h1>
          <p className="text-slate-400 text-sm">Portal exclusivo para Pacientes</p>
        </div>
        
        {error && <div className="mb-6 p-3 bg-rose-950/50 border border-rose-900 text-rose-400 text-sm rounded-lg text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase text-slate-400 mb-2">Correo Electrónico</label>
            <input type="email" name="email" required className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-white outline-none text-sm transition-colors" />
          </div>
          <div>
            <label className="block text-xs uppercase text-slate-400 mb-2">Contraseña</label>
            <input type="password" name="password" required className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-white outline-none text-sm transition-colors" />
          </div>
          <button type="submit" disabled={isPending} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors mt-4">
            {isPending ? "Verificando..." : "Iniciar Sesión"}
          </button>
        </form>
        
        <p className="mt-8 text-center text-xs text-slate-500">
          ¿Eres personal médico? <a href="/login-corporativo" className="text-emerald-400 hover:underline">Ingresa aquí</a>
        </p>
      </div>
    </div>
  );
}