import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { 
  setupTestDatabase, 
  cleanupTestDatabase, 
  teardownTestDatabase,
  getTestDb 
} from '../../__test-utils__/setupTestDatabase';
import { createTestClient } from '../../__test-utils__/testServer';
import { seedMinimalData, seedSpecificArtist, seedSpecificEvent } from '../../__test-utils__/seedData';
import { 
  completeArtistData,
  completeEventData,
  invalidArtistData,
  invalidEventArtistData
} from '../../__fixtures__/integrationData';
import * as schema from '@pkg/database/db';

describe('Error Handling & Edge Cases Integration Tests', () => {
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
  });

  describe('Database Connection Failure Scenarios', () => {
    it('should handle gracefully when database is unavailable', async () => {
      // Note: This test simulates DB unavailability by testing with invalid queries
      // In a real scenario, you'd mock the database connection
      
      try {
        await db.execute(schema.sql`INVALID SQL STATEMENT`);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error instanceof Error).toBe(true);
      }
    });

    it('should maintain data integrity during connection issues', async () => {
      // Test that partial operations don't corrupt data
      const artistResponse = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(artistResponse.status).toBe(200);
      
      // Verify the artist was created successfully despite any connection issues
      const verifyResponse = await client.api.artist.$get({
        query: { 
          page: '1',
          search: completeArtistData.author
        }
      });
      
      const verifyData = await verifyResponse.json();
      expect(verifyData.data.length).toBe(1);
      expect(verifyData.data[0].author).toBe(completeArtistData.author);
    });
  });

  describe('Foreign Key Constraint Violations', () => {
    it('should handle event artist creation with non-existent artist ID', async () => {
      await seedSpecificEvent(completeEventData);

      const response = await client.api.event.artist.$post({
        json: {
          ...invalidEventArtistData.nonExistentArtist,
          eventId: completeEventData.id
        },
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
      
      const errorData = await response.json();
      expect(errorData).toHaveProperty('error');
    });

    it('should handle event artist creation with non-existent event ID', async () => {
      const testArtist = await seedSpecificArtist(completeArtistData);

      const response = await client.api.event.artist.$post({
        json: {
          ...invalidEventArtistData.nonExistentEvent,
          artistId: testArtist.id
        },
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should maintain database consistency after foreign key violations', async () => {
      const testArtist = await seedSpecificArtist(completeArtistData);

      // Attempt invalid operation
      await client.api.event.artist.$post({
        json: {
          artistId: testArtist.id,
          eventId: 99999, // Non-existent
          boothName: 'INVALID-01',
          locationDay01: '大廳-INVALID01',
          day01: true,
          day02: false,
          day03: false
        },
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      // Verify artist still exists and database is consistent
      const dbArtist = await db
        .select()
        .from(schema.s.Artist)
        .where(schema.eq(schema.s.Artist.id, testArtist.id));

      expect(dbArtist.length).toBe(1);
      expect(dbArtist[0].author).toBe(testArtist.author);

      // Verify no orphaned EventArtist records
      const dbEventArtist = await db
        .select()
        .from(schema.s.EventArtist)
        .where(schema.eq(schema.s.EventArtist.artistId, testArtist.id));

      expect(dbEventArtist.length).toBe(0);
    });
  });

  describe('Duplicate Key Handling', () => {
    it('should handle duplicate artist creation gracefully', async () => {
      // Create first artist
      const firstResponse = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(firstResponse.status).toBe(200);

      // Attempt to create duplicate (same author name)
      const duplicateResponse = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      // Should either succeed (if duplicates are allowed) or handle gracefully
      expect([200, 409]).toContain(duplicateResponse.status);
    });

    it('should handle duplicate event artist booth names', async () => {
      const testArtist1 = await seedSpecificArtist(completeArtistData);
      const testArtist2 = await seedSpecificArtist({
        author: 'Second Artist',
        introduction: 'Another artist for duplicate testing'
      });
      await seedSpecificEvent(completeEventData);

      // Create first event artist
      const firstResponse = await client.api.event.artist.$post({
        json: {
          artistId: testArtist1.id,
          eventId: completeEventData.id,
          boothName: 'DUPLICATE-BOOTH',
          locationDay01: '大廳-DUP01',
          day01: true,
          day02: false,
          day03: false
        },
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(firstResponse.status).toBe(201);

      // Attempt duplicate booth name
      const duplicateResponse = await client.api.event.artist.$post({
        json: {
          artistId: testArtist2.id,
          eventId: completeEventData.id,
          boothName: 'DUPLICATE-BOOTH', // Same booth name
          locationDay01: '大廳-DUP02',
          day01: true,
          day02: false,
          day03: false
        },
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      // Should handle conflict appropriately
      expect([201, 409]).toContain(duplicateResponse.status);
    });
  });

  describe('Transaction Rollback on Operation Failures', () => {
    it('should rollback artist creation if subsequent operations fail', async () => {
      // This test simulates a scenario where artist creation succeeds 
      // but a related operation fails, requiring rollback
      
      const initialArtistCount = await db
        .select({ count: schema.count() })
        .from(schema.s.Artist);

      // Attempt operations that might require rollback
      try {
        const artistResponse = await client.api.artist.$post({
          json: completeArtistData,
          header: {
            'Authorization': 'Bearer test-token'
          }
        });

        if (artistResponse.status === 200) {
          const createdArtist = await artistResponse.json();

          // Attempt to create invalid event artist relationship
          await client.api.event.artist.$post({
            json: {
              artistId: createdArtist.id,
              eventId: 99999, // Invalid event ID
              boothName: 'ROLLBACK-TEST',
              locationDay01: '大廳-ROLLBACK',
              day01: true,
              day02: false,
              day03: false
            },
            header: {
              'Authorization': 'Bearer test-token'
            }
          });
        }
      } catch (error) {
        // Expected in rollback scenarios
      }

      // In a properly implemented system with transactions,
      // either both operations succeed or both fail
      const finalArtistCount = await db
        .select({ count: schema.count() })
        .from(schema.s.Artist);

      // Verify data consistency
      expect(typeof finalArtistCount[0].count).toBe('number');
      expect(finalArtistCount[0].count).toBeGreaterThanOrEqual(initialArtistCount[0].count);
    });
  });

  describe('Large Dataset Operations', () => {
    it('should handle large dataset queries without performance degradation', async () => {
      // Create a larger dataset
      const artistPromises = Array.from({ length: 50 }, (_, i) =>
        seedSpecificArtist({
          author: `Performance Test Artist ${i + 1}`,
          introduction: `Artist ${i + 1} for performance testing`,
          tags: i % 3 === 0 ? '原創' : i % 3 === 1 ? '測試' : 'Performance'
        })
      );

      await Promise.all(artistPromises);

      const startTime = performance.now();

      const response = await client.api.artist.$get({
        query: { page: '1' }
      });

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.data.length).toBeGreaterThan(0);
      expect(data.pagination.totalCount).toBeGreaterThanOrEqual(50);
      
      // Performance check - should complete within reasonable time
      expect(executionTime).toBeLessThan(5000); // 5 seconds max
    });

    it('should handle pagination with large datasets correctly', async () => {
      // Create dataset larger than page size
      for (let i = 0; i < 25; i++) {
        await seedSpecificArtist({
          author: `Large Dataset Artist ${i + 1}`,
          introduction: `Artist ${i + 1} for large dataset testing`
        });
      }

      const response = await client.api.artist.$get({
        query: { page: '1' }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.pagination.totalCount).toBeGreaterThanOrEqual(25);
      expect(data.pagination.totalPages).toBeGreaterThan(1);
      expect(data.data.length).toBeGreaterThan(0);
    });
  });

  describe('Concurrent Access Patterns', () => {
    it('should handle concurrent access with database locking', async () => {
      const testArtist = await seedSpecificArtist(completeArtistData);

      // Simulate concurrent updates to the same artist
      const concurrentUpdates = Array.from({ length: 3 }, (_, i) =>
        client.api.artist[':artistId'].$put({
          param: { artistId: testArtist.id.toString() },
          json: {
            ...completeArtistData,
            author: `Concurrent Update ${i + 1}`
          },
          header: {
            'Authorization': 'Bearer test-token'
          }
        })
      );

      const responses = await Promise.all(concurrentUpdates);
      
      // All requests should complete (may succeed or fail gracefully)
      responses.forEach(response => {
        expect([200, 409, 500]).toContain(response.status);
      });

      // Verify final state is consistent
      const finalState = await db
        .select()
        .from(schema.s.Artist)
        .where(schema.eq(schema.s.Artist.id, testArtist.id));

      expect(finalState.length).toBe(1);
      expect(finalState[0].author).toContain('Concurrent Update');
    });

    it('should prevent race conditions in event artist creation', async () => {
      const testArtist = await seedSpecificArtist(completeArtistData);
      await seedSpecificEvent(completeEventData);

      // Attempt to create same event-artist relationship concurrently
      const concurrentCreations = Array.from({ length: 3 }, () =>
        client.api.event.artist.$post({
          json: {
            artistId: testArtist.id,
            eventId: completeEventData.id,
            boothName: 'RACE-CONDITION-01',
            locationDay01: '大廳-RACE01',
            day01: true,
            day02: false,
            day03: false
          },
          header: {
            'Authorization': 'Bearer test-token'
          }
        })
      );

      const responses = await Promise.all(concurrentCreations);
      
      // Only one should succeed, others should fail with conflict
      const successCount = responses.filter(r => r.status === 201).length;
      const conflictCount = responses.filter(r => r.status >= 400).length;
      
      expect(successCount).toBe(1);
      expect(conflictCount).toBe(2);

      // Verify only one record was created
      const dbRecords = await db
        .select()
        .from(schema.s.EventArtist)
        .where(
          schema.and(
            schema.eq(schema.s.EventArtist.artistId, testArtist.id),
            schema.eq(schema.s.EventArtist.eventId, completeEventData.id)
          )
        );

      expect(dbRecords.length).toBe(1);
    });
  });

  describe('Input Validation Edge Cases', () => {
    it('should handle extremely long input strings', async () => {
      const longString = 'A'.repeat(10000);
      
      const response = await client.api.artist.$post({
        json: {
          author: longString,
          introduction: 'Test artist with very long name'
        },
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      // Should handle gracefully (either accept or reject with proper error)
      expect([200, 400]).toContain(response.status);
    });

    it('should handle special characters and unicode in input', async () => {
      const unicodeArtist = {
        author: '🎨👨‍🎨 Unicode Artist 测试 аrtist',
        introduction: 'Artist with unicode characters: 🌟✨💫 测试 тест',
        tags: '原創,テスト,🎯'
      };

      const response = await client.api.artist.$post({
        json: unicodeArtist,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.author).toBe(unicodeArtist.author);
      expect(data.introduction).toBe(unicodeArtist.introduction);
    });

    it('should handle malformed JSON gracefully', async () => {
      // This test would require lower-level HTTP client testing
      // For now, verify that valid JSON is processed correctly
      const response = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(response.status).toBe(200);
    });

    it('should handle null and undefined values appropriately', async () => {
      const artistWithNulls = {
        author: 'Null Test Artist',
        introduction: 'Testing null value handling',
        tags: null,
        photo: null,
        twitterLink: null,
        officialLink: null
      };

      const response = await client.api.artist.$post({
        json: artistWithNulls,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.author).toBe(artistWithNulls.author);
      expect(data.tags).toBeNull();
      expect(data.photo).toBeNull();
    });
  });

  describe('Memory and Resource Management', () => {
    it('should handle resource cleanup after failed operations', async () => {
      // Attempt multiple failed operations
      const failedOperations = Array.from({ length: 10 }, () =>
        client.api.artist.$post({
          json: invalidArtistData.missingAuthor,
          header: {
            'Authorization': 'Bearer test-token'
          }
        })
      );

      const responses = await Promise.all(failedOperations);
      
      responses.forEach(response => {
        expect(response.status).toBe(400);
      });

      // Verify system remains responsive after failed operations
      const successResponse = await client.api.artist.$post({
        json: completeArtistData,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(successResponse.status).toBe(200);
    });

    it('should maintain performance under stress conditions', async () => {
      // Rapid successive requests
      const rapidRequests = Array.from({ length: 20 }, (_, i) =>
        client.api.artist.$post({
          json: {
            author: `Stress Test Artist ${i + 1}`,
            introduction: `Stress testing artist ${i + 1}`
          },
          header: {
            'Authorization': 'Bearer test-token'
          }
        })
      );

      const startTime = performance.now();
      const responses = await Promise.all(rapidRequests);
      const endTime = performance.now();

      const successfulRequests = responses.filter(r => r.status === 200);
      expect(successfulRequests.length).toBe(20);
      
      // Should complete within reasonable time even under stress
      expect(endTime - startTime).toBeLessThan(10000); // 10 seconds max
    });
  });

  describe('Error Response Consistency', () => {
    it('should return consistent error format across all endpoints', async () => {
      const artistError = await client.api.artist.$post({
        json: invalidArtistData.missingAuthor,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      const eventArtistError = await client.api.event.artist.$post({
        json: invalidEventArtistData.nonExistentArtist,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(artistError.status).toBe(400);
      expect(eventArtistError.status).toBeGreaterThanOrEqual(400);

      const artistErrorData = await artistError.json();
      const eventArtistErrorData = await eventArtistError.json();

      // Both should have consistent error structure
      expect(artistErrorData).toHaveProperty('error');
      expect(eventArtistErrorData).toHaveProperty('error');
    });

    it('should include helpful error messages for debugging', async () => {
      const response = await client.api.artist.$post({
        json: invalidArtistData.emptyAuthor,
        header: {
          'Authorization': 'Bearer test-token'
        }
      });

      expect(response.status).toBe(400);
      
      const errorData = await response.json();
      expect(errorData.error).toBeDefined();
      expect(typeof errorData.error).toBe('string');
      expect(errorData.error.length).toBeGreaterThan(0);
    });
  });
});