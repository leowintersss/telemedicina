'use server'

import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL="postgresql://neondb_owner:npg_Ur4c6uKOFVaS@ep-crimson-dream-b49s2cbz-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
// 1. Cambiar contraseña para cualquier rol (patients, nurses, admins)
export async function cambiarPassword(tipoRol: 'patients' | 'nurses' | 'admins', email: string, actual: string, nueva: string) {
  try {
    if (nueva.length < 8) {
      return { success: false, message: 'La nueva contraseña debe tener al menos 8 caracteres.' }
    }

    // Verificar usuario y contraseña actual
    const tabla = tipoRol === 'patients' ? 'patients' : tipoRol === 'nurses' ? 'nurses' : 'admins'
    
    // Consulta dinámica segura por tabla
    const usuario = tipoRol === 'patients' 
      ? await sql`SELECT * FROM patients WHERE email = ${email}`
      : tipoRol === 'nurses'
      ? await sql`SELECT * FROM nurses WHERE email = ${email}`
      : await sql`SELECT * FROM admins WHERE email = ${email}`

    if (usuario.length === 0) return { success: false, message: 'Usuario no encontrado.' }

    if (usuario[0].password_hash !== actual) {
      return { success: false, message: 'La contraseña actual es incorrecta.' }
    }

    // Actualizar con la nueva contraseña
    if (tipoRol === 'patients') {
      await sql`UPDATE patients SET password_hash = ${nueva} WHERE email = ${email}`
    } else if (tipoRol === 'nurses') {
      await sql`UPDATE nurses SET password_hash = ${nueva} WHERE email = ${email}`
    } else {
      await sql`UPDATE admins SET password_hash = ${nueva} WHERE email = ${email}`
    }

    return { success: true, message: '¡Contraseña actualizada con éxito!' }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, message: `Error al actualizar: ${err.message || 'Desconocido'}` }
  }
}

// 2. Restablecer contraseña por el Admin Supremo (para enfermeras u otros admins)
export async function adminResetPassword(rolDestino: 'nurses' | 'admins', emailObjetivo: string, nuevaPassword: string) {
  try {
    if (nuevaPassword.length < 8) {
      return { success: false, message: 'La contraseña temporal debe tener al menos 8 caracteres.' }
    }

    if (rolDestino === 'nurses') {
      await sql`UPDATE nurses SET password_hash = ${nuevaPassword} WHERE email = ${emailObjetivo}`
    } else {
      await sql`UPDATE admins SET password_hash = ${nuevaPassword} WHERE email = ${emailObjetivo}`
    }

    return { success: true, message: `¡Contraseña restablecida correctamente para ${emailObjetivo}!` }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, message: `Error: ${err.message || 'Desconocido'}` }
  }
}