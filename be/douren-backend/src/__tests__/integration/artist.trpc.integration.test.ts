import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { 
  setupTestDatabase, 
  cleanupTestDatabase, 
  teardownTestDatabase 
} from '../../__test-utils__/setupTestDatabase';
import { mockTrpcContext } from '../../__test-utils__/testServer';
import { seedMinimalData, seedSpecificArtist } from '../../__test-utils__/seedData';
import { trpcArtistRoute } from '../../routes/artist';
import { 
  completeArtistData, 
  minimalArtistData, 
  invalidArtistData,
  paginationTestData 
} from '../../__fixtures__/integrationData';

describe('Artist tRPC Integration Tests', () => {
  let trpcContext: ReturnType<typeof mockTrpcContext>;

  beforeAll(async () => {
    await setupTestDatabase();
    trpcContext = mockTrpcContext();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
    await seedMinimalData();
  });

  describe('createArtist tRPC procedure', () => {
    it('should create artist with real database persistence', async () => {
      const result = await trpcArtistRoute.createArtist({
        input: completeArtistData,
        ctx: trpcContext
      });

      expect(result).toHaveProperty('id');
      expect(result.author).toBe(completeArtistData.author);
      expect(result.introduction).toBe(completeArtistData.introduction);
      expect(result.tags).toBe(completeArtistData.tags);
      expect(result.photo).toBe(completeArtistData.photo);
      expect(result.twitterLink).toBe(completeArtistData.twitterLink);
      expect(result.officialLink).toBe(completeArtistData.officialLink);

      // Verify persistence by querying the artist
      const fetchResult = await trpcArtistRoute.getArtist({
        input: { 
          page: '1',
          search: completeArtistData.author
        },
        ctx: trpcContext
      });

      expect(fetchResult.data.length).toBe(1);
      expect(fetchResult.data[0].id).toBe(result.id);
      expect(fetchResult.data[0].author).toBe(completeArtistData.author);
    });

    it('should create artist with minimal required data', async () => {
      const result = await trpcArtistRoute.createArtist({
        input: minimalArtistData,
        ctx: trpcContext
      });

      expect(result).toHaveProperty('id');
      expect(result.author).toBe(minimalArtistData.author);
      expect(result.introduction).toBe(minimalArtistData.introduction);
      expect(result.tags).toBeNull();
      expect(result.photo).toBeNull();
    });

    it('should throw validation error for missing required fields', async () => {
      await expect(
        trpcArtistRoute.createArtist({
          input: invalidArtistData.missingAuthor,
          ctx: trpcContext
        })
      ).rejects.toThrow();
    });

    it('should throw validation error for empty author field', async () => {
      await expect(
        trpcArtistRoute.createArtist({
          input: invalidArtistData.emptyAuthor,
          ctx: trpcContext
        })
      ).rejects.toThrow();
    });

    it('should throw validation error for invalid URLs', async () => {
      await expect(
        trpcArtistRoute.createArtist({
          input: invalidArtistData.invalidUrls,
          ctx: trpcContext
        })
      ).rejects.toThrow();
    });
  });

  describe('getArtist tRPC procedure', () => {
    beforeEach(async () => {
      // Seed multiple artists for testing
      for (const artistData of paginationTestData.artists.slice(0, 5)) {
        await seedSpecificArtist(artistData);
      }
    });

    it('should fetch all artists with real query execution', async () => {
      const result = await trpcArtistRoute.getArtist({
        input: { page: '1' },
        ctx: trpcContext
      });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('pagination');
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.pagination).toHaveProperty('currentPage');
      expect(result.pagination).toHaveProperty('totalPages');
      expect(result.pagination).toHaveProperty('totalCount');
    });

    it('should filter artists by tags with real database query', async () => {
      const result = await trpcArtistRoute.getArtist({
        input: { 
          page: '1',
          tag: '原創'
        },
        ctx: trpcContext
      });

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data.every(artist => artist.tags?.includes('原創'))).toBe(true);
    });

    it('should search artists by author name with real database query', async () => {
      const result = await trpcArtistRoute.getArtist({
        input: { 
          page: '1',
          search: 'Test Artist 1'
        },
        ctx: trpcContext
      });

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].author).toContain('Test Artist 1');
    });

    it('should sort artists in ascending order with real database query', async () => {
      const result = await trpcArtistRoute.getArtist({
        input: { 
          page: '1',
          sort: 'asc'
        },
        ctx: trpcContext
      });

      const authors = result.data.map(artist => artist.author);
      const sortedAuthors = [...authors].sort();
      expect(authors).toEqual(sortedAuthors);
    });

    it('should sort artists in descending order with real database query', async () => {
      const result = await trpcArtistRoute.getArtist({
        input: { 
          page: '1',
          sort: 'desc'
        },
        ctx: trpcContext
      });

      const authors = result.data.map(artist => artist.author);
      const sortedAuthors = [...authors].sort().reverse();
      expect(authors).toEqual(sortedAuthors);
    });

    it('should handle pagination with real database query', async () => {
      const page1Result = await trpcArtistRoute.getArtist({
        input: { page: '1' },
        ctx: trpcContext
      });
      
      const page2Result = await trpcArtistRoute.getArtist({
        input: { page: '2' },
        ctx: trpcContext
      });

      expect(page1Result.pagination.currentPage).toBe(1);
      expect(page2Result.pagination.currentPage).toBe(2);
      
      // Ensure different data on different pages
      const page1Ids = page1Result.data.map(artist => artist.id);
      const page2Ids = page2Result.data.map(artist => artist.id);
      const hasOverlap = page1Ids.some(id => page2Ids.includes(id));
      expect(hasOverlap).toBe(false);
    });

    it('should handle empty search results gracefully', async () => {
      const result = await trpcArtistRoute.getArtist({
        input: { 
          page: '1',
          search: 'NonExistentArtist'
        },
        ctx: trpcContext
      });

      expect(result.data).toEqual([]);
      expect(result.pagination.totalCount).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });

    it('should handle non-existent tags gracefully', async () => {
      const result = await trpcArtistRoute.getArtist({
        input: { 
          page: '1',
          tag: 'NonExistentTag'
        },
        ctx: trpcContext
      });

      expect(result.data).toEqual([]);
      expect(result.pagination.totalCount).toBe(0);
    });
  });

  describe('deleteArtist tRPC procedure', () => {
    let createdArtist: any;

    beforeEach(async () => {
      createdArtist = await seedSpecificArtist(completeArtistData);
    });

    it('should delete existing artist with real database deletion', async () => {
      const result = await trpcArtistRoute.deleteArtist({
        input: { id: createdArtist.id },
        ctx: trpcContext
      });

      expect(result).toHaveProperty('id');
      expect(result.id).toBe(createdArtist.id);

      // Verify deletion by trying to fetch the artist
      const fetchResult = await trpcArtistRoute.getArtist({
        input: { 
          page: '1',
          search: createdArtist.author
        },
        ctx: trpcContext
      });

      expect(fetchResult.data.length).toBe(0);
    });

    it('should handle deletion of non-existent artist', async () => {
      const result = await trpcArtistRoute.deleteArtist({
        input: { id: 99999 },
        ctx: trpcContext
      });

      // Should not throw error but return empty or null result
      expect(result).toBeDefined();
    });

    it('should throw validation error for invalid ID format', async () => {
      await expect(
        trpcArtistRoute.deleteArtist({
          input: { id: 'invalid-id' as any },
          ctx: trpcContext
        })
      ).rejects.toThrow();
    });
  });

  describe('tRPC Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      const invalidContext = {
        ...trpcContext,
        db: null
      };

      await expect(
        trpcArtistRoute.getArtist({
          input: { page: '1' },
          ctx: invalidContext as any
        })
      ).rejects.toThrow();
    });

    it('should handle malformed input gracefully', async () => {
      await expect(
        trpcArtistRoute.getArtist({
          input: { page: 'invalid-page' },
          ctx: trpcContext
        })
      ).rejects.toThrow();
    });
  });

  describe('Context Injection', () => {
    it('should properly inject database connection through context', async () => {
      const result = await trpcArtistRoute.getArtist({
        input: { page: '1' },
        ctx: trpcContext
      });

      // If context injection works, we should get a valid result
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('pagination');
    });

    it('should properly inject environment variables through context', async () => {
      // Create artist to verify auth context is working
      const result = await trpcArtistRoute.createArtist({
        input: minimalArtistData,
        ctx: trpcContext
      });

      expect(result).toHaveProperty('id');
      expect(result.author).toBe(minimalArtistData.author);
    });
  });
});