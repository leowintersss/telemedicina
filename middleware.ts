import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session_user");
  const { pathname } = request.nextUrl;

  // 1. Proteger ruta de Pacientes
  if (pathname.startsWith("/paciente")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      const user = JSON.parse(sessionCookie.value);
      // Validamos de forma flexible por si el rol es "paciente" o "Patient"
      if (!user.role || user.role.toLowerCase() !== "paciente") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 2. Proteger ruta de Enfermería
  if (pathname.startsWith("/enfermeria")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login-corporativo", request.url));
    }
    try {
      const user = JSON.parse(sessionCookie.value);
      const role = user.role ? user.role.toLowerCase() : "";
      if (role !== "enfermera" && role !== "admin") {
        return NextResponse.redirect(new URL("/login-corporativo", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login-corporativo", request.url));
    }
  }

  // 3. Proteger ruta de Admin
  if (pathname.startsWith("/admin")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login-corporativo", request.url));
    }
    try {
      const user = JSON.parse(sessionCookie.value);
      const role = user.role ? user.role.toLowerCase() : "";
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/login-corporativo", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login-corporativo", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/paciente/:path*", "/enfermeria/:path*", "/admin/:path*"],
};