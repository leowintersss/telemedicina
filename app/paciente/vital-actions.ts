'use server'

import { neon } from '@neondatabase/serverless'

const sql = neon('postgresql://neondb_owner:npg_6EfuqAs0CNSD@ep-crimson-dream-b49s2cbz-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require')

export async function registrarSignosVitales(email: string, datos: {
  presion: string
  frecuenciaCardiaca: number
  temperatura: number
  observaciones?: string
}) {
  try {
    // 1. Buscamos el ID del paciente usando su email
    const paciente = await sql`SELECT id FROM patients WHERE email = ${email}`
    if (paciente.length === 0) {
      return { success: false, message: 'Paciente no encontrado.' }
    }
    const patientId = paciente[0].id

    // 2. Insertamos los signos vitales
    await sql`
      INSERT INTO vital_signs (patient_id, presion, frecuencia_cardiaca, temperatura, observaciones)
      VALUES (${patientId}, ${datos.presion}, ${datos.frecuenciaCardiaca}, ${datos.temperatura}, ${datos.observaciones || null})
    `

    return { success: true, message: 'Signos vitales registrados correctamente.' }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, message: `Error al guardar: ${err.message || 'Desconocido'}` }
  }
}

export async function obtenerSignosVitales(email: string) {
  try {
    const paciente = await sql`SELECT id FROM patients WHERE email = ${email}`
    if (paciente.length === 0) return []

    const historial = await sql`
      SELECT * FROM vital_signs 
      WHERE patient_id = ${paciente[0].id} 
      ORDER BY created_at DESC
    `
    return historial
  } catch (error) {
    console.error("Error al obtener signos vitales:", error)
    return []
  }
}