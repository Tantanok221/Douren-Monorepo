import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { 
  setupTestDatabase, 
  cleanupTestDatabase, 
  teardownTestDatabase 
} from '../../__test-utils__/setupTestDatabase';
import { createTestClient } from '../../__test-utils__/testServer';
import { 
  seedMinimalData, 
  seedSpecificArtist, 
  seedSpecificEvent,
  seedEventArtistRelation 
} from '../../__test-utils__/seedData';
import { 
  completeEventData,
  completeArtistData,
  eventArtistWorkflowData,
  invalidEventArtistData
} from '../../__fixtures__/integrationData';

describe('Event REST API Integration Tests', () => {
  let client: ReturnType<typeof createTestClient>;

  beforeAll(async () => {
    await setupTestDatabase();
    client = createTestClient();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
    await seedMinimalData();
  });

  describe('GET /api/event/', () => {
    beforeEach(async () => {
      await seedSpecificEvent(completeEventData);
      await seedSpecificEvent({
        ...completeEventData,
        id: 2,
        name: 'Second Test Event',
        year: 2025
      });
    });

    it('should fetch all events with real database query', async () => {
      const response = await client.api.event.$get();

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThanOrEqual(2);
      
      const eventNames = data.map((event: any) => event.name);
      expect(eventNames).toContain('Integration Test Event');
      expect(eventNames).toContain('Second Test Event');
    });
  });

  describe('GET /api/event/:eventName', () => {
    beforeEach(async () => {
      await seedSpecificEvent(completeEventData);
    });

    it('should fetch specific event by name with real database lookup', async () => {
      const response = await client.api.event[':eventName'].$get({
        param: { eventName: 'Integration Test Event' }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.name).toBe(completeEventData.name);
      expect(data.year).toBe(completeEventData.year);
      expect(data.location).toBe(completeEventData.location);
      expect(data.description).toBe(completeEventData.description);
    });

    it('should handle non-existent event name gracefully', async () => {
      const response = await client.api.event[':eventName'].$get({
        param: { eventName: 'NonExistentEvent' }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toBeNull();
    });
  });

  describe('POST /api/event/', () => {
    it('should create new event with real database insertion', async () => {
      const newEventData = {
        id: 3,
        name: 'Created Test Event',
        year: 2026,
        location: 'Created Location',
        description: 'Event created via integration test'
      };

      const response = await client.api.event.$post({
        json: newEventData,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(response.status).toBe(201);
      
      const data = await response.json();
      expect(data.name).toBe(newEventData.name);
      expect(data.year).toBe(newEventData.year);

      // Verify persistence by fetching the created event
      const fetchResponse = await client.api.event[':eventName'].$get({
        param: { eventName: newEventData.name }
      });
      
      const fetchData = await fetchResponse.json();
      expect(fetchData.name).toBe(newEventData.name);
      expect(fetchData.id).toBe(newEventData.id);
    });

    it('should handle duplicate event ID creation', async () => {
      await seedSpecificEvent(completeEventData);

      const duplicateEventData = {
        ...completeEventData,
        name: 'Different Name Same ID'
      };

      const response = await client.api.event.$post({
        json: duplicateEventData,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      // Should handle conflict appropriately
      expect([201, 409]).toContain(response.status);
    });
  });

  describe('GET /api/event/:eventName/artist', () => {
    let testArtist: any;
    let testEvent: any;

    beforeEach(async () => {
      testArtist = await seedSpecificArtist(completeArtistData);
      testEvent = await seedSpecificEvent(completeEventData);
      
      await seedEventArtistRelation({
        artistId: testArtist.id,
        eventId: testEvent.id,
        boothName: 'TEST-01',
        locationDay01: '大廳-TEST01',
        day01: true,
        day02: false,
        day03: false
      });
    });

    it('should fetch event artists with real complex joins', async () => {
      const response = await client.api.event[':eventName'].artist.$get({
        param: { eventName: completeEventData.name },
        query: { page: '1' }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('pagination');
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBe(1);
      
      const eventArtist = data.data[0];
      expect(eventArtist.boothName).toBe('TEST-01');
      expect(eventArtist.locationDay01).toBe('大廳-TEST01');
      expect(eventArtist.author).toBe(completeArtistData.author);
    });

    it('should filter event artists by tags with real database operations', async () => {
      const response = await client.api.event[':eventName'].artist.$get({
        param: { eventName: completeEventData.name },
        query: { 
          page: '1',
          tag: '原創'
        }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.data.length).toBeGreaterThan(0);
      expect(data.data.every((artist: any) => artist.tags?.includes('原創'))).toBe(true);
    });

    it('should search event artists with real database query', async () => {
      const response = await client.api.event[':eventName'].artist.$get({
        param: { eventName: completeEventData.name },
        query: { 
          page: '1',
          search: completeArtistData.author
        }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.data.length).toBe(1);
      expect(data.data[0].author).toBe(completeArtistData.author);
    });

    it('should handle pagination for event artists', async () => {
      // Seed additional artists for the same event
      for (let i = 0; i < 15; i++) {
        const additionalArtist = await seedSpecificArtist({
          author: `Event Artist ${i + 1}`,
          introduction: `Artist ${i + 1} for event testing`
        });
        
        await seedEventArtistRelation({
          artistId: additionalArtist.id,
          eventId: testEvent.id,
          boothName: `BOOTH-${i + 1}`,
          locationDay01: `大廳-${i + 1}`,
          day01: true,
          day02: false,
          day03: false
        });
      }

      const page1Response = await client.api.event[':eventName'].artist.$get({
        param: { eventName: completeEventData.name },
        query: { page: '1' }
      });
      
      const page2Response = await client.api.event[':eventName'].artist.$get({
        param: { eventName: completeEventData.name },
        query: { page: '2' }
      });

      expect(page1Response.status).toBe(200);
      expect(page2Response.status).toBe(200);
      
      const page1Data = await page1Response.json();
      const page2Data = await page2Response.json();
      
      expect(page1Data.pagination.currentPage).toBe(1);
      expect(page2Data.pagination.currentPage).toBe(2);
      
      // Ensure different artists on different pages
      const page1Booths = page1Data.data.map((artist: any) => artist.boothName);
      const page2Booths = page2Data.data.map((artist: any) => artist.boothName);
      const hasOverlap = page1Booths.some((booth: string) => page2Booths.includes(booth));
      expect(hasOverlap).toBe(false);
    });
  });

  describe('POST /api/event/artist', () => {
    let testArtist: any;
    let testEvent: any;

    beforeEach(async () => {
      testArtist = await seedSpecificArtist(completeArtistData);
      testEvent = await seedSpecificEvent(completeEventData);
    });

    it('should create event-artist relationship with real foreign key creation', async () => {
      const eventArtistData = {
        artistId: testArtist.id,
        eventId: testEvent.id,
        boothName: 'INTEGRATION-01',
        locationDay01: '大廳-INTEGRATION01',
        locationDay02: '大廳-INTEGRATION02',
        dm: 'https://example.com/integration-dm.jpg',
        day01: true,
        day02: true,
        day03: false
      };

      const response = await client.api.event.artist.$post({
        json: eventArtistData,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(response.status).toBe(201);
      
      const data = await response.json();
      expect(data.artistId).toBe(testArtist.id);
      expect(data.eventId).toBe(testEvent.id);
      expect(data.boothName).toBe('INTEGRATION-01');
      expect(data.locationDay01).toBe('大廳-INTEGRATION01');
      expect(data.day01).toBe(true);
      expect(data.day02).toBe(true);
      expect(data.day03).toBe(false);

      // Verify the relationship exists by querying event artists
      const verifyResponse = await client.api.event[':eventName'].artist.$get({
        param: { eventName: completeEventData.name },
        query: { page: '1' }
      });
      
      const verifyData = await verifyResponse.json();
      expect(verifyData.data.length).toBe(1);
      expect(verifyData.data[0].boothName).toBe('INTEGRATION-01');
    });

    it('should handle creation with non-existent artist ID', async () => {
      const invalidData = {
        ...invalidEventArtistData.nonExistentArtist,
        eventId: testEvent.id
      };

      const response = await client.api.event.artist.$post({
        json: invalidData,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      // Should return error due to foreign key constraint
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should handle creation with non-existent event ID', async () => {
      const invalidData = {
        ...invalidEventArtistData.nonExistentEvent,
        artistId: testArtist.id
      };

      const response = await client.api.event.artist.$post({
        json: invalidData,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      // Should return error due to foreign key constraint
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('PUT /api/event/artist', () => {
    let testArtist: any;
    let testEvent: any;
    let eventArtistRelation: any;

    beforeEach(async () => {
      testArtist = await seedSpecificArtist(completeArtistData);
      testEvent = await seedSpecificEvent(completeEventData);
      eventArtistRelation = await seedEventArtistRelation({
        artistId: testArtist.id,
        eventId: testEvent.id,
        boothName: 'ORIGINAL-01',
        locationDay01: '大廳-ORIGINAL01',
        day01: true,
        day02: false,
        day03: false
      });
    });

    it('should update event-artist relationship with real database update', async () => {
      const updateData = {
        artistId: testArtist.id,
        eventId: testEvent.id,
        boothName: 'UPDATED-01',
        locationDay01: '大廳-UPDATED01',
        locationDay02: '大廳-UPDATED02',
        dm: 'https://example.com/updated-dm.jpg',
        day01: true,
        day02: true,
        day03: true
      };

      const response = await client.api.event.artist.$put({
        json: updateData,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.boothName).toBe('UPDATED-01');
      expect(data.locationDay01).toBe('大廳-UPDATED01');
      expect(data.locationDay02).toBe('大廳-UPDATED02');
      expect(data.day03).toBe(true);

      // Verify the update persisted
      const verifyResponse = await client.api.event[':eventName'].artist.$get({
        param: { eventName: completeEventData.name },
        query: { page: '1' }
      });
      
      const verifyData = await verifyResponse.json();
      expect(verifyData.data[0].boothName).toBe('UPDATED-01');
      expect(verifyData.data[0].day03).toBe(true);
    });
  });

  describe('DELETE /api/event/:eventId/artist/:artistId', () => {
    let testArtist: any;
    let testEvent: any;

    beforeEach(async () => {
      testArtist = await seedSpecificArtist(completeArtistData);
      testEvent = await seedSpecificEvent(completeEventData);
      await seedEventArtistRelation({
        artistId: testArtist.id,
        eventId: testEvent.id,
        boothName: 'DELETE-01',
        locationDay01: '大廳-DELETE01',
        day01: true,
        day02: false,
        day03: false
      });
    });

    it('should delete event-artist relationship with real database removal', async () => {
      const response = await client.api.event[':eventId'].artist[':artistId'].$delete({
        param: { 
          eventId: testEvent.id.toString(),
          artistId: testArtist.id.toString()
        },
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(response.status).toBe(200);

      // Verify the relationship was removed
      const verifyResponse = await client.api.event[':eventName'].artist.$get({
        param: { eventName: completeEventData.name },
        query: { page: '1' }
      });
      
      const verifyData = await verifyResponse.json();
      expect(verifyData.data.length).toBe(0);
    });

    it('should handle deletion of non-existent relationship', async () => {
      const response = await client.api.event[':eventId'].artist[':artistId'].$delete({
        param: { 
          eventId: '99999',
          artistId: '99999'
        },
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(response.status).toBe(200);
    });
  });

  describe('Complex Event-Artist Filtering', () => {
    let multipleEvents: any[];
    let multipleArtists: any[];

    beforeEach(async () => {
      // Create multiple events
      multipleEvents = [];
      for (let i = 1; i <= 3; i++) {
        const event = await seedSpecificEvent({
          id: i + 10,
          name: `Multi Event ${i}`,
          year: 2024 + i,
          location: `Location ${i}`
        });
        multipleEvents.push(event);
      }

      // Create multiple artists with different tags
      multipleArtists = [];
      const artistsData = [
        { author: 'Tagged Artist 1', tags: '原創,測試' },
        { author: 'Tagged Artist 2', tags: '測試,Integration' },
        { author: 'Tagged Artist 3', tags: '原創,Backend' }
      ];

      for (const artistData of artistsData) {
        const artist = await seedSpecificArtist({
          ...artistData,
          introduction: 'Multi-event test artist'
        });
        multipleArtists.push(artist);
      }

      // Create relationships between artists and events
      for (let i = 0; i < multipleArtists.length; i++) {
        for (let j = 0; j < multipleEvents.length; j++) {
          await seedEventArtistRelation({
            artistId: multipleArtists[i].id,
            eventId: multipleEvents[j].id,
            boothName: `MULTI-${i}-${j}`,
            locationDay01: `大廳-${i}-${j}`,
            day01: true,
            day02: j % 2 === 0,
            day03: false
          });
        }
      }
    });

    it('should filter by event and tag combination with real data', async () => {
      const response = await client.api.event[':eventName'].artist.$get({
        param: { eventName: 'Multi Event 1' },
        query: { 
          page: '1',
          tag: '原創'
        }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.data.length).toBe(2); // Artists 1 and 3 have '原創' tag
      expect(data.data.every((artist: any) => artist.tags.includes('原創'))).toBe(true);
    });

    it('should search within specific event context', async () => {
      const response = await client.api.event[':eventName'].artist.$get({
        param: { eventName: 'Multi Event 2' },
        query: { 
          page: '1',
          search: 'Tagged Artist 2'
        }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.data.length).toBe(1);
      expect(data.data[0].author).toBe('Tagged Artist 2');
    });
  });
});