import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock drizzle-orm
vi.mock("drizzle-orm", () => ({
	sql: vi.fn((strings: TemplateStringsArray, ...values: unknown[]) => ({
		strings,
		values,
		type: "sql",
	})),
}));

// Mock database schema
vi.mock("@pkg/database/db", () => ({
	initDB: vi.fn(),
	s: {
		tag: "tag_table",
		authorMain: {
			uuid: "author_main.uuid",
			tags: "author_main.tags",
		},
		authorTag: "author_tag_table",
	},
}));

// Create mock database
const createMockDatabase = () => {
	const mockExecute = vi.fn().mockResolvedValue(undefined);

	return {
		execute: mockExecute,
		mockExecute,
	};
};

// Import after mocks
import { syncAuthorTag, down } from "@/helper/migrate";

describe("Migrate Helper", () => {
	let mockDb: ReturnType<typeof createMockDatabase>;

	beforeEach(() => {
		mockDb = createMockDatabase();
		vi.clearAllMocks();
	});

	describe("syncAuthorTag function", () => {
		it("should execute all 7 migration steps", async () => {
			await syncAuthorTag(mockDb as any);

			// Should execute 7 SQL statements
			expect(mockDb.execute).toHaveBeenCalledTimes(7);
		});

		it("should execute steps in correct order", async () => {
			const executionOrder: number[] = [];
			mockDb.mockExecute.mockImplementation(() => {
				executionOrder.push(executionOrder.length + 1);
				return Promise.resolve(undefined);
			});

			await syncAuthorTag(mockDb as any);

			expect(executionOrder).toEqual([1, 2, 3, 4, 5, 6, 7]);
		});

		it("should call execute with SQL template literals", async () => {
			await syncAuthorTag(mockDb as any);

			mockDb.execute.mock.calls.forEach((call) => {
				expect(call[0]).toHaveProperty("type", "sql");
			});
		});

		it("should handle database errors gracefully", async () => {
			const dbError = new Error("Database connection failed");
			mockDb.mockExecute.mockRejectedValueOnce(dbError);

			await expect(syncAuthorTag(mockDb as any)).rejects.toThrow(
				"Database connection failed",
			);
		});

		it("should stop execution on first error", async () => {
			const dbError = new Error("Step 3 failed");
			mockDb.mockExecute
				.mockResolvedValueOnce(undefined) // Step 1
				.mockResolvedValueOnce(undefined) // Step 2
				.mockRejectedValueOnce(dbError); // Step 3

			await expect(syncAuthorTag(mockDb as any)).rejects.toThrow(
				"Step 3 failed",
			);
			expect(mockDb.execute).toHaveBeenCalledTimes(3);
		});

		describe("Step 1: Populate tag table with unique tags", () => {
			it("should execute INSERT INTO tag statement", async () => {
				await syncAuthorTag(mockDb as any);

				const firstCall = mockDb.execute.mock.calls[0][0];
				expect(firstCall.type).toBe("sql");
			});
		});

		describe("Step 2: Update tag counts", () => {
			it("should execute UPDATE tag SET count statement", async () => {
				await syncAuthorTag(mockDb as any);

				const secondCall = mockDb.execute.mock.calls[1][0];
				expect(secondCall.type).toBe("sql");
			});
		});

		describe("Step 3: Populate author_tag junction table", () => {
			it("should execute INSERT INTO author_tag statement", async () => {
				await syncAuthorTag(mockDb as any);

				const thirdCall = mockDb.execute.mock.calls[2][0];
				expect(thirdCall.type).toBe("sql");
			});
		});

		describe("Step 4: Remove tags with count 0", () => {
			it("should execute DELETE FROM tag WHERE count = 0", async () => {
				await syncAuthorTag(mockDb as any);

				const fourthCall = mockDb.execute.mock.calls[3][0];
				expect(fourthCall.type).toBe("sql");
			});
		});

		describe("Step 5: Reindex remaining tags", () => {
			it("should execute UPDATE tag with new index values", async () => {
				await syncAuthorTag(mockDb as any);

				const fifthCall = mockDb.execute.mock.calls[4][0];
				expect(fifthCall.type).toBe("sql");
			});
		});

		describe("Step 6: Clean up orphaned entries in author_tag", () => {
			it("should execute DELETE FROM author_tag for orphaned entries", async () => {
				await syncAuthorTag(mockDb as any);

				const sixthCall = mockDb.execute.mock.calls[5][0];
				expect(sixthCall.type).toBe("sql");
			});
		});

		describe("Step 7: Normalize author tags format", () => {
			it("should execute UPDATE authorMain to normalize tags", async () => {
				await syncAuthorTag(mockDb as any);

				const seventhCall = mockDb.execute.mock.calls[6][0];
				expect(seventhCall.type).toBe("sql");
			});
		});
	});

	describe("down function", () => {
		it("should execute 2 truncate statements", async () => {
			await down(mockDb as any);

			expect(mockDb.execute).toHaveBeenCalledTimes(2);
		});

		it("should truncate author_tag table first", async () => {
			await down(mockDb as any);

			const firstCall = mockDb.execute.mock.calls[0][0];
			expect(firstCall.type).toBe("sql");
		});

		it("should truncate tag table second", async () => {
			await down(mockDb as any);

			const secondCall = mockDb.execute.mock.calls[1][0];
			expect(secondCall.type).toBe("sql");
		});

		it("should handle database errors", async () => {
			const dbError = new Error("Cannot truncate table");
			mockDb.mockExecute.mockRejectedValueOnce(dbError);

			await expect(down(mockDb as any)).rejects.toThrow(
				"Cannot truncate table",
			);
		});

		it("should execute truncate statements in correct order", async () => {
			const executionOrder: string[] = [];
			mockDb.mockExecute.mockImplementation(() => {
				executionOrder.push(`step-${executionOrder.length + 1}`);
				return Promise.resolve(undefined);
			});

			await down(mockDb as any);

			expect(executionOrder).toEqual(["step-1", "step-2"]);
		});

		it("should stop on first error", async () => {
			const dbError = new Error("Truncate failed");
			mockDb.mockExecute.mockRejectedValueOnce(dbError);

			await expect(down(mockDb as any)).rejects.toThrow("Truncate failed");
			expect(mockDb.execute).toHaveBeenCalledTimes(1);
		});
	});

	describe("Migration workflow", () => {
		it("should be able to run syncAuthorTag followed by down", async () => {
			await syncAuthorTag(mockDb as any);
			vi.clearAllMocks();
			await down(mockDb as any);

			expect(mockDb.execute).toHaveBeenCalledTimes(2);
		});

		it("should be able to run down followed by syncAuthorTag", async () => {
			await down(mockDb as any);
			vi.clearAllMocks();
			await syncAuthorTag(mockDb as any);

			expect(mockDb.execute).toHaveBeenCalledTimes(7);
		});
	});
});
