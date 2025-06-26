import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@pkg/database/db';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { sql } from 'drizzle-orm';

const TEST_DATABASE_URL = 'postgres://test_user:test_password@localhost:5433/douren_test';

let testDb: ReturnType<typeof drizzle>;
let testConnection: postgres.Sql;

export async function setupTestDatabase() {
  try {
    // Create connection
    testConnection = postgres(TEST_DATABASE_URL, { 
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10 
    });
    
    // Initialize Drizzle
    testDb = drizzle(testConnection, { schema: schema.s });
    
    // Run migrations
    await migrate(testDb, { 
      migrationsFolder: '../../../pkg/database/migrations' 
    });
    
    return testDb;
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }
}

export async function cleanupTestDatabase() {
  if (!testDb) return;
  
  try {
    // Clean all tables in reverse dependency order
    await testDb.delete(schema.s.eventDm);
    await testDb.delete(schema.s.authorProduct);
    await testDb.delete(schema.s.authorMain);
    await testDb.delete(schema.s.event);
    await testDb.delete(schema.s.tag);
    
    // Reset sequences
    await testDb.execute(sql`ALTER SEQUENCE IF EXISTS "author_main_id_seq" RESTART WITH 1300`);
    await testDb.execute(sql`ALTER SEQUENCE IF EXISTS "event_id_seq" RESTART WITH 5`);
    await testDb.execute(sql`ALTER SEQUENCE IF EXISTS "event_dm_id_seq" RESTART WITH 1300`);
    
  } catch (error) {
    console.error('Failed to cleanup test database:', error);
    throw error;
  }
}

export async function teardownTestDatabase() {
  if (testConnection) {
    await testConnection.end();
  }
}

export function getTestDb() {
  if (!testDb) {
    throw new Error('Test database not initialized. Call setupTestDatabase() first.');
  }
  return testDb;
}

export { TEST_DATABASE_URL };