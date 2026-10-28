"use server";
import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";

const sql = neon(process.env.DATABASE_URL!);

export async function loginPaciente(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const user = await sql`SELECT id, nombre_completo FROM patients WHERE email = ${email} AND password_hash = ${password}`;
    
    if (user.length > 0) {
      // Se agrega el await para resolver la promesa de cookies()
      const cookieStore = await cookies();
      cookieStore.set("session_user", JSON.stringify({ id: user[0].id, role: "paciente", nombre: user[0].nombre_completo }), { httpOnly: true, path: '/' });
      return { success: true, url: "/paciente" };
    }
    
    return { success: false, message: "Correo o contraseña incorrectos." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error de conexión con la base de datos." };
  }
}