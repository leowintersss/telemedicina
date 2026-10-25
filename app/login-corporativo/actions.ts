'use server'

import { neon } from '@neondatabase/serverless'

const sql = neon('postgresql://neondb_owner:npg_6EfuqAs0CNSD@ep-crimson-dream-b49s2cbz-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require')

export async function loginCorporativo(email: string, passwordInput: string) {
  try {
    const emailLimPIO = email.trim().toLowerCase()

    // 1. Verificar si es Administrador
    const adminCheck = await sql`
      SELECT * FROM admins WHERE email = ${emailLimPIO}
    `
    if (adminCheck.length > 0) {
      const admin = adminCheck[0]
      if (admin.password_hash === passwordInput) {
        return { success: true, rol: 'admin', nombre: admin.nombre_completo, redirect: '/admin' }
      }
      return { success: false, message: 'Contraseña incorrecta para Administrador.' }
    }

    // 2. Verificar si es Enfermera
    const nurseCheck = await sql`
      SELECT * FROM nurses WHERE email = ${emailLimPIO}
    `
    if (nurseCheck.length > 0) {
      const nurse = nurseCheck[0]
      if (nurse.password_hash === passwordInput) {
        return { success: true, rol: 'enfermeria', nombre: nurse.nombre_completo, redirect: '/enfermeria' }
      }
      return { success: false, message: 'Contraseña incorrecta para Enfermería.' }
    }

    // 3. Verificar si por error es un Paciente intentando entrar aquí
    const patientCheck = await sql`
      SELECT * FROM patients WHERE email = ${emailLimPIO}
    `
    if (patientCheck.length > 0) {
      return { success: false, message: 'Acceso denegado: Este login es exclusivo para personal corporativo. Utilice el acceso de pacientes.' }
    }

    return { success: false, message: 'Correo electrónico corporativo no registrado en el sistema.' }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, message: `Error en el servidor: ${err.message || 'Desconocido'}` }
  }
}