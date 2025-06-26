import { getTestDb } from './setupTestDatabase';
import * as schema from '@pkg/database/db';
import { 
  completeEventData, 
  tagTestData, 
  paginationTestData, 
  searchTestData 
} from '../__fixtures__/integrationData';

export async function seedTestData() {
  const db = getTestDb();
  
  try {
    // Seed tags
    await db.insert(schema.s.tag).values(tagTestData).onConflictDoNothing();
    
    // Seed test event
    await db.insert(schema.s.event).values(completeEventData).onConflictDoNothing();
    
    // Seed pagination test artists
    for (const artistData of paginationTestData.artists) {
      await db.insert(schema.s.authorMain).values(artistData).onConflictDoNothing();
    }
    
    // Seed search test artists
    for (const artistData of searchTestData.artists) {
      await db.insert(schema.s.authorMain).values(artistData).onConflictDoNothing();
    }
    
    console.log('Test data seeded successfully');
  } catch (error) {
    console.error('Failed to seed test data:', error);
    throw error;
  }
}

export async function seedMinimalData() {
  const db = getTestDb();
  
  try {
    // Seed only essential data for basic tests
    await db.insert(schema.s.tag).values([
      { tag: '原創', count: 0, index: 1 },
      { tag: '測試', count: 0, index: 2 }
    ]).onConflictDoNothing();
    
    await db.insert(schema.s.event).values({
      id: 1,
      name: 'Test Event'
    }).onConflictDoNothing();
    
    console.log('Minimal test data seeded successfully');
  } catch (error) {
    console.error('Failed to seed minimal test data:', error);
    throw error;
  }
}

export async function seedSpecificArtist(artistData: any) {
  const db = getTestDb();
  
  try {
    const result = await db.insert(schema.s.authorMain).values(artistData).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to seed specific artist:', error);
    throw error;
  }
}

export async function seedSpecificEvent(eventData: any) {
  const db = getTestDb();
  
  try {
    const result = await db.insert(schema.s.event).values(eventData).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to seed specific event:', error);
    throw error;
  }
}

export async function seedEventArtistRelation(eventArtistData: any) {
  const db = getTestDb();
  
  try {
    const result = await db.insert(schema.s.eventDm).values(eventArtistData).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to seed event artist relation:', error);
    throw error;
  }
}