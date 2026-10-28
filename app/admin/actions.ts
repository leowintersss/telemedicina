'use server'

import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL="postgresql://neondb_owner:npg_Ur4c6uKOFVaS@ep-crimson-dream-b49s2cbz-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
// Buscar pacientes
export async function buscarPacientes(termino: string) {
  try {
    const busqueda = `%${termino.trim()}%`
    const pacientes = await sql`
      SELECT id, nombre_completo, curp, email, sexo, fecha_nacimiento, rfc, nss, domicilio, telefono, tipo_sangre, membresia
      FROM patients 
      WHERE nombre_completo ILIKE ${busqueda} 
         OR curp ILIKE ${busqueda} 
         OR email ILIKE ${busqueda}
      ORDER BY nombre_completo ASC
    `
    return { success: true, pacientes }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, message: `Error: ${err.message || 'Desconocido'}`, pacientes: [] }
  }
}

// Obtener historial de un paciente (ordenado del más reciente al más antiguo)
export async function obtenerHistorialSignosAdmin(patientId: number) {
  try {
    const historial = await sql`
      SELECT id, presion, frecuencia_cardiaca, temperatura, observaciones, created_at 
      FROM vital_signs 
      WHERE patient_id = ${patientId} 
      ORDER BY created_at DESC
    `
    return { success: true, historial }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, message: `Error: ${err.message || 'Desconocido'}`, historial: [] }
  }
}

// Registrar chequeo desde Admin
export async function registrarSignosAdmin(datos: {
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

// Obtener lista de enfermeras
export async function obtenerEnfermeras() {
  try {
    const enfermeras = await sql`SELECT id, nombre_completo, email, telefono, created_at FROM nurses ORDER BY id ASC`
    return { success: true, enfermeras }
  } catch (error) {
    return { success: false, enfermeras: [] }
  }
}

// Dar de alta a una nueva enfermera
export async function registrarEnfermera(datos: {
  nombre: string
  email: string
  password: string
  telefono: string
}) {
  try {
    await sql`
      INSERT INTO nurses (nombre_completo, email, password_hash, telefono)
      VALUES (${datos.nombre}, ${datos.email.trim().toLowerCase()}, ${datos.password}, ${datos.telefono})
    `
    return { success: true, message: '¡Enfermera dada de alta correctamente!' }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, message: `Error al registrar: ${err.message || 'Correo duplicado u otro error'}` }
  }
}

// Obtener lista de co-administradores
export async function obtenerAdmins() {
  try {
    const admins = await sql`SELECT id, nombre_completo, email, created_at FROM admins ORDER BY id ASC`
    return { success: true, admins }
  } catch (error) {
    return { success: false, admins: [] }
  }
}