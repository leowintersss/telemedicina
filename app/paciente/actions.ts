'use server'

import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!);
export async function obtenerDatosPaciente(email: string) {
  try {
    const pacientes = await sql`
      SELECT id, nombre_completo, fecha_nacimiento, sexo, curp, email, rfc, telefono, nss, domicilio, tipo_sangre, membresia, created_at 
      FROM patients 
      WHERE email = ${email}
    `
    if (pacientes.length === 0) return { success: false, message: 'Paciente no encontrado.' }
    return { success: true, paciente: pacientes[0] }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, message: `Error: ${err.message || 'Desconocido'}` }
  }
}

export async function obtenerUltimoChequeo(email: string) {
  try {
    const paciente = await sql`SELECT id FROM patients WHERE email = ${email}`
    if (paciente.length === 0) return { success: false, chequeo: null }

    const ultimoChequeo = await sql`
      SELECT presion, frecuencia_cardiaca, temperatura, observaciones, created_at 
      FROM vital_signs 
      WHERE patient_id = ${paciente[0].id} 
      ORDER BY created_at DESC 
      LIMIT 1
    `
    return { success: true, chequeo: ultimoChequeo.length > 0 ? ultimoChequeo[0] : null }
  } catch (error) {
    return { success: false, chequeo: null }
  }
}

export async function actualizarDatosOpcionales(email: string, datos: {
  rfc: string
  telefono: string
  nss: string
  domicilio: string
  tipoSangre: string
  membresia: string
}) {
  try {
    await sql`
      UPDATE patients 
      SET rfc = ${datos.rfc.toUpperCase()},
          telefono = ${datos.telefono},
          nss = ${datos.nss},
          domicilio = ${datos.domicilio},
          tipo_sangre = ${datos.tipoSangre},
          membresia = ${datos.membresia}
      WHERE email = ${email}
    `
    return { success: true, message: 'Guardado exitoso' }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, message: `Error: ${err.message || 'Desconocido'}` }
  }
}