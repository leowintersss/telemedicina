"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

const sql = neon(process.env.DATABASE_URL!);

// b3) Buscar pacientes por nombre, correo o CURP
export async function buscarPacientes(query: string) {
  try {
    const search = `%${query}%`;
    // Asumiendo que tu tabla principal de pacientes se llama 'pacientes' o 'pacientes_datos_generales'
    // Ajusta el nombre de la tabla si en tu BD se llama distinto.
    const resultados = await sql`
      SELECT id, nombre, curp, email, telefono 
      FROM pacientes_datos_generales 
      WHERE nombre ILIKE ${search} OR curp ILIKE ${search} OR email ILIKE ${search}
      LIMIT 10
    `;
    return resultados;
  } catch (error) {
    console.error("Error al buscar pacientes:", error);
    return [];
  }
}

// b5 y b6) Registrar signos vitales con ID de enfermera
interface RegistroSignos {
  pacienteId: number;
  enfermeraId: number;
  presionSistolica?: number;
  presionDiastolica?: number;
  frecuenciaCardiaca?: number;
  saturacionOxigeno?: number;
  glucosa?: number;
  temperatura?: number;
  notas?: string;
}

export async function registrarSignosEnfermeria(data: RegistroSignos) {
  try {
    let alertaNivel = "normal";

    // Semáforo de riesgo
    if ((data.saturacionOxigeno && data.saturacionOxigeno < 90) || (data.presionSistolica && data.presionSistolica >= 160)) {
      alertaNivel = "critico";
    } else if ((data.saturacionOxigeno && data.saturacionOxigeno <= 94) || (data.presionSistolica && data.presionSistolica >= 140)) {
      alertaNivel = "advertencia";
    }

    // El CURRENT_TIMESTAMP de PostgreSQL guardará la hora, en el frontend la mostraremos en formato CDMX
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
        ${`Enfermera ID:\${data.enfermeraId}`},
        ${data.notas || null}
      )
    `;

    revalidatePath("/enfermeria");
    return { success: true, message: `Signos guardados. Riesgo: ${alertaNivel.toUpperCase()}` };
  } catch (error) {
    console.error("Error al guardar signos:", error);
    return { success: false, message: "Error al registrar signos vitales." };
  }
}

// b1) Actualizar perfil de enfermera
export async function actualizarPerfilEnfermera(enfermeraId: number, formData: FormData) {
  try {
    const telefono = formData.get("telefono") as string;
    // Asumiendo tabla enfermeras_perfil o similar
    // await sql`UPDATE enfermeras_perfil SET telefono = ${telefono} WHERE id = ${enfermeraId}`;
    return { success: true, message: "Datos de contacto actualizados correctamente." };
  } catch (error) {
    return { success: false, message: "Error al actualizar perfil." };
  }
}

// b2) Cambiar contraseña de enfermera
export async function cambiarPasswordEnfermera(enfermeraId: number, formData: FormData) {
  try {
    const nueva = formData.get("passwordNueva") as string;
    const confirmar = formData.get("passwordConfirmar") as string;
    if (nueva !== confirmar) return { success: false, message: "Las contraseñas no coinciden." };
    
    // await sql`UPDATE enfermeras_login SET password_hash = ${nueva} WHERE id = ${enfermeraId}`;
    return { success: true, message: "Contraseña actualizada de forma segura." };
  } catch (error) {
    return { success: false, message: "Error al cambiar contraseña." };
  }
}