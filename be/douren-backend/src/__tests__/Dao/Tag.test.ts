import { describe, expect, it, vi, beforeEach } from "vitest";
import type { initDB } from "@pkg/database/db";

const { mockTagTable, mockAuthorTagTable } = vi.hoisted(() => ({
	mockTagTable: {
		tag: "tag.tag",
		count: "tag.count",
		index: "tag.index",
	},
	mockAuthorTagTable: {
		authorId: "authorTag.authorId",
		tagId: "authorTag.tagId",
	},
}));

// Mock database schema
vi.mock("@pkg/database/db", () => ({
	initDB: vi.fn(),
	s: {
		tag: mockTagTable,
		authorTag: mockAuthorTagTable,
	},
}));

// Type alias for mock database
type MockDB = ReturnType<typeof initDB>;

// Mock data
const mockTagDbResponse = [
	{
		tag: "原創",
		count: 150,
		index: 1,
	},
	{
		tag: "插畫",
		count: 120,
		index: 2,
	},
	{
		tag: "設計",
		count: 80,
		index: 3,
	},
];

// Create mock database
const createMockDatabase = () => {
	const mockOrderBy = vi.fn().mockResolvedValue(mockTagDbResponse);
	const mockGroupBy = vi.fn().mockReturnValue({
		orderBy: mockOrderBy,
	});
	const mockLeftJoin = vi.fn().mockReturnValue({
		groupBy: mockGroupBy,
	});
	const mockFrom = vi.fn().mockReturnValue({
		leftJoin: mockLeftJoin,
	});
	const mockSelect = vi.fn().mockReturnValue({
		from: mockFrom,
	});

	return {
		select: mockSelect,
		mockSelect,
		mockFrom,
		mockLeftJoin,
		mockGroupBy,
		mockOrderBy,
	};
};

// Import after mocks
import { createTag, fetchTag, renameTag } from "@/Dao/Tag";

describe("Tag DAO", () => {
	let mockDb: ReturnType<typeof createMockDatabase>;

	beforeEach(() => {
		mockDb = createMockDatabase();
		vi.clearAllMocks();
	});

	describe("fetchTag function", () => {
		it("should fetch all tags successfully", async () => {
			const result = await fetchTag(mockDb as unknown as MockDB);

			expect(mockDb.select).toHaveBeenCalled();
			expect(mockDb.mockFrom).toHaveBeenCalledWith(mockTagTable);
			expect(mockDb.mockLeftJoin).toHaveBeenCalled();
			expect(mockDb.mockGroupBy).toHaveBeenCalled();
			expect(result).toEqual(mockTagDbResponse);
		});

		it("should return empty array when no tags exist", async () => {
			mockDb.mockOrderBy.mockResolvedValueOnce([]);

			const result = await fetchTag(mockDb as unknown as MockDB);

			expect(result).toEqual([]);
		});

		it("should return tags with correct structure", async () => {
			const result = await fetchTag(mockDb as unknown as MockDB);

			expect(result).toHaveLength(3);
			expect(result[0]).toHaveProperty("tag");
			expect(result[0]).toHaveProperty("count");
			expect(result[0]).toHaveProperty("index");
		});

		it("should return tags in their stored order", async () => {
			const result = await fetchTag(mockDb as unknown as MockDB);

			expect(result[0].tag).toBe("原創");
			expect(result[0].index).toBe(1);
			expect(result[1].tag).toBe("插畫");
			expect(result[1].index).toBe(2);
		});

		it("should handle database errors", async () => {
			const dbError = new Error("Database connection failed");
			mockDb.mockOrderBy.mockRejectedValueOnce(dbError);

			await expect(fetchTag(mockDb as unknown as MockDB)).rejects.toThrow(
				"Database connection failed",
			);
		});

		it("should call select with selection object", async () => {
			await fetchTag(mockDb as unknown as MockDB);

			expect(mockDb.select).toHaveBeenCalledTimes(1);
			expect(mockDb.select).toHaveBeenCalledWith(expect.any(Object));
		});

		it("should return tags with count values", async () => {
			const result = await fetchTag(mockDb as unknown as MockDB);

			expect(result[0].count).toBe(150);
			expect(result[1].count).toBe(120);
			expect(result[2].count).toBe(80);
		});

		it("should handle single tag response", async () => {
			const singleTagResponse = [
				{
					tag: "單一標籤",
					count: 10,
					index: 1,
				},
			];
			mockDb.mockOrderBy.mockResolvedValueOnce(singleTagResponse);

			const result = await fetchTag(mockDb as unknown as MockDB);

			expect(result).toHaveLength(1);
			expect(result[0].tag).toBe("單一標籤");
		});

		it("should handle tags with zero count", async () => {
			const zeroCountResponse = [
				{
					tag: "未使用",
					count: 0,
					index: 1,
				},
			];
			mockDb.mockOrderBy.mockResolvedValueOnce(zeroCountResponse);

			const result = await fetchTag(mockDb as unknown as MockDB);

			expect(result[0].count).toBe(0);
		});

		it("should handle tags with special characters", async () => {
			const specialCharResponse = [
				{
					tag: "特殊&字元<>",
					count: 5,
					index: 1,
				},
			];
			mockDb.mockOrderBy.mockResolvedValueOnce(specialCharResponse);

			const result = await fetchTag(mockDb as unknown as MockDB);

			expect(result[0].tag).toBe("特殊&字元<>");
		});
	});

	describe("createTag function", () => {
		it("should insert a tag with next index and return it", async () => {
			const mockFrom = vi.fn().mockResolvedValue([{ maxIndex: 3 }]);
			const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
			const mockReturning = vi
				.fn()
				.mockResolvedValue([{ tag: "新標籤", count: 0, index: 4 }]);
			const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
			const mockInsert = vi.fn().mockReturnValue({ values: mockValues });

			const result = await createTag(
				{
					select: mockSelect,
					insert: mockInsert,
				} as unknown as MockDB,
				"新標籤",
			);

			expect(mockSelect).toHaveBeenCalledTimes(1);
			expect(mockFrom).toHaveBeenCalledWith(mockTagTable);
			expect(mockInsert).toHaveBeenCalledWith(mockTagTable);
			expect(mockValues).toHaveBeenCalledWith({
				tag: "新標籤",
				count: 0,
				index: 4,
			});
			expect(result).toEqual([{ tag: "新標籤", count: 0, index: 4 }]);
		});

		it("should start index at 1 when no tags exist", async () => {
			const mockFrom = vi.fn().mockResolvedValue([{ maxIndex: null }]);
			const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
			const mockReturning = vi
				.fn()
				.mockResolvedValue([{ tag: "全新", count: 0, index: 1 }]);
			const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
			const mockInsert = vi.fn().mockReturnValue({ values: mockValues });

			const result = await createTag(
				{
					select: mockSelect,
					insert: mockInsert,
				} as unknown as MockDB,
				"全新",
			);

			expect(mockValues).toHaveBeenCalledWith({
				tag: "全新",
				count: 0,
				index: 1,
			});
			expect(result).toEqual([{ tag: "全新", count: 0, index: 1 }]);
		});
	});

	describe("renameTag function", () => {
		it("should insert new tag, update mappings, and delete old tag", async () => {
			const mockWhere = vi
				.fn()
				.mockResolvedValueOnce([{ tag: "原創", count: 2, index: 5 }])
				.mockResolvedValueOnce([]);
			const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
			const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

			const mockReturning = vi
				.fn()
				.mockResolvedValue([{ tag: "新名稱", count: 2, index: 5 }]);
			const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
			const mockInsert = vi.fn().mockReturnValue({ values: mockValues });

			const mockSet = vi.fn().mockReturnValue({ where: vi.fn() });
			const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });

			const mockDeleteWhere = vi.fn().mockResolvedValue([]);
			const mockDelete = vi.fn().mockReturnValue({ where: mockDeleteWhere });

			const result = await renameTag(
				{
					select: mockSelect,
					insert: mockInsert,
					update: mockUpdate,
					delete: mockDelete,
				} as unknown as MockDB,
				"原創",
				"新名稱",
			);

			expect(mockSelect).toHaveBeenCalledTimes(2);
			expect(mockInsert).toHaveBeenCalledWith(mockTagTable);
			expect(mockValues).toHaveBeenCalledWith({
				tag: "新名稱",
				count: 2,
				index: 5,
			});
			expect(mockUpdate).toHaveBeenCalledWith(mockAuthorTagTable);
			expect(mockSet).toHaveBeenCalledWith({ tagId: "新名稱" });
			expect(mockDelete).toHaveBeenCalledWith(mockTagTable);
			expect(result).toEqual([{ tag: "新名稱", count: 2, index: 5 }]);
		});

		it("should return null when current tag is missing", async () => {
			const mockWhere = vi.fn().mockResolvedValueOnce([]);
			const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
			const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

			const result = await renameTag(
				{ select: mockSelect } as unknown as MockDB,
				"不存在",
				"新名稱",
			);

			expect(result).toBeNull();
		});
	});
});
