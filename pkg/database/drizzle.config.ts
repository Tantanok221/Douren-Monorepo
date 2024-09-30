import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

let url = ""
if(process.env.DEV_ENV == "dev"){
  url = process.env.LOCAL_DATABASE_URL!;
}else if(process.env.DEV_ENV == "stg"){
  url = process.env.STG_DATABASE_URL!;
}else if(process.env.DEV_ENV == "prod"){
  url = process.env.DATABASE_URL!
}
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
   url: process.env.STG_DATABASE_URL
  },
});