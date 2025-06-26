import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { 
  setupTestDatabase, 
  cleanupTestDatabase, 
  teardownTestDatabase,
  getTestDb 
} from '../../__test-utils__/setupTestDatabase';
import { createTestClient } from '../../__test-utils__/testServer';
import { seedMinimalData, seedSpecificEvent } from '../../__test-utils__/seedData';
import { 
  eventArtistWorkflowData,
  completeEventData,
  completeArtistData,
  minimalArtistData
} from '../../__fixtures__/integrationData';
import * as schema from '@pkg/database/db';

describe('Multi-Step Form Workflow Integration Tests', () => {
  let client: ReturnType<typeof createTestClient>;
  let db: ReturnType<typeof getTestDb>;

  beforeAll(async () => {
    await setupTestDatabase();
    client = createTestClient();
    db = getTestDb();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
    await seedMinimalData();
    await seedSpecificEvent(completeEventData);
  });

  describe('Complete Artist Form Submission Workflow', () => {
    it('should complete full workflow: Artist → EventArtist → Database verification', async () => {
      // Step 1: Create Artist via REST API
      const artistResponse = await client.api.artist.$post({
        json: eventArtistWorkflowData.artist,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(artistResponse.status).toBe(200);
      const createdArtist = await artistResponse.json();
      expect(createdArtist).toHaveProperty('id');
      expect(createdArtist.author).toBe(eventArtistWorkflowData.artist.author);

      // Step 2: Create EventArtist relationship
      const eventArtistData = {
        artistId: createdArtist.id,
        eventId: eventArtistWorkflowData.event.id,
        ...eventArtistWorkflowData.eventArtist
      };

      const eventArtistResponse = await client.api.event.artist.$post({
        json: eventArtistData,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(eventArtistResponse.status).toBe(201);
      const createdEventArtist = await eventArtistResponse.json();
      expect(createdEventArtist.artistId).toBe(createdArtist.id);
      expect(createdEventArtist.eventId).toBe(eventArtistWorkflowData.event.id);
      expect(createdEventArtist.boothName).toBe(eventArtistWorkflowData.eventArtist.boothName);

      // Step 3: Database verification - Direct database queries to ensure data integrity
      const dbArtist = await db
        .select()
        .from(schema.s.Artist)
        .where(schema.eq(schema.s.Artist.id, createdArtist.id));

      expect(dbArtist.length).toBe(1);
      expect(dbArtist[0].author).toBe(eventArtistWorkflowData.artist.author);
      expect(dbArtist[0].introduction).toBe(eventArtistWorkflowData.artist.introduction);
      expect(dbArtist[0].tags).toBe(eventArtistWorkflowData.artist.tags);
      expect(dbArtist[0].photo).toBe(eventArtistWorkflowData.artist.photo);

      const dbEventArtist = await db
        .select()
        .from(schema.s.EventArtist)
        .where(
          schema.and(
            schema.eq(schema.s.EventArtist.artistId, createdArtist.id),
            schema.eq(schema.s.EventArtist.eventId, eventArtistWorkflowData.event.id)
          )
        );

      expect(dbEventArtist.length).toBe(1);
      expect(dbEventArtist[0].boothName).toBe(eventArtistWorkflowData.eventArtist.boothName);
      expect(dbEventArtist[0].locationDay01).toBe(eventArtistWorkflowData.eventArtist.locationDay01);
      expect(dbEventArtist[0].day01).toBe(eventArtistWorkflowData.eventArtist.day01);
      expect(dbEventArtist[0].day02).toBe(eventArtistWorkflowData.eventArtist.day02);

      // Step 4: Verify the complete workflow through API query
      const verificationResponse = await client.api.event[':eventName'].artist.$get({
        param: { eventName: eventArtistWorkflowData.event.name },
        query: { 
          page: '1',
          search: eventArtistWorkflowData.artist.author
        }
      });

      expect(verificationResponse.status).toBe(200);
      const verificationData = await verificationResponse.json();
      expect(verificationData.data.length).toBe(1);
      
      const retrievedRecord = verificationData.data[0];
      expect(retrievedRecord.author).toBe(eventArtistWorkflowData.artist.author);
      expect(retrievedRecord.boothName).toBe(eventArtistWorkflowData.eventArtist.boothName);
      expect(retrievedRecord.tags).toBe(eventArtistWorkflowData.artist.tags);
    });

    it('should handle workflow with real tag processing and database storage', async () => {
      const artistWithComplexTags = {
        ...completeArtistData,
        tags: '原創,二次創作,插畫,同人誌,周邊'
      };

      // Step 1: Create artist with complex tags
      const artistResponse = await client.api.artist.$post({
        json: artistWithComplexTags,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(artistResponse.status).toBe(200);
      const createdArtist = await artistResponse.json();

      // Step 2: Create event artist relationship
      const eventArtistResponse = await client.api.event.artist.$post({
        json: {
          artistId: createdArtist.id,
          eventId: completeEventData.id,
          boothName: 'TAGS-01',
          locationDay01: '大廳-TAGS01',
          day01: true,
          day02: true,
          day03: false
        },
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(eventArtistResponse.status).toBe(201);

      // Step 3: Verify tag processing by filtering
      const tagFilterResponse = await client.api.event[':eventName'].artist.$get({
        param: { eventName: completeEventData.name },
        query: { 
          page: '1',
          tag: '原創'
        }
      });

      expect(tagFilterResponse.status).toBe(200);
      const tagData = await tagFilterResponse.json();
      expect(tagData.data.length).toBe(1);
      expect(tagData.data[0].tags).toContain('原創');
      expect(tagData.data[0].tags).toContain('二次創作');
      expect(tagData.data[0].tags).toContain('插畫');

      // Step 4: Database verification of tag storage
      const dbArtist = await db
        .select()
        .from(schema.s.Artist)
        .where(schema.eq(schema.s.Artist.id, createdArtist.id));

      expect(dbArtist[0].tags).toBe('原創,二次創作,插畫,同人誌,周邊');
    });

    it('should handle workflow with all optional fields populated', async () => {
      const completeArtistWithAllFields = {
        author: 'Complete Workflow Artist',
        introduction: 'Artist with all optional fields for complete workflow testing',
        tags: '原創,測試,Complete',
        photo: 'https://example.com/complete-workflow.jpg',
        twitterLink: 'https://twitter.com/complete_workflow',
        officialLink: 'https://complete-workflow.example.com',
        instagramLink: 'https://instagram.com/complete_workflow',
        pixivLink: 'https://pixiv.net/users/complete',
        otherLink: 'https://other-platform.com/complete_workflow'
      };

      const completeEventArtistData = {
        boothName: 'COMPLETE-01',
        locationDay01: '大廳-COMPLETE01',
        locationDay02: '大廳-COMPLETE02',
        dm: 'https://example.com/complete-dm.jpg',
        day01: true,
        day02: true,
        day03: true
      };

      // Step 1: Create artist with all fields
      const artistResponse = await client.api.artist.$post({
        json: completeArtistWithAllFields,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(artistResponse.status).toBe(200);
      const createdArtist = await artistResponse.json();

      // Verify all artist fields were stored correctly
      expect(createdArtist.twitterLink).toBe(completeArtistWithAllFields.twitterLink);
      expect(createdArtist.officialLink).toBe(completeArtistWithAllFields.officialLink);
      expect(createdArtist.instagramLink).toBe(completeArtistWithAllFields.instagramLink);
      expect(createdArtist.pixivLink).toBe(completeArtistWithAllFields.pixivLink);
      expect(createdArtist.otherLink).toBe(completeArtistWithAllFields.otherLink);

      // Step 2: Create event artist with all fields
      const eventArtistResponse = await client.api.event.artist.$post({
        json: {
          artistId: createdArtist.id,
          eventId: completeEventData.id,
          ...completeEventArtistData
        },
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(eventArtistResponse.status).toBe(201);
      const createdEventArtist = await eventArtistResponse.json();

      // Verify all event artist fields were stored correctly
      expect(createdEventArtist.locationDay02).toBe(completeEventArtistData.locationDay02);
      expect(createdEventArtist.dm).toBe(completeEventArtistData.dm);
      expect(createdEventArtist.day03).toBe(completeEventArtistData.day03);

      // Step 3: Database verification of complete data storage
      const dbArtist = await db
        .select()
        .from(schema.s.Artist)
        .where(schema.eq(schema.s.Artist.id, createdArtist.id));

      expect(dbArtist[0].instagramLink).toBe(completeArtistWithAllFields.instagramLink);
      expect(dbArtist[0].pixivLink).toBe(completeArtistWithAllFields.pixivLink);
      expect(dbArtist[0].otherLink).toBe(completeArtistWithAllFields.otherLink);

      const dbEventArtist = await db
        .select()
        .from(schema.s.EventArtist)
        .where(
          schema.and(
            schema.eq(schema.s.EventArtist.artistId, createdArtist.id),
            schema.eq(schema.s.EventArtist.eventId, completeEventData.id)
          )
        );

      expect(dbEventArtist[0].locationDay02).toBe(completeEventArtistData.locationDay02);
      expect(dbEventArtist[0].dm).toBe(completeEventArtistData.dm);
      expect(dbEventArtist[0].day03).toBe(true);
    });

    it('should handle workflow with minimal required fields only', async () => {
      const minimalEventArtistData = {
        boothName: 'MINIMAL-01',
        locationDay01: '大廳-MINIMAL01',
        day01: true,
        day02: false,
        day03: false
      };

      // Step 1: Create artist with minimal data
      const artistResponse = await client.api.artist.$post({
        json: minimalArtistData,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(artistResponse.status).toBe(200);
      const createdArtist = await artistResponse.json();

      // Verify minimal fields and null optional fields
      expect(createdArtist.author).toBe(minimalArtistData.author);
      expect(createdArtist.introduction).toBe(minimalArtistData.introduction);
      expect(createdArtist.tags).toBeNull();
      expect(createdArtist.photo).toBeNull();

      // Step 2: Create event artist with minimal data
      const eventArtistResponse = await client.api.event.artist.$post({
        json: {
          artistId: createdArtist.id,
          eventId: completeEventData.id,
          ...minimalEventArtistData
        },
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(eventArtistResponse.status).toBe(201);
      const createdEventArtist = await eventArtistResponse.json();

      // Verify minimal event artist fields
      expect(createdEventArtist.boothName).toBe(minimalEventArtistData.boothName);
      expect(createdEventArtist.locationDay01).toBe(minimalEventArtistData.locationDay01);
      expect(createdEventArtist.locationDay02).toBeNull();
      expect(createdEventArtist.dm).toBeNull();

      // Step 3: Database verification
      const dbRecord = await db
        .select()
        .from(schema.s.Artist)
        .leftJoin(schema.s.EventArtist, schema.eq(schema.s.Artist.id, schema.s.EventArtist.artistId))
        .where(schema.eq(schema.s.Artist.id, createdArtist.id));

      expect(dbRecord.length).toBe(1);
      expect(dbRecord[0].Artist.tags).toBeNull();
      expect(dbRecord[0].EventArtist?.locationDay02).toBeNull();
      expect(dbRecord[0].EventArtist?.dm).toBeNull();
    });
  });

  describe('Workflow Failure Scenarios', () => {
    it('should handle workflow failure with database rollback on artist creation failure', async () => {
      // Attempt to create artist with invalid data
      const invalidArtistData = {
        author: '', // Empty author should fail validation
        introduction: 'Should not be created'
      };

      const artistResponse = await client.api.artist.$post({
        json: invalidArtistData,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(artistResponse.status).toBe(400);

      // Verify no artist was created in database
      const dbArtists = await db
        .select()
        .from(schema.s.Artist)
        .where(schema.eq(schema.s.Artist.introduction, 'Should not be created'));

      expect(dbArtists.length).toBe(0);
    });

    it('should handle workflow failure on EventArtist creation with foreign key violation', async () => {
      // Step 1: Create valid artist
      const artistResponse = await client.api.artist.$post({
        json: minimalArtistData,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(artistResponse.status).toBe(200);
      const createdArtist = await artistResponse.json();

      // Step 2: Attempt to create EventArtist with non-existent event
      const invalidEventArtistData = {
        artistId: createdArtist.id,
        eventId: 99999, // Non-existent event
        boothName: 'INVALID-01',
        locationDay01: '大廳-INVALID01',
        day01: true,
        day02: false,
        day03: false
      };

      const eventArtistResponse = await client.api.event.artist.$post({
        json: invalidEventArtistData,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(eventArtistResponse.status).toBeGreaterThanOrEqual(400);

      // Verify artist still exists but no EventArtist relationship was created
      const dbArtist = await db
        .select()
        .from(schema.s.Artist)
        .where(schema.eq(schema.s.Artist.id, createdArtist.id));

      expect(dbArtist.length).toBe(1);

      const dbEventArtist = await db
        .select()
        .from(schema.s.EventArtist)
        .where(schema.eq(schema.s.EventArtist.artistId, createdArtist.id));

      expect(dbEventArtist.length).toBe(0);
    });
  });

  describe('Concurrent Form Submissions', () => {
    it('should handle concurrent artist and event artist creation with database integrity', async () => {
      const concurrentWorkflows = Array.from({ length: 3 }, (_, i) => 
        async () => {
          // Create unique artist
          const artistResponse = await client.api.artist.$post({
            json: {
              author: `Concurrent Artist ${i + 1}`,
              introduction: `Concurrent workflow test artist ${i + 1}`,
              tags: `Concurrent,Test${i + 1}`
            },
            header: {
              'Authorization': 'Bearer test-token'
            }
          });

          expect(artistResponse.status).toBe(200);
          const createdArtist = await artistResponse.json();

          // Create event artist relationship
          const eventArtistResponse = await client.api.event.artist.$post({
            json: {
              artistId: createdArtist.id,
              eventId: completeEventData.id,
              boothName: `CONCURRENT-${i + 1}`,
              locationDay01: `大廳-CONCURRENT${i + 1}`,
              day01: true,
              day02: false,
              day03: false
            },
            header: {
              'Authorization': 'Bearer test-token'
            }
          });

          expect(eventArtistResponse.status).toBe(201);
          return { artist: createdArtist, eventArtist: await eventArtistResponse.json() };
        }
      );

      // Execute workflows concurrently
      const results = await Promise.all(concurrentWorkflows.map(workflow => workflow()));

      // Verify all workflows succeeded
      expect(results.length).toBe(3);
      results.forEach((result, i) => {
        expect(result.artist.author).toBe(`Concurrent Artist ${i + 1}`);
        expect(result.eventArtist.boothName).toBe(`CONCURRENT-${i + 1}`);
      });

      // Verify database integrity - all records should exist
      const dbArtists = await db
        .select()
        .from(schema.s.Artist)
        .where(schema.like(schema.s.Artist.author, 'Concurrent Artist %'));

      expect(dbArtists.length).toBe(3);

      const dbEventArtists = await db
        .select()
        .from(schema.s.EventArtist)
        .where(schema.like(schema.s.EventArtist.boothName, 'CONCURRENT-%'));

      expect(dbEventArtists.length).toBe(3);

      // Verify all booth names are unique
      const boothNames = dbEventArtists.map(ea => ea.boothName);
      const uniqueBoothNames = [...new Set(boothNames)];
      expect(uniqueBoothNames.length).toBe(boothNames.length);
    });
  });

  describe('Cross-Workflow Data Consistency', () => {
    it('should maintain data consistency across multiple workflow executions', async () => {
      const workflows = [
        {
          artist: { author: 'Consistency Artist 1', introduction: 'First consistency test' },
          booth: 'CONSISTENCY-01'
        },
        {
          artist: { author: 'Consistency Artist 2', introduction: 'Second consistency test' },
          booth: 'CONSISTENCY-02'
        }
      ];

      const results = [];

      for (const workflow of workflows) {
        // Create artist
        const artistResponse = await client.api.artist.$post({
          json: workflow.artist,
          header: {
            'Authorization': 'Bearer test-token'
          }
        });

        const createdArtist = await artistResponse.json();

        // Create event artist
        const eventArtistResponse = await client.api.event.artist.$post({
          json: {
            artistId: createdArtist.id,
            eventId: completeEventData.id,
            boothName: workflow.booth,
            locationDay01: `大廳-${workflow.booth}`,
            day01: true,
            day02: false,
            day03: false
          },
          header: {
            'Authorization': 'Bearer test-token'
          }
        });

        results.push({
          artist: createdArtist,
          eventArtist: await eventArtistResponse.json()
        });
      }

      // Verify data consistency by querying all records
      const allEventArtists = await client.api.event[':eventName'].artist.$get({
        param: { eventName: completeEventData.name },
        query: { page: '1' }
      });

      const allData = await allEventArtists.json();
      const consistencyArtists = allData.data.filter((artist: any) => 
        artist.author.includes('Consistency Artist')
      );

      expect(consistencyArtists.length).toBe(2);
      
      // Verify each artist has unique and correct data
      const artist1 = consistencyArtists.find((a: any) => a.author === 'Consistency Artist 1');
      const artist2 = consistencyArtists.find((a: any) => a.author === 'Consistency Artist 2');

      expect(artist1.boothName).toBe('CONSISTENCY-01');
      expect(artist1.introduction).toBe('First consistency test');
      
      expect(artist2.boothName).toBe('CONSISTENCY-02');
      expect(artist2.introduction).toBe('Second consistency test');
    });
  });
});