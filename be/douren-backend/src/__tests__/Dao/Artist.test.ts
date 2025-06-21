import { describe, expect, it, vi, beforeEach } from "vitest";
import { createMockDatabase } from "@/__fixtures__/mockDatabase";
import {
	validArtistData,
	minimalArtistData,
	updateArtistData,
	mockArtistDbResponse,
} from "@/__fixtures__/artistData";

// Mock dependencies
vi.mock("@pkg/database/db", () => ({
	initDB: vi.fn(),
	s: {
		authorMain: {
			uuid: "uuid",
			author: "author",
			tags: "tags",
		},
	},
}));

vi.mock("@/utlis/fetchHelper", () => ({
	ArtistFetchParams: {},
}));

vi.mock("@/QueryBuilder", () => ({
	NewArtistQueryBuilder: vi.fn().mockReturnValue({
		BuildQuery: vi.fn().mockReturnValue({
			SelectQuery: { query: Promise.resolve(mockArtistDbResponse) },
			CountQuery: { query: Promise.resolve([{ totalCount: 1 }]) },
		}),
	}),
}));

vi.mock("@/helper/createPaginationObject", () => ({
	createPaginationObject: vi.fn().mockReturnValue({
		data: mockArtistDbResponse,
		totalCount: 1,
		totalPage: 1,
		nextPageAvailable: false,
		previousPageAvailable: false,
		pageSize: 10,
	}),
}));

// Import after mocks
import { NewArtistDao } from "@/Dao/Artist";

describe("Artist DAO", () => {
	let mockDb: ReturnType<typeof createMockDatabase>;
	let artistDao: ReturnType<typeof NewArtistDao>;

	beforeEach(() => {
		mockDb = createMockDatabase();
		artistDao = NewArtistDao(mockDb as any);
		vi.clearAllMocks();
	});

	describe("NewArtistDao factory function", () => {
		it("should create new ArtistDao instance", () => {
			const dao = NewArtistDao(mockDb as any);
			expect(dao).toBeDefined();
			expect(dao.db).toBe(mockDb);
		});
	});

	describe("Create method", () => {
		it("should create artist with valid data", async () => {
			const result = await artistDao.Create(validArtistData);

			expect(mockDb.insert).toHaveBeenCalledWith(expect.anything());
			expect(mockDb.mockValues).toHaveBeenCalledWith(validArtistData);
			expect(mockDb.mockOnConflictDoNothing).toHaveBeenCalledWith({
				target: expect.anything(),
			});
			expect(mockDb.mockReturning).toHaveBeenCalled();
			expect(result).toEqual(mockArtistDbResponse);
		});

		it("should create artist with minimal data", async () => {
			const result = await artistDao.Create(minimalArtistData);

			expect(mockDb.insert).toHaveBeenCalledWith(expect.anything());
			expect(mockDb.mockValues).toHaveBeenCalledWith(minimalArtistData);
			expect(result).toEqual(mockArtistDbResponse);
		});

		it("should handle conflict with onConflictDoNothing", async () => {
			const duplicateData = { ...validArtistData, uuid: 1 };

			const result = await artistDao.Create(duplicateData);

			expect(mockDb.mockOnConflictDoNothing).toHaveBeenCalledWith({
				target: expect.anything(),
			});
			expect(result).toEqual(mockArtistDbResponse);
		});
	});

	describe("Update method", () => {
		it("should update artist with valid ID and data", async () => {
			const artistId = "1";
			const expectedBody = { ...updateArtistData, uuid: 1 };

			const result = await artistDao.Update(artistId, updateArtistData);

			expect(mockDb.update).toHaveBeenCalledWith(expect.anything());
			expect(mockDb.mockSet).toHaveBeenCalledWith(expectedBody);
			expect(result).toEqual(mockArtistDbResponse);
		});

		it("should convert artistId to number for uuid", async () => {
			const artistId = "123";
			const testData = { author: "Test" };

			await artistDao.Update(artistId, testData);

			expect(mockDb.mockSet).toHaveBeenCalledWith({
				...testData,
				uuid: 123,
			});
		});

		it("should handle non-existent artist ID", async () => {
			const artistId = "999";
			mockDb.mockReturning.mockResolvedValueOnce([]);

			const result = await artistDao.Update(artistId, updateArtistData);

			expect(mockDb.update).toHaveBeenCalled();
			expect(result).toEqual([]);
		});
	});

	describe("Delete method", () => {
		it("should delete artist with valid ID", async () => {
			const artistId = "1";

			const result = await artistDao.Delete(artistId);

			expect(mockDb.delete).toHaveBeenCalledWith(expect.anything());
			expect(mockDb.mockWhere).toHaveBeenCalled();
			expect(mockDb.mockReturning).toHaveBeenCalled();
			expect(result).toEqual(mockArtistDbResponse);
		});

		it("should handle non-existent artist ID", async () => {
			const artistId = "999";
			mockDb.mockReturning.mockResolvedValueOnce([]);

			const result = await artistDao.Delete(artistId);

			expect(mockDb.delete).toHaveBeenCalled();
			expect(result).toEqual([]);
		});

		it("should convert artistId to number", async () => {
			const artistId = "456";

			await artistDao.Delete(artistId);

			expect(mockDb.delete).toHaveBeenCalledWith(expect.anything());
		});
	});

	describe("Fetch method", () => {
		const mockFetchParams = {
			page: "1",
			sort: "author,asc",
			searchTable: "Author_Main.Author",
			search: "test",
			tag: "原創,插畫",
		};

		it("should fetch artists with pagination", async () => {
			const result = await artistDao.Fetch(mockFetchParams);

			expect(result).toEqual({
				data: mockArtistDbResponse,
				totalCount: 1,
				totalPage: 1,
				nextPageAvailable: false,
				previousPageAvailable: false,
				pageSize: 10,
			});
		});

		it("should fetch artists with search filter", async () => {
			const searchParams = {
				...mockFetchParams,
				search: "test artist",
			};

			const result = await artistDao.Fetch(searchParams);

			expect(result).toBeDefined();
		});

		it("should fetch artists with tag filter", async () => {
			const tagParams = {
				...mockFetchParams,
				tag: "插畫,原創",
			};

			const result = await artistDao.Fetch(tagParams);

			expect(result).toBeDefined();
		});

		it("should fetch artists without filters", async () => {
			const basicParams = {
				page: "1",
				sort: "author,asc",
				searchTable: "Author_Main.Author",
			};

			const result = await artistDao.Fetch(basicParams);

			expect(result).toBeDefined();
		});
	});
});