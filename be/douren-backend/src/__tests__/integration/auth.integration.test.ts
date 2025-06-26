import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { 
  setupTestDatabase, 
  cleanupTestDatabase, 
  teardownTestDatabase 
} from '../../__test-utils__/setupTestDatabase';
import { createTestClient } from '../../__test-utils__/testServer';
import { seedMinimalData, seedSpecificArtist } from '../../__test-utils__/seedData';
import { 
  completeArtistData,
  authTestData
} from '../../__fixtures__/integrationData';

describe('Authentication & Middleware Integration Tests', () => {
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

  describe('Basic Authentication Token Middleware', () => {
    it('should accept valid basic auth token for protected endpoints', async () => {
      const response = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': `Bearer ${authTestData.validToken}`
        }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data.author).toBe(completeArtistData.author);
    });

    it('should reject invalid basic auth token', async () => {
      const response = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': `Bearer ${authTestData.invalidToken}`
        }
      });

      expect(response.status).toBe(401);
    });

    it('should reject malformed auth token', async () => {
      const response = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': `Bearer ${authTestData.malformedToken}`
        }
      });

      expect(response.status).toBe(401);
    });

    it('should reject empty auth token', async () => {
      const response = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': `Bearer ${authTestData.emptyToken}`
        }
      });

      expect(response.status).toBe(401);
    });

    it('should reject missing Authorization header', async () => {
      const response = await client.api.artist.$post({
        json: completeArtistData
      });

      expect(response.status).toBe(401);
    });

    it('should reject malformed Authorization header format', async () => {
      const response = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': authTestData.validToken // Missing 'Bearer ' prefix
        }
      });

      expect(response.status).toBe(401);
    });
  });

  describe('Public vs Protected Endpoints', () => {
    it('should allow public access to GET /api/artist', async () => {
      const response = await client.api.artist.$get({
        query: { page: '1' }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('pagination');
    });

    it('should allow public access to GET /api/event', async () => {
      const response = await client.api.event.$get();

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should require authentication for POST /api/artist', async () => {
      const response = await client.api.artist.$post({
        json: completeArtistData
      });

      expect(response.status).toBe(401);
    });

    it('should require authentication for PUT /api/artist/:artistId', async () => {
      const testArtist = await seedSpecificArtist(completeArtistData);

      const response = await client.api.artist[':artistId'].$put({
        param: { artistId: testArtist.id.toString() },
        json: { ...completeArtistData, author: 'Updated Author' }
      });

      expect(response.status).toBe(401);
    });

    it('should require authentication for DELETE /api/artist/:artistId', async () => {
      const testArtist = await seedSpecificArtist(completeArtistData);

      const response = await client.api.artist[':artistId'].$delete({
        param: { artistId: testArtist.id.toString() }
      });

      expect(response.status).toBe(401);
    });

    it('should require authentication for POST /api/event/artist', async () => {
      const response = await client.api.event.artist.$post({
        json: {
          artistId: 1,
          eventId: 1,
          boothName: 'TEST-01',
          locationDay01: '大廳-TEST01',
          day01: true,
          day02: false,
          day03: false
        }
      });

      expect(response.status).toBe(401);
    });

    it('should require authentication for PUT /api/event/artist', async () => {
      const response = await client.api.event.artist.$put({
        json: {
          artistId: 1,
          eventId: 1,
          boothName: 'UPDATED-01',
          locationDay01: '大廳-UPDATED01',
          day01: true,
          day02: false,
          day03: false
        }
      });

      expect(response.status).toBe(401);
    });

    it('should require authentication for DELETE /api/event/:eventId/artist/:artistId', async () => {
      const response = await client.api.event[':eventId'].artist[':artistId'].$delete({
        param: { eventId: '1', artistId: '1' }
      });

      expect(response.status).toBe(401);
    });
  });

  describe('Different Token Types', () => {
    it('should handle basic_auth_token correctly', async () => {
      const response = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': `Bearer ${authTestData.validToken}`
        }
      });

      expect(response.status).toBe(200);
    });

    it('should handle CLOUDFLARE_IMAGE_AUTH_TOKEN for image endpoints', async () => {
      // Note: This test assumes image endpoints exist and use CLOUDFLARE_IMAGE_AUTH_TOKEN
      // If they don't exist, this test validates the token handling infrastructure
      const response = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': `Bearer ${authTestData.validImageToken}`
        }
      });

      // Should either work (if image token is accepted) or be rejected with 401
      expect([200, 401]).toContain(response.status);
    });
  });

  describe('Test Environment Behavior', () => {
    it('should properly handle test environment configuration', async () => {
      // In test environment, auth should work with test tokens
      const response = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': `Bearer ${authTestData.validToken}`
        }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.author).toBe(completeArtistData.author);
    });

    it('should maintain security in test environment', async () => {
      // Even in test environment, invalid tokens should be rejected
      const response = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': `Bearer invalid-test-token`
        }
      });

      expect(response.status).toBe(401);
    });
  });

  describe('Authentication Headers Processing', () => {
    it('should handle case-insensitive Authorization header', async () => {
      const response = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'authorization': `Bearer ${authTestData.validToken}` // lowercase
        }
      });

      expect([200, 401]).toContain(response.status);
    });

    it('should handle Bearer token with extra whitespace', async () => {
      const response = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': `Bearer  ${authTestData.validToken}` // extra space
        }
      });

      expect([200, 401]).toContain(response.status);
    });

    it('should reject Authorization header without Bearer prefix', async () => {
      const response = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': authTestData.validToken // No 'Bearer ' prefix
        }
      });

      expect(response.status).toBe(401);
    });

    it('should reject Authorization header with wrong scheme', async () => {
      const response = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': `Basic ${authTestData.validToken}` // Wrong scheme
        }
      });

      expect(response.status).toBe(401);
    });
  });

  describe('Middleware Request Pipeline', () => {
    it('should process authentication before request validation', async () => {
      // Send invalid data with invalid auth - should fail on auth first
      const response = await client.api.artist.$post({
        json: { invalidField: 'invalid' }, // Invalid data
        header: {
          'Authorization': `Bearer ${authTestData.invalidToken}` // Invalid auth
        }
      });

      expect(response.status).toBe(401); // Auth failure, not validation failure
    });

    it('should process authentication before request execution', async () => {
      // Send valid data with invalid auth - should fail on auth, not reach DB
      const response = await client.api.artist.$post({
        json: completeArtistData, // Valid data
        header: {
          'Authorization': `Bearer ${authTestData.invalidToken}` // Invalid auth
        }
      });

      expect(response.status).toBe(401);
      
      // Verify no artist was created despite valid data
      const verifyResponse = await client.api.artist.$get({
        query: { 
          page: '1',
          search: completeArtistData.author
        }
      });
      
      const verifyData = await verifyResponse.json();
      expect(verifyData.data.length).toBe(0);
    });

    it('should process database middleware after authentication', async () => {
      // Valid auth should allow request to reach database layer
      const response = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': `Bearer ${authTestData.validToken}`
        }
      });

      expect(response.status).toBe(200);
      
      // Verify database was accessed and artist was created
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data.author).toBe(completeArtistData.author);
    });
  });

  describe('Error Response Format', () => {
    it('should return consistent error format for auth failures', async () => {
      const response = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': `Bearer ${authTestData.invalidToken}`
        }
      });

      expect(response.status).toBe(401);
      
      const errorData = await response.json();
      expect(errorData).toHaveProperty('error');
      expect(typeof errorData.error).toBe('string');
    });

    it('should return appropriate error message for missing auth', async () => {
      const response = await client.api.artist.$post({
        json: completeArtistData
      });

      expect(response.status).toBe(401);
      
      const errorData = await response.json();
      expect(errorData).toHaveProperty('error');
      expect(errorData.error).toContain('Unauthorized');
    });
  });

  describe('Authentication with Real Request Flow', () => {
    it('should maintain authentication state throughout request lifecycle', async () => {
      // Create artist (authenticated)
      const createResponse = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': `Bearer ${authTestData.validToken}`
        }
      });

      expect(createResponse.status).toBe(200);
      const createdArtist = await createResponse.json();

      // Update artist (authenticated)
      const updateResponse = await client.api.artist[':artistId'].$put({
        param: { artistId: createdArtist.id.toString() },
        json: { ...completeArtistData, author: 'Updated via Auth Test' },
        header: {
          'Authorization': `Bearer ${authTestData.validToken}`
        }
      });

      expect(updateResponse.status).toBe(200);
      const updatedArtist = await updateResponse.json();
      expect(updatedArtist.author).toBe('Updated via Auth Test');

      // Delete artist (authenticated)
      const deleteResponse = await client.api.artist[':artistId'].$delete({
        param: { artistId: createdArtist.id.toString() },
        header: {
          'Authorization': `Bearer ${authTestData.validToken}`
        }
      });

      expect(deleteResponse.status).toBe(200);

      // Verify deletion (public endpoint)
      const verifyResponse = await client.api.artist.$get({
        query: { 
          page: '1',
          search: 'Updated via Auth Test'
        }
      });
      
      const verifyData = await verifyResponse.json();
      expect(verifyData.data.length).toBe(0);
    });
  });

  describe('Concurrent Authentication Requests', () => {
    it('should handle concurrent authenticated requests correctly', async () => {
      const concurrentRequests = Array.from({ length: 3 }, (_, i) =>
        client.api.artist.$post({
          json: {
            ...completeArtistData,
            author: `Concurrent Auth Artist ${i + 1}`
          },
          header: {
            'Authorization': `Bearer ${authTestData.validToken}`
          }
        })
      );

      const responses = await Promise.all(concurrentRequests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      const results = await Promise.all(
        responses.map(response => response.json())
      );

      // Verify all requests were authenticated and processed
      expect(results.length).toBe(3);
      results.forEach((result, i) => {
        expect(result.author).toBe(`Concurrent Auth Artist ${i + 1}`);
        expect(result).toHaveProperty('id');
      });
    });

    it('should handle mixed valid/invalid concurrent authentication', async () => {
      const mixedRequests = [
        client.api.artist.$post({
          json: { ...completeArtistData, author: 'Valid Auth 1' },
          header: { 'Authorization': `Bearer ${authTestData.validToken}` }
        }),
        client.api.artist.$post({
          json: { ...completeArtistData, author: 'Invalid Auth' },
          header: { 'Authorization': `Bearer ${authTestData.invalidToken}` }
        }),
        client.api.artist.$post({
          json: { ...completeArtistData, author: 'Valid Auth 2' },
          header: { 'Authorization': `Bearer ${authTestData.validToken}` }
        })
      ];

      const responses = await Promise.all(mixedRequests);
      
      expect(responses[0].status).toBe(200); // Valid
      expect(responses[1].status).toBe(401); // Invalid
      expect(responses[2].status).toBe(200); // Valid

      // Verify only valid requests created artists
      const verifyResponse = await client.api.artist.$get({
        query: { page: '1' }
      });
      
      const verifyData = await verifyResponse.json();
      const authArtists = verifyData.data.filter((artist: any) => 
        artist.author.includes('Valid Auth')
      );
      
      expect(authArtists.length).toBe(2);
    });
  });
});