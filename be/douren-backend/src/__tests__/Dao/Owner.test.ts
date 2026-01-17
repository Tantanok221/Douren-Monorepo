import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock database schema
vi.mock("@pkg/database/db", () => ({
	initDB: vi.fn(),
	s: {
		owner: "owner_table",
	},
}));

// Mock data
const mockOwnerDbResponse = [
	{
		id: 1,
		name: "Owner 1",
		email: "owner1@example.com",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: 2,
		name: "Owner 2",
		email: "owner2@example.com",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

// Create mock database
const createMockDatabase = () => {
	const mockFrom = vi.fn().mockResolvedValue(mockOwnerDbResponse);
	const mockSelect = vi.fn().mockReturnValue({
		from: mockFrom,
	});

	return {
		select: mockSelect,
		mockSelect,
		mockFrom,
	};
};

// Import after mocks
import { NewOwnerDao } from "@/Dao/Owner";

describe("Owner DAO", () => {
	let mockDb: ReturnType<typeof createMockDatabase>;
	let ownerDao: ReturnType<typeof NewOwnerDao>;

	beforeEach(() => {
		mockDb = createMockDatabase();
		ownerDao = NewOwnerDao(mockDb as any);
		vi.clearAllMocks();
	});

	describe("NewOwnerDao factory function", () => {
		it("should create a new OwnerDao instance", () => {
			const dao = NewOwnerDao(mockDb as any);

			expect(dao).toBeDefined();
			expect(dao.db).toBe(mockDb);
		});

		it("should create independent instances", () => {
			const dao1 = NewOwnerDao(mockDb as any);
			const mockDb2 = createMockDatabase();
			const dao2 = NewOwnerDao(mockDb2 as any);

			expect(dao1.db).not.toBe(dao2.db);
		});
	});

	describe("Fetch method", () => {
		it("should fetch all owners successfully", async () => {
			const result = await ownerDao.Fetch();

			expect(mockDb.select).toHaveBeenCalled();
			expect(mockDb.mockFrom).toHaveBeenCalledWith("owner_table");
			expect(result).toEqual(mockOwnerDbResponse);
		});

		it("should return empty array when no owners exist", async () => {
			mockDb.mockFrom.mockResolvedValueOnce([]);

			const result = await ownerDao.Fetch();

			expect(result).toEqual([]);
		});

		it("should return all owner fields", async () => {
			const result = await ownerDao.Fetch();

			expect(result).toHaveLength(2);
			expect(result[0]).toHaveProperty("id");
			expect(result[0]).toHaveProperty("name");
			expect(result[0]).toHaveProperty("email");
		});

		it("should handle database errors", async () => {
			const dbError = new Error("Database connection failed");
			mockDb.mockFrom.mockRejectedValueOnce(dbError);

			await expect(ownerDao.Fetch()).rejects.toThrow(
				"Database connection failed",
			);
		});

		it("should call select without any conditions", async () => {
			await ownerDao.Fetch();

			expect(mockDb.select).toHaveBeenCalledTimes(1);
			expect(mockDb.select).toHaveBeenCalledWith();
		});

		it("should return data in correct structure", async () => {
			const customResponse = [
				{
					id: 100,
					name: "Custom Owner",
					email: "custom@example.com",
					createdAt: new Date("2024-01-01"),
					updatedAt: new Date("2024-01-02"),
				},
			];
			mockDb.mockFrom.mockResolvedValueOnce(customResponse);

			const result = await ownerDao.Fetch();

			expect(result).toEqual(customResponse);
			expect(result[0].id).toBe(100);
			expect(result[0].name).toBe("Custom Owner");
		});
	});
});
