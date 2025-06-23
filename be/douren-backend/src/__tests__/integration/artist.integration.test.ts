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
  minimalArtistData, 
  invalidArtistData,
  paginationTestData 
} from '../../__fixtures__/integrationData';

describe('Artist REST API Integration Tests', () => {
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

  describe('POST /api/artist', () => {
    it('should create artist with complete data and verify database insertion', async () => {
      const response = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data.author).toBe(completeArtistData.author);
      expect(data.introduction).toBe(completeArtistData.introduction);
      expect(data.tags).toBe(completeArtistData.tags);
      expect(data.photo).toBe(completeArtistData.photo);
      expect(data.twitterLink).toBe(completeArtistData.twitterLink);
      expect(data.officialLink).toBe(completeArtistData.officialLink);
    });

    it('should create artist with minimal required data', async () => {
      const response = await client.api.artist.$post({
        json: minimalArtistData,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data.author).toBe(minimalArtistData.author);
      expect(data.introduction).toBe(minimalArtistData.introduction);
      expect(data.tags).toBeNull();
      expect(data.photo).toBeNull();
    });

    it('should return validation error for missing required fields', async () => {
      const response = await client.api.artist.$post({
        json: invalidArtistData.missingAuthor,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(response.status).toBe(400);
      
      const error = await response.json();
      expect(error).toHaveProperty('error');
    });

    it('should return validation error for empty author field', async () => {
      const response = await client.api.artist.$post({
        json: invalidArtistData.emptyAuthor,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(response.status).toBe(400);
    });

    it('should return validation error for invalid URLs', async () => {
      const response = await client.api.artist.$post({
        json: invalidArtistData.invalidUrls,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(response.status).toBe(400);
    });

    it('should require authentication for artist creation', async () => {
      const response = await client.api.artist.$post({
        json: completeArtistData
      });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/artist', () => {
    beforeEach(async () => {
      // Seed multiple artists for testing
      for (const artistData of paginationTestData.artists.slice(0, 5)) {
        await seedSpecificArtist(artistData);
      }
    });

    it('should fetch all artists with pagination', async () => {
      const response = await client.api.artist.$get({
        query: {
          page: '1'
        }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('pagination');
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
      expect(data.pagination).toHaveProperty('currentPage');
      expect(data.pagination).toHaveProperty('totalPages');
      expect(data.pagination).toHaveProperty('totalCount');
    });

    it('should filter artists by tags', async () => {
      const response = await client.api.artist.$get({
        query: {
          tag: '原創',
          page: '1'
        }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.data.every((artist: any) => artist.tags?.includes('原創'))).toBe(true);
    });

    it('should search artists by author name', async () => {
      const response = await client.api.artist.$get({
        query: {
          search: 'Test Artist 1',
          page: '1'
        }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.data.length).toBeGreaterThan(0);
      expect(data.data[0].author).toContain('Test Artist 1');
    });

    it('should sort artists in ascending order', async () => {
      const response = await client.api.artist.$get({
        query: {
          sort: 'asc',
          page: '1'
        }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      const authors = data.data.map((artist: any) => artist.author);
      const sortedAuthors = [...authors].sort();
      expect(authors).toEqual(sortedAuthors);
    });

    it('should sort artists in descending order', async () => {
      const response = await client.api.artist.$get({
        query: {
          sort: 'desc',
          page: '1'
        }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      const authors = data.data.map((artist: any) => artist.author);
      const sortedAuthors = [...authors].sort().reverse();
      expect(authors).toEqual(sortedAuthors);
    });

    it('should handle pagination correctly', async () => {
      const page1Response = await client.api.artist.$get({
        query: {
          page: '1'
        }
      });
      
      const page2Response = await client.api.artist.$get({
        query: {
          page: '2'
        }
      });

      expect(page1Response.status).toBe(200);
      expect(page2Response.status).toBe(200);
      
      const page1Data = await page1Response.json();
      const page2Data = await page2Response.json();
      
      expect(page1Data.pagination.currentPage).toBe(1);
      expect(page2Data.pagination.currentPage).toBe(2);
      
      // Ensure different data on different pages
      const page1Ids = page1Data.data.map((artist: any) => artist.id);
      const page2Ids = page2Data.data.map((artist: any) => artist.id);
      const hasOverlap = page1Ids.some((id: number) => page2Ids.includes(id));
      expect(hasOverlap).toBe(false);
    });
  });

  describe('PUT /api/artist/:artistId', () => {
    let createdArtist: any;

    beforeEach(async () => {
      createdArtist = await seedSpecificArtist(minimalArtistData);
    });

    it('should update existing artist with complete data', async () => {
      const updateData = {
        ...completeArtistData,
        author: 'Updated Artist Name'
      };

      const response = await client.api.artist[':artistId'].$put({
        param: { artistId: createdArtist.id.toString() },
        json: updateData,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.id).toBe(createdArtist.id);
      expect(data.author).toBe('Updated Artist Name');
      expect(data.photo).toBe(completeArtistData.photo);
    });

    it('should require authentication for artist update', async () => {
      const response = await client.api.artist[':artistId'].$put({
        param: { artistId: createdArtist.id.toString() },
        json: completeArtistData
      });

      expect(response.status).toBe(401);
    });

    it('should return error for non-existent artist', async () => {
      const response = await client.api.artist[':artistId'].$put({
        param: { artistId: '99999' },
        json: completeArtistData,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/artist/:artistId', () => {
    let createdArtist: any;

    beforeEach(async () => {
      createdArtist = await seedSpecificArtist(completeArtistData);
    });

    it('should delete existing artist', async () => {
      const response = await client.api.artist[':artistId'].$delete({
        param: { artistId: createdArtist.id.toString() },
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(response.status).toBe(200);
      
      // Verify artist is deleted by trying to fetch it
      const fetchResponse = await client.api.artist.$get({
        query: {
          search: createdArtist.author,
          page: '1'
        }
      });
      
      const fetchData = await fetchResponse.json();
      expect(fetchData.data.length).toBe(0);
    });

    it('should require authentication for artist deletion', async () => {
      const response = await client.api.artist[':artistId'].$delete({
        param: { artistId: createdArtist.id.toString() }
      });

      expect(response.status).toBe(401);
    });

    it('should return success even for non-existent artist', async () => {
      const response = await client.api.artist[':artistId'].$delete({
        param: { artistId: '99999' },
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(response.status).toBe(200);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent artist creation', async () => {
      const concurrentCreations = Array.from({ length: 5 }, (_, i) => 
        client.api.artist.$post({
          json: {
            ...minimalArtistData,
            author: `Concurrent Artist ${i + 1}`
          },
          header: {
            'Authorization': 'Bearer test-token'
          }
        })
      );

      const responses = await Promise.all(concurrentCreations);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      const results = await Promise.all(
        responses.map(response => response.json())
      );

      // Verify all artists have unique IDs
      const ids = results.map(result => result.id);
      const uniqueIds = [...new Set(ids)];
      expect(uniqueIds.length).toBe(ids.length);
    });
  });
});