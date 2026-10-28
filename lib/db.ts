import { neon } from '@neondatabase/serverless';

// Pega aquí la cadena de conexión completa que copiaste de Neon
const sql = neon(process.env.DATABASE_URL="postgresql://neondb_owner:npg_Ur4c6uKOFVaS@ep-crimson-dream-b49s2cbz-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require");export const sql = neon(connectionString);