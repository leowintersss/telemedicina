"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

const sql = neon(process.env.DATABASE_URL!);

export async function registrarEnfermera(formData: FormData) {
  try {
    const nombre = formData.get("nombre") as string;
    const email = formData.get("email") as string;
    let password = formData.get("password") as string;
    const passAleatoria = formData.get("passAleatoria") === "true";

    if (passAleatoria) {
      password = Math.random().toString(36).slice(-8);
    }

    revalidatePath("/admin");
    
    return { 
      success: true, 
      message: `Enfermera ${nombre} registrada con éxito.`,
      passwordGenerada: passAleatoria ? password : null
    };
  } catch (error) {
    console.error("Error al registrar enfermera:", error);
    return { success: false, message: "Error al registrar en la base de datos." };
  }
}

export async function obtenerEnfermeras() {
  try {
    return [
      { id: 1, nombre: "Ana López", email: "ana@acompanat.com", estado: "Activa" },
      { id: 2, nombre: "María Pérez", email: "maria@acompanat.com", estado: "Activa" }
    ];
  } catch (error) {
    return [];
  }
}

export async function obtenerCoAminstradores() {
  try {
    return [
      { id: 1, nombre: "Carlos Admin", email: "carlos@acompanat.com", rol: "Co-Admin" }
    ];
  } catch (error) {
    return [];
  }
}