"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

const sql = neon(process.env.DATABASE_URL!);

// b3) Buscar pacientes en la tabla 'patients'
export async function buscarPacientes(query: string) {
  try {
    const search = `%${query}%`;
    const resultados = await sql`
      SELECT id, nombre_completo, curp, email 
      FROM patients 
      WHERE nombre_completo ILIKE ${search} OR curp ILIKE ${search} OR email ILIKE ${search}
      LIMIT 10
    `;
    return resultados;
  } catch (error) {
    console.error("Error al buscar pacientes:", error);
    return [];
  }
}

// b5 y b6) Registrar signos en la tabla 'vital_signs'
export async function registrarSignosEnfermeria(data: {
  patientId: number;
  presion: string;
  frecuenciaCardiaca: number;
  temperatura: number;
  observaciones: string;
}) {
  try {
    await sql`
      INSERT INTO vital_signs (
        patient_id, presion, frecuencia_cardiaca, temperatura, observaciones
      ) VALUES (
        ${data.patientId}, ${data.presion}, ${data.frecuenciaCardiaca}, 
        ${data.temperatura}, ${data.observaciones || null}
      )
    `;
    revalidatePath("/enfermeria");
    return { success: true, message: "Signos vitales registrados en el expediente." };
  } catch (error) {
    console.error("Error BD Signos:", error);
    return { success: false, message: "Error al registrar signos vitales." };
  }
}

// b4) Obtener Historial Clínico
export async function obtenerHistorialPaciente(pacienteId: number) {
  try {
    const historial = await sql`
      SELECT * FROM vital_signs 
      WHERE patient_id = ${pacienteId}
      ORDER BY created_at DESC 
      LIMIT 10
    `;
    return historial;
  } catch (error) {
    return [];
  }
}

// b8) Citas Simuladas (Placeholder)
export async function obtenerCitasPaciente(pacienteId: number) {
  return [
    { id: 1, fecha: "2026-11-15 10:00", tipo: "Revisión General", estado: "Pendiente" }
  ];
}