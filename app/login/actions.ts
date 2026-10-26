'use server'

import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!);
export async function loginPaciente(email: string, passwordInput: string) {
  try {
    // Buscamos al paciente por su correo electrónico en Neon
    const pacientes = await sql`
      SELECT * FROM patients WHERE email = ${email}
    `

    if (pacientes.length === 0) {
      return { success: false, message: 'Correo electrónico no registrado.' }
    }

    const paciente = pacientes[0]

    // Validamos la contraseña
    if (paciente.password_hash !== passwordInput) {
      return { success: false, message: 'Contraseña incorrecta.' }
    }

    return { 
      success: true, 
      message: '¡Bienvenido!', 
      pacienteId: paciente.id 
    }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, message: `Error en el servidor: ${err.message || 'Desconocido'}` }
  }
}