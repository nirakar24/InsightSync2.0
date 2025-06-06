import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient, { schema });
export const prisma = db; // For compatibility with existing code 