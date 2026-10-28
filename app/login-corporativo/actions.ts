"use server";
import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";

const sql = neon(process.env.DATABASE_URL="postgresql://neondb_owner:npg_Ur4c6uKOFVaS@ep-crimson-dream-b49s2cbz-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

export async function loginStaff(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const admin = await sql`SELECT id, nombre_completo FROM admins WHERE email = ${email} AND password_hash = ${password}`;
    if (admin.length > 0) {
      const cookieStore = await cookies();
      cookieStore.set("session_user", JSON.stringify({ id: admin[0].id, role: "admin", nombre: admin[0].nombre_completo }), { httpOnly: true, path: '/' });
      return { success: true, url: "/admin" };
    }

    const nurse = await sql`SELECT id, nombre_completo FROM nurses WHERE email = ${email} AND password_hash = ${password}`;
    if (nurse.length > 0) {
      const cookieStore = await cookies();
      cookieStore.set("session_user", JSON.stringify({ id: nurse[0].id, role: "enfermera", nombre: nurse[0].nombre_completo }), { httpOnly: true, path: '/' });
      return { success: true, url: "/enfermeria" };
    }

    return { success: false, message: "Credenciales corporativas incorrectas o acceso denegado." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al procesar la solicitud." };
  }
}