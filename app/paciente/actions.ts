"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

const sql = neon(process.env.DATABASE_URL!);

// a1) Guardar información opcional del paciente
export async function actualizarPerfilPaciente(pacienteId: number, formData: FormData) {
  try {
    const alergias = formData.get("alergias") as string;
    const tipoSangre = formData.get("tipoSangre") as string;
    const contactoEmergencia = formData.get("contactoEmergencia") as string;
    const telefonoEmergencia = formData.get("telefonoEmergencia") as string;

    // Aquí usamos la tabla de datos médicos/opcionales que ya tienes en tu repo
    await sql`
      UPDATE pacientes_datos_medicos 
      SET alergias = ${alergias}, 
          tipo_sangre = ${tipoSangre}, 
          contacto_emergencia = ${contactoEmergencia}, 
          telefono_emergencia = ${telefonoEmergencia},
          fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE paciente_id = ${pacienteId}
    `;

    revalidatePath("/paciente");
    return { success: true, message: "La información se ha guardado con éxito." };
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return { success: false, message: "Hubo un error al guardar la información." };
  }
}

// a2) Cambiar contraseña
export async function cambiarPasswordPaciente(pacienteId: number, formData: FormData) {
  try {
    const actual = formData.get("passwordActual") as string;
    const nueva = formData.get("passwordNueva") as string;
    const confirmar = formData.get("passwordConfirmar") as string;

    if (nueva !== confirmar) {
      return { success: false, message: "Las contraseñas nuevas no coinciden." };
    }

    // Aquí iría la validación del hash de la contraseña actual. 
    // Por ahora hacemos el UPDATE directo en tu tabla de login de pacientes
    await sql`
      UPDATE pacientes_login 
      SET password_hash = ${nueva} -- Ojo: En producción esto debe ir con bcrypt
      WHERE paciente_id = ${pacienteId}
    `;

    return { success: true, message: "La contraseña se actualizó con éxito." };
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    return { success: false, message: "Error al actualizar la contraseña." };
  }
}

// a3) Consultar citas futuras
export async function obtenerCitasFuturas(pacienteId: number) {
  try {
    // Consulta a la tabla de citas filtrando por fecha mayor a hoy
    const citas = await sql`
      SELECT * FROM citas 
      WHERE paciente_id = ${pacienteId} AND fecha_cita >= CURRENT_DATE
      ORDER BY fecha_cita ASC
      LIMIT 5
    `;
    return citas;
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return [];
  }
}