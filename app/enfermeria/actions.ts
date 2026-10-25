'use server'

import { neon } from '@neondatabase/serverless'

const sql = neon('postgresql://neondb_owner:npg_6EfuqAs0CNSD@ep-crimson-dream-b49s2cbz-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require')

export async function obtenerDatosEnfermera(email: string) {
  try {
    const res = await sql`SELECT * FROM nurses WHERE email = ${email}`
    if (res.length === 0) return { success: false, nurse: null }
    return { success: true, nurse: res[0] }
  } catch (error) {
    return { success: false, nurse: null }
  }
}

export async function actualizarDatosEnfermera(emailActual: string, nuevoEmail: string, telefono: string) {
  try {
    await sql`
      UPDATE nurses 
      SET email = ${nuevoEmail.trim().toLowerCase()}, telefono = ${telefono}
      WHERE email = ${emailActual}
    `
    return { success: true, message: 'Guardado exitoso' }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, message: `Error: ${err.message || 'Desconocido'}` }
  }
}

export async function buscarPacientesEnfermeria(termino: string) {
  try {
    const busqueda = `%${termino.trim()}%`
    const pacientes = await sql`
      SELECT id, nombre_completo, curp, email, sexo, telefono, tipo_sangre 
      FROM patients 
      WHERE nombre_completo ILIKE ${busqueda} 
         OR curp ILIKE ${busqueda} 
         OR email ILIKE ${busqueda}
      ORDER BY nombre_completo ASC
    `
    return { success: true, pacientes }
  } catch (error) {
    return { success: false, pacientes: [] }
  }
}

// Obtener los últimos 10 chequeos ordenados del más reciente al más antiguo
export async function obtenerHistorialEnfermeria(patientId: number) {
  try {
    const historial = await sql`
      SELECT id, presion, frecuencia_cardiaca, temperatura, observaciones, created_at 
      FROM vital_signs 
      WHERE patient_id = ${patientId} 
      ORDER BY created_at DESC 
      LIMIT 10
    `
    return { success: true, historial }
  } catch (error) {
    return { success: false, historial: [] }
  }
}

export async function registrarSignosEnfermeria(datos: {
  patientId: number
  presion: string
  frecuenciaCardiaca: number
  temperatura: number
  observaciones?: string
}) {
  try {
    await sql`
      INSERT INTO vital_signs (patient_id, presion, frecuencia_cardiaca, temperatura, observaciones)
      VALUES (${datos.patientId}, ${datos.presion}, ${datos.frecuenciaCardiaca}, ${datos.temperatura}, ${datos.observaciones || null})
    `
    return { success: true, message: '¡Chequeo registrado con éxito!' }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, message: `Error: ${err.message || 'Desconocido'}` }
  }
}