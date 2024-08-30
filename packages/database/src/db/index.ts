import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
export function initDB(url: string){  
  const client = postgres(url);
  const db = drizzle(client, { schema });
  return db
}