"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

const sql = neon(process.env.DATABASE_URL!);

interface RegistroSignos {
  pacienteId: number;
  presionSistolica?: number;
  presionDiastolica?: number;
  frecuenciaCardiaca?: number;
  saturacionOxigeno?: number;
  glucosa?: number;
  temperatura?: number;
  origen?: string;
  notas?: string;
}

export async function registrarSignosVitales(data: RegistroSignos) {
  try {
    let alertaNivel = "normal";

    // Criterios clínicos de alerta
    if (
      (data.saturacionOxigeno && data.saturacionOxigeno < 90) ||
      (data.presionSistolica && data.presionSistolica >= 160) ||
      (data.presionDiastolica && data.presionDiastolica >= 100) ||
      (data.glucosa && (data.glucosa < 70 || data.glucosa > 250))
    ) {
      alertaNivel = "critico";
    } else if (
      (data.saturacionOxigeno && data.saturacionOxigeno <= 94) ||
      (data.presionSistolica && data.presionSistolica >= 140) ||
      (data.presionDiastolica && data.presionDiastolica >= 90) ||
      (data.glucosa && data.glucosa > 140)
    ) {
      alertaNivel = "advertencia";
    }

    await sql`
      INSERT INTO signos_vitales (
        paciente_id,
        presion_sistolica,
        presion_diastolica,
        frecuencia_cardiaca,
        saturacion_oxigeno,
        glucosa,
        temperatura,
        alerta_nivel,
        origen,
        notas
      ) VALUES (
        ${data.pacienteId},
        ${data.presionSistolica || null},
        ${data.presionDiastolica || null},
        ${data.frecuenciaCardiaca || null},
        ${data.saturacionOxigeno || null},
        ${data.glucosa || null},
        ${data.temperatura || null},
        ${alertaNivel},
        ${data.origen || "enfermeria"},
        ${data.notas || null}
      )
    `;

    revalidatePath("/enfermeria");
    revalidatePath("/paciente");
    return { success: true, alertaNivel };
  } catch (error) {
    console.error("Error al registrar signos vitales:", error);
    return { success: false, error: "No se pudo registrar la medición" };
  }
}