import { createClient } from '@supabase/supabase-js'

// Pegamos las llaves directamente para evitar problemas con el archivo .env.local temporalmente
const supabaseUrl = 'https://uisqyjrhnxznwvquzn.supabase.co'
const supabaseAnonKey = 'sb_publishable_1eMyp_HzJ3gPdzqg6SQVPg_vDGOL7hi' // Asegúrate de poner tu llave completa aquí

export const supabase = createClient(supabaseUrl, supabaseAnonKey)