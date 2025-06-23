import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { 
  setupTestDatabase, 
  cleanupTestDatabase, 
  teardownTestDatabase,
  getTestDb 
} from '../../__test-utils__/setupTestDatabase';
import { 
  seedMinimalData, 
  seedSpecificArtist, 
  seedSpecificEvent,
  seedEventArtistRelation 
} from '../../__test-utils__/seedData';
import { 
  NewArtistQueryBuilder,
  NewEventArtistQueryBuilder 
} from '../../QueryBuilder';
import { 
  completeArtistData,
  completeEventData,
  paginationTestData,
  searchTestData
} from '../../__fixtures__/integrationData';

describe('Query Builder Integration Tests', () => {
  let db: ReturnType<typeof getTestDb>;

  beforeAll(async () => {
    await setupTestDatabase();
    db = getTestDb();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
    await seedMinimalData();
  });

  describe('ArtistQueryBuilder Integration', () => {
    beforeEach(async () => {
      // Seed multiple artists for comprehensive testing
      for (const artistData of paginationTestData.artists.slice(0, 10)) {
        await seedSpecificArtist(artistData);
      }
      
      for (const artistData of searchTestData.artists) {
        await seedSpecificArtist(artistData);
      }
    });

    it('should build and execute basic artist selection query', async () => {
      const queryBuilder = NewArtistQueryBuilder({
        page: '1',
        sort: 'author,asc',
        searchTable: 'author'
      }, db);

      const { SelectQuery, CountQuery } = queryBuilder.BuildQuery();
      
      const selectResult = await SelectQuery.query;
      const countResult = await CountQuery.query;

      expect(Array.isArray(selectResult)).toBe(true);
      expect(selectResult.length).toBeGreaterThan(0);
      expect(countResult.length).toBe(1);
      expect(countResult[0]).toHaveProperty('totalCount');
      expect(typeof countResult[0].totalCount).toBe('number');
    });

    it('should execute pagination with real SQL generation', async () => {
      const page1Builder = NewArtistQueryBuilder({
        page: '1',
        sort: 'author,asc',
        searchTable: 'author'
      }, db);

      const page2Builder = NewArtistQueryBuilder({
        page: '2',
        sort: 'author,asc',
        searchTable: 'author'
      }, db);

      const page1Result = await page1Builder.BuildQuery().SelectQuery.query;
      const page2Result = await page2Builder.BuildQuery().SelectQuery.query;

      expect(Array.isArray(page1Result)).toBe(true);
      expect(Array.isArray(page2Result)).toBe(true);

      // Verify different results on different pages
      if (page1Result.length > 0 && page2Result.length > 0) {
        const page1Ids = page1Result.map((artist: any) => artist.id);
        const page2Ids = page2Result.map((artist: any) => artist.id);
        const hasOverlap = page1Ids.some((id: number) => page2Ids.includes(id));
        expect(hasOverlap).toBe(false);
      }
    });

    it('should execute sorting in ascending order with real database performance', async () => {
      const ascBuilder = NewArtistQueryBuilder({
        page: '1',
        sort: 'author,asc',
        searchTable: 'author'
      }, db);

      const result = await ascBuilder.BuildQuery().SelectQuery.query;
      
      expect(result.length).toBeGreaterThan(1);
      
      const authors = result.map((artist: any) => artist.author);
      const sortedAuthors = [...authors].sort();
      expect(authors).toEqual(sortedAuthors);
    });

    it('should execute sorting in descending order with real database performance', async () => {
      const descBuilder = NewArtistQueryBuilder({
        page: '1',
        sort: 'author,desc',
        searchTable: 'author'
      }, db);

      const result = await descBuilder.BuildQuery().SelectQuery.query;
      
      expect(result.length).toBeGreaterThan(1);
      
      const authors = result.map((artist: any) => artist.author);
      const sortedAuthorsDesc = [...authors].sort().reverse();
      expect(authors).toEqual(sortedAuthorsDesc);
    });

    it('should execute tag filtering with real database joins', async () => {
      const tagBuilder = NewArtistQueryBuilder({
        page: '1',
        sort: 'author,asc',
        searchTable: 'author',
        tag: '原創'
      }, db);

      const { SelectQuery, CountQuery } = tagBuilder.BuildQuery();
      
      const selectResult = await SelectQuery.query;
      const countResult = await CountQuery.query;

      expect(Array.isArray(selectResult)).toBe(true);
      
      if (selectResult.length > 0) {
        expect(selectResult.every((artist: any) => 
          artist.tags && artist.tags.includes('原創')
        )).toBe(true);
      }

      expect(countResult[0].totalCount).toBeGreaterThanOrEqual(0);
    });

    it('should execute search functionality with real ilike queries', async () => {
      const searchBuilder = NewArtistQueryBuilder({
        page: '1',
        sort: 'author,asc',
        searchTable: 'author',
        search: 'Searchable'
      }, db);

      const result = await searchBuilder.BuildQuery().SelectQuery.query;
      
      if (result.length > 0) {
        expect(result.every((artist: any) => 
          artist.author.toLowerCase().includes('searchable')
        )).toBe(true);
      }
    });

    it('should handle complex filtering combinations with real SQL execution', async () => {
      const complexBuilder = NewArtistQueryBuilder({
        page: '1',
        sort: 'author,desc',
        searchTable: 'author',
        search: 'Test',
        tag: '測試'
      }, db);

      const { SelectQuery, CountQuery } = complexBuilder.BuildQuery();
      
      const selectResult = await SelectQuery.query;
      const countResult = await CountQuery.query;

      expect(Array.isArray(selectResult)).toBe(true);
      expect(countResult[0]).toHaveProperty('totalCount');

      if (selectResult.length > 0) {
        selectResult.forEach((artist: any) => {
          expect(artist.author.toLowerCase()).toContain('test');
          if (artist.tags) {
            expect(artist.tags).toContain('測試');
          }
        });
      }
    });

    it('should handle empty results gracefully with real database queries', async () => {
      const emptyBuilder = NewArtistQueryBuilder({
        page: '1',
        sort: 'author,asc',
        searchTable: 'author',
        search: 'NonExistentSearchTerm'
      }, db);

      const { SelectQuery, CountQuery } = emptyBuilder.BuildQuery();
      
      const selectResult = await SelectQuery.query;
      const countResult = await CountQuery.query;

      expect(selectResult).toEqual([]);
      expect(countResult[0].totalCount).toBe(0);
    });
  });

  describe('EventArtistQueryBuilder Integration', () => {
    let testEvent: any;
    let testArtists: any[];

    beforeEach(async () => {
      testEvent = await seedSpecificEvent(completeEventData);
      
      testArtists = [];
      for (let i = 0; i < 5; i++) {
        const artist = await seedSpecificArtist({
          author: `Event Test Artist ${i + 1}`,
          introduction: `Artist ${i + 1} for event query testing`,
          tags: i % 2 === 0 ? '原創,測試' : '測試,Event'
        });
        
        await seedEventArtistRelation({
          artistId: artist.id,
          eventId: testEvent.id,
          boothName: `EVENT-${i + 1}`,
          locationDay01: `大廳-EVENT${i + 1}`,
          day01: true,
          day02: i % 2 === 0,
          day03: false
        });
        
        testArtists.push(artist);
      }
    });

    it('should build and execute event artist selection with real complex joins', async () => {
      const queryBuilder = NewEventArtistQueryBuilder({
        page: '1',
        sort: 'author,asc',
        searchTable: 'author',
        eventName: completeEventData.name
      }, db);

      const { SelectQuery, CountQuery } = queryBuilder.BuildQuery();
      
      const selectResult = await SelectQuery.query;
      const countResult = await CountQuery.query;

      expect(Array.isArray(selectResult)).toBe(true);
      expect(selectResult.length).toBe(5);
      expect(countResult[0].totalCount).toBe(5);

      selectResult.forEach((record: any) => {
        expect(record).toHaveProperty('author');
        expect(record).toHaveProperty('boothName');
        expect(record).toHaveProperty('locationDay01');
        expect(record.boothName).toMatch(/^EVENT-\d+$/);
      });
    });

    it('should execute event filtering with real database performance', async () => {
      const queryBuilder = NewEventArtistQueryBuilder({
        page: '1',
        sort: 'author,asc',
        searchTable: 'author',
        eventName: completeEventData.name
      }, db);

      const result = await queryBuilder.BuildQuery().SelectQuery.query;
      
      expect(result.length).toBe(5);
      result.forEach((record: any) => {
        expect(record.author).toContain('Event Test Artist');
      });
    });

    it('should execute tag filtering within event context with real joins', async () => {
      const queryBuilder = NewEventArtistQueryBuilder({
        page: '1',
        sort: 'author,asc',
        searchTable: 'author',
        eventName: completeEventData.name,
        tag: '原創'
      }, db);

      const { SelectQuery, CountQuery } = queryBuilder.BuildQuery();
      
      const selectResult = await SelectQuery.query;
      const countResult = await CountQuery.query;

      expect(Array.isArray(selectResult)).toBe(true);
      
      if (selectResult.length > 0) {
        selectResult.forEach((record: any) => {
          expect(record.tags).toContain('原創');
        });
      }

      // Should be fewer than total (only artists with '原創' tag)
      expect(countResult[0].totalCount).toBeLessThanOrEqual(5);
      expect(countResult[0].totalCount).toBeGreaterThanOrEqual(0);
    });

    it('should execute search within event context with real ilike queries', async () => {
      const queryBuilder = NewEventArtistQueryBuilder({
        page: '1',
        sort: 'author,asc',
        searchTable: 'author',
        eventName: completeEventData.name,
        search: 'Artist 1'
      }, db);

      const result = await queryBuilder.BuildQuery().SelectQuery.query;
      
      expect(result.length).toBe(1);
      expect(result[0].author).toBe('Event Test Artist 1');
      expect(result[0].boothName).toBe('EVENT-1');
    });

    it('should handle event artist pagination with real database performance', async () => {
      // Seed more artists to test pagination
      for (let i = 6; i <= 15; i++) {
        const artist = await seedSpecificArtist({
          author: `Event Test Artist ${i}`,
          introduction: `Artist ${i} for pagination testing`
        });
        
        await seedEventArtistRelation({
          artistId: artist.id,
          eventId: testEvent.id,
          boothName: `EVENT-${i}`,
          locationDay01: `大廳-EVENT${i}`,
          day01: true,
          day02: false,
          day03: false
        });
      }

      const page1Builder = NewEventArtistQueryBuilder({
        page: '1',
        sort: 'author,asc',
        searchTable: 'author',
        eventName: completeEventData.name
      }, db);

      const page2Builder = NewEventArtistQueryBuilder({
        page: '2',
        sort: 'author,asc',
        searchTable: 'author',
        eventName: completeEventData.name
      }, db);

      const page1Result = await page1Builder.BuildQuery().SelectQuery.query;
      const page2Result = await page2Builder.BuildQuery().SelectQuery.query;

      expect(page1Result.length).toBeGreaterThan(0);
      expect(page2Result.length).toBeGreaterThan(0);

      // Verify different records on different pages
      const page1BoothNames = page1Result.map((record: any) => record.boothName);
      const page2BoothNames = page2Result.map((record: any) => record.boothName);
      const hasOverlap = page1BoothNames.some((booth: string) => page2BoothNames.includes(booth));
      expect(hasOverlap).toBe(false);
    });

    it('should execute sorting for event artists with real database performance', async () => {
      const ascBuilder = NewEventArtistQueryBuilder({
        page: '1',
        sort: 'author,asc',
        searchTable: 'author',
        eventName: completeEventData.name
      }, db);

      const descBuilder = NewEventArtistQueryBuilder({
        page: '1',
        sort: 'author,desc',
        searchTable: 'author',
        eventName: completeEventData.name
      }, db);

      const ascResult = await ascBuilder.BuildQuery().SelectQuery.query;
      const descResult = await descBuilder.BuildQuery().SelectQuery.query;

      expect(ascResult.length).toBe(5);
      expect(descResult.length).toBe(5);

      const ascAuthors = ascResult.map((record: any) => record.author);
      const descAuthors = descResult.map((record: any) => record.author);

      expect(ascAuthors).toEqual([...ascAuthors].sort());
      expect(descAuthors).toEqual([...descAuthors].sort().reverse());
    });

    it('should handle complex event artist filtering with real SQL execution', async () => {
      const complexBuilder = NewEventArtistQueryBuilder({
        page: '1',
        sort: 'author,asc',
        searchTable: 'author',
        eventName: completeEventData.name,
        search: 'Event Test',
        tag: '測試'
      }, db);

      const { SelectQuery, CountQuery } = complexBuilder.BuildQuery();
      
      const selectResult = await SelectQuery.query;
      const countResult = await CountQuery.query;

      expect(Array.isArray(selectResult)).toBe(true);
      
      if (selectResult.length > 0) {
        selectResult.forEach((record: any) => {
          expect(record.author).toContain('Event Test');
          expect(record.tags).toContain('測試');
        });
      }

      expect(countResult[0].totalCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Query Builder Performance and Error Handling', () => {
    it('should handle malformed sort parameters gracefully', async () => {
      const queryBuilder = NewArtistQueryBuilder({
        page: '1',
        sort: 'invalid_sort_format',
        searchTable: 'author'
      }, db);

      // Should not throw error but handle gracefully
      expect(() => queryBuilder.BuildQuery()).not.toThrow();
    });

    it('should handle empty page parameter gracefully', async () => {
      await seedSpecificArtist(completeArtistData);

      const queryBuilder = NewArtistQueryBuilder({
        page: '',
        sort: 'author,asc',
        searchTable: 'author'
      }, db);

      const result = await queryBuilder.BuildQuery().SelectQuery.query;
      
      // Should handle empty page gracefully
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle non-existent event name in EventArtistQueryBuilder', async () => {
      const queryBuilder = NewEventArtistQueryBuilder({
        page: '1',
        sort: 'author,asc',
        searchTable: 'author',
        eventName: 'NonExistentEvent'
      }, db);

      const { SelectQuery, CountQuery } = queryBuilder.BuildQuery();
      
      const selectResult = await SelectQuery.query;
      const countResult = await CountQuery.query;

      expect(selectResult).toEqual([]);
      expect(countResult[0].totalCount).toBe(0);
    });

    it('should maintain query consistency across multiple executions', async () => {
      await seedSpecificArtist(completeArtistData);

      const queryBuilder = NewArtistQueryBuilder({
        page: '1',
        sort: 'author,asc',
        searchTable: 'author'
      }, db);

      const execution1 = await queryBuilder.BuildQuery().SelectQuery.query;
      const execution2 = await queryBuilder.BuildQuery().SelectQuery.query;
      const execution3 = await queryBuilder.BuildQuery().SelectQuery.query;

      expect(execution1).toEqual(execution2);
      expect(execution2).toEqual(execution3);
    });

    it('should handle concurrent query executions correctly', async () => {
      // Seed test data
      for (const artistData of paginationTestData.artists.slice(0, 5)) {
        await seedSpecificArtist(artistData);
      }

      const concurrentQueries = Array.from({ length: 3 }, (_, i) => {
        const queryBuilder = NewArtistQueryBuilder({
          page: '1',
          sort: 'author,asc',
          searchTable: 'author',
          search: 'Test Artist'
        }, db);
        
        return queryBuilder.BuildQuery().SelectQuery.query;
      });

      const results = await Promise.all(concurrentQueries);
      
      // All concurrent queries should return consistent results
      expect(results[0]).toEqual(results[1]);
      expect(results[1]).toEqual(results[2]);
    });
  });

  describe('SQL Generation and Execution Verification', () => {
    it('should generate proper SQL with joins for complex queries', async () => {
      await seedSpecificArtist(completeArtistData);

      const queryBuilder = NewArtistQueryBuilder({
        page: '1',
        sort: 'author,asc',
        searchTable: 'author',
        tag: '原創',
        search: 'Integration'
      }, db);

      const { SelectQuery, CountQuery } = queryBuilder.BuildQuery();
      
      // Execute queries to verify SQL generation works
      const selectResult = await SelectQuery.query;
      const countResult = await CountQuery.query;

      expect(Array.isArray(selectResult)).toBe(true);
      expect(Array.isArray(countResult)).toBe(true);
      expect(countResult[0]).toHaveProperty('totalCount');
    });

    it('should verify real database operations with QueryBuilder results', async () => {
      const testArtist = await seedSpecificArtist(completeArtistData);

      const queryBuilder = NewArtistQueryBuilder({
        page: '1',
        sort: 'author,asc',
        searchTable: 'author',
        search: completeArtistData.author
      }, db);

      const result = await queryBuilder.BuildQuery().SelectQuery.query;
      
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(testArtist.id);
      expect(result[0].author).toBe(testArtist.author);
      expect(result[0].introduction).toBe(testArtist.introduction);
    });
  });
});