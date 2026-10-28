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

    await sql`
      UPDATE patients 
      SET tipo_sangre = ${tipoSangre}, 
          telefono = ${telefonoEmergencia}
      WHERE id = ${pacienteId}
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

    await sql`
      UPDATE patients 
      SET password_hash = ${nueva}
      WHERE id = ${pacienteId}
    `;

    return { success: true, message: "La contraseña se actualizó con éxito." };
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    return { success: false, message: "Error al actualizar la contraseña." };
  }
}

// a3) Consultar citas futuras desde la BD Real
export async function obtenerCitasFuturas(pacienteId: number) {
  try {
    const citas = await sql`
      SELECT c.id, c.fecha_cita, c.tipo_cita, c.estado, n.nombre_completo as enfermera
      FROM citas c
      LEFT JOIN nurses n ON c.nurse_id = n.id
      WHERE c.patient_id = ${pacienteId} AND c.fecha_cita >= CURRENT_DATE
      ORDER BY c.fecha_cita ASC
      LIMIT 5
    `;
    return citas;
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return [];
  }
}