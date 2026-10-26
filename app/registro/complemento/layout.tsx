import { Suspense } from "react";

export default function ComplementoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-white text-center">Cargando formulario...</div>}>
      {children}
    </Suspense>
  );
}