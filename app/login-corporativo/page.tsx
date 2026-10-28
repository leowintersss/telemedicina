"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginStaff } from "./actions";

export default function LoginCorporativo() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await loginStaff(formData);
      if (res.success) {
        router.push(res.url!);
      } else {
        setError(res.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Adorno superior sutil */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-purple-600"></div>
        
        <div className="text-center mb-8 mt-2">
          <h1 className="text-2xl font-bold text-white mb-1">AcompañaT <span className="text-slate-500 font-light">| Staff</span></h1>
          <p className="text-slate-400 text-xs uppercase tracking-widest mt-2">Acceso Administrativo y Médico</p>
        </div>
        
        {error && <div className="mb-6 p-3 bg-rose-950/50 border border-rose-900 text-rose-400 text-sm rounded-lg text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase text-slate-400 mb-2">Correo Corporativo</label>
            <input type="email" name="email" required className="w-full bg-slate-950 border border-slate-800 focus:border-slate-500 rounded-xl px-4 py-3 text-white outline-none text-sm transition-colors" />
          </div>
          <div>
            <label className="block text-xs uppercase text-slate-400 mb-2">Contraseña</label>
            <input type="password" name="password" required className="w-full bg-slate-950 border border-slate-800 focus:border-slate-500 rounded-xl px-4 py-3 text-white outline-none text-sm transition-colors" />
          </div>
          <button type="submit" disabled={isPending} className="w-full bg-slate-200 hover:bg-white disabled:opacity-50 text-slate-900 font-bold py-3 rounded-xl transition-colors mt-4">
            {isPending ? "Validando credenciales..." : "Ingresar al Sistema"}
          </button>
        </form>
        
        <p className="mt-8 text-center text-xs text-slate-600">
          Uso exclusivo para personal autorizado.
        </p>
      </div>
    </div>
  );
}