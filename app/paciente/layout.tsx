import { Suspense } from "react";

export default function PacienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-white text-center">Cargando portal del paciente...</div>}>
      {children}
    </Suspense>
  );
}