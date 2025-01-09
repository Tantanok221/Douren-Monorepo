import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";
import { neon } from "@neondatabase/serverless";
export function initDB(url:string) {
  const sql = neon(url);
  const db = drizzle(sql, { schema });
  return db;
}
