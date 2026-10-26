import { neon } from '@neondatabase/serverless';

// Pega aquí la cadena de conexión completa que copiaste de Neon
const sql = neon(process.env.DATABASE_URL!);export const sql = neon(connectionString);