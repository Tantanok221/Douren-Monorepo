import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import { config } from "dotenv";
export function initDB() {
  config();
  console.log("db url: " + process.env.DATABASE_URL)
  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client, { schema });
  return db;
}
