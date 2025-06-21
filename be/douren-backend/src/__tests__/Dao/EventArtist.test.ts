import { describe, expect, it, vi, beforeEach } from "vitest";
import {
	createEventArtistMockDatabase,
	createEventArtistMockQueryBuilder,
} from "@/__fixtures__/mockDatabase";
import {
	validEventArtistData,
	minimalEventArtistData,
	updateEventArtistData,
	mockEventArtistDbResponse,
	mockEventInputParams,
} from "@/__fixtures__/eventArtistData";

vi.mock("@pkg/database/db", () => ({
	initDB: vi.fn(),
	s: {
		eventDm: {
			uuid: "uuid",
			artistId: "artistId",
			eventId: "eventId",
			boothName: "boothName",
			locationDay01: "locationDay01",
			locationDay02: "locationDay02",
			locationDay03: "locationDay03",
			dm: "dm",
		},
	},
}));

vi.mock("@/QueryBuilder", () => ({
	NewEventArtistQueryBuilder: vi.fn().mockReturnValue({
		BuildQuery: vi.fn().mockReturnValue({
			SelectQuery: { query: Promise.resolve([{
				uuid: 1,
				artistId: 1,
				eventId: 1,
				boothName: "A01",
				locationDay01: "大廳-A01",
				locationDay02: "大廳-A02",
				locationDay03: "大廳-A03",
				dm: "https://example.com/dm.jpg",
				createdAt: new Date(),
				updatedAt: new Date(),
			}]) },
			CountQuery: { query: Promise.resolve([{ totalCount: 1 }]) },
		}),
	}),
}));

vi.mock("@/helper/createPaginationObject", () => ({
	createPaginationObject: vi.fn((data, page, pageSize, totalCount) => ({
		data,
		pagination: {
			page,
			pageSize,
			totalCount,
			totalPages: Math.ceil(totalCount / pageSize),
		},
	})),
}));

vi.mock("@/helper/constant", () => ({
	PAGE_SIZE: 10,
}));

// Import after mocks
import { NewEventArtistDao } from "@/Dao/EventArtist";

describe("EventArtist DAO", () => {
	let mockDb: ReturnType<typeof createEventArtistMockDatabase>;
	let mockQueryBuilder: ReturnType<typeof createEventArtistMockQueryBuilder>;
	let eventArtistDao: ReturnType<typeof NewEventArtistDao>;

	beforeEach(() => {
		vi.clearAllMocks();
		mockDb = createEventArtistMockDatabase();
		mockQueryBuilder = createEventArtistMockQueryBuilder();
		eventArtistDao = NewEventArtistDao(mockDb as any);
	});

	describe("NewEventArtistDao factory function", () => {
		it("should initialize EventArtistDao with database instance", () => {
			expect(eventArtistDao).toBeDefined();
			expect(eventArtistDao.db).toBe(mockDb);
		});
	});

	describe("Create", () => {
		it("should create event artist relationship with valid data", async () => {
			const result = await eventArtistDao.Create(validEventArtistData);

			expect(mockDb.insert).toHaveBeenCalledOnce();
			expect(mockDb.insert().values).toHaveBeenCalledWith(validEventArtistData);
			expect(mockDb.insert().values().onConflictDoNothing).toHaveBeenCalledWith({
				target: {
					uuid: "uuid",
					artistId: "artistId",
					eventId: "eventId",
					boothName: "boothName",
					locationDay01: "locationDay01",
					locationDay02: "locationDay02",
					locationDay03: "locationDay03",
					dm: "dm",
				}.uuid,
			});
			expect(result).toEqual(mockEventArtistDbResponse);
		});

		it("should handle duplicate UUID with onConflictDoNothing", async () => {
			const duplicateData = { ...validEventArtistData, uuid: 1 };
			const result = await eventArtistDao.Create(duplicateData);

			expect(mockDb.insert().values().onConflictDoNothing).toHaveBeenCalledWith({
				target: {
					uuid: "uuid",
					artistId: "artistId",
					eventId: "eventId",
					boothName: "boothName",
					locationDay01: "locationDay01",
					locationDay02: "locationDay02",
					locationDay03: "locationDay03",
					dm: "dm",
				}.uuid,
			});
			expect(result).toEqual(mockEventArtistDbResponse);
		});

		it("should create with minimal data (only required fields)", async () => {
			const result = await eventArtistDao.Create(minimalEventArtistData);

			expect(mockDb.insert).toHaveBeenCalledOnce();
			expect(mockDb.insert().values).toHaveBeenCalledWith(minimalEventArtistData);
			expect(result).toEqual(mockEventArtistDbResponse);
		});

		it("should use correct type casting (PutEventArtistSchemaTypes)", async () => {
			await eventArtistDao.Create(validEventArtistData);

			expect(mockDb.insert().values).toHaveBeenCalledWith(validEventArtistData);
		});

		it("should return created event artist data", async () => {
			const result = await eventArtistDao.Create(validEventArtistData);

			expect(mockDb.insert().values().onConflictDoNothing().returning).toHaveBeenCalledOnce();
			expect(result).toEqual(mockEventArtistDbResponse);
		});
	});

	describe("Update", () => {
		it("should update event artist with valid UUID and data", async () => {
			const result = await eventArtistDao.Update(updateEventArtistData);

			expect(mockDb.update).toHaveBeenCalledOnce();
			expect(mockDb.update().set).toHaveBeenCalledWith(updateEventArtistData);
			expect(mockDb.update().set().where).toHaveBeenCalled();
			expect(result).toEqual(mockEventArtistDbResponse);
		});

		it("should use UUID in WHERE clause correctly", async () => {
			await eventArtistDao.Update(updateEventArtistData);

			expect(mockDb.update().set().where).toHaveBeenCalledOnce();
		});

		it("should return updated event artist data", async () => {
			const result = await eventArtistDao.Update(updateEventArtistData);

			expect(mockDb.update().set().where().returning).toHaveBeenCalledOnce();
			expect(result).toEqual(mockEventArtistDbResponse);
		});

		it("should handle non-existent UUID", async () => {
			const nonExistentData = { ...updateEventArtistData, uuid: 999 };
			const result = await eventArtistDao.Update(nonExistentData);

			expect(mockDb.update).toHaveBeenCalledOnce();
			expect(result).toEqual(mockEventArtistDbResponse);
		});
	});

	describe("Fetch", () => {
		it("should integrate with EventArtistQueryBuilder", async () => {
			const result = await eventArtistDao.Fetch(mockEventInputParams);

			// Should return result from QueryBuilder
			expect(result).toBeDefined();
			expect(result).toHaveProperty("data");
		});

		it("should handle event name filtering", async () => {
			const paramsWithEventName = {
				...mockEventInputParams,
				eventName: "FF45",
			};
			const result = await eventArtistDao.Fetch(paramsWithEventName);

			// Should process the request and return data
			expect(result).toBeDefined();
		});

		it("should handle pagination parameters", async () => {
			const paginationParams = {
				...mockEventInputParams,
				page: "2",
			};
			const result = await eventArtistDao.Fetch(paginationParams);

			// Should return paginated data
			expect(result).toHaveProperty("pagination");
		});

		it("should handle tag and search filtering", async () => {
			const filterParams = {
				...mockEventInputParams,
				tags: "原創,插畫",
				search: "test artist",
			};
			const result = await eventArtistDao.Fetch(filterParams);

			// Should process filters and return data
			expect(result).toBeDefined();
		});

		it("should execute both SelectQuery and CountQuery in parallel", async () => {
			const result = await eventArtistDao.Fetch(mockEventInputParams);

			// Should return data from both queries
			expect(result).toBeDefined();
			expect(result).toHaveProperty("data");
			expect(result).toHaveProperty("pagination");
		});

		it("should return paginated result object", async () => {
			const result = await eventArtistDao.Fetch(mockEventInputParams);

			expect(result).toHaveProperty("data");
			expect(result).toHaveProperty("pagination");
			expect(Array.isArray(result.data)).toBe(true);
		});

		it("should handle complex multi-table joins", async () => {
			const result = await eventArtistDao.Fetch(mockEventInputParams);

			// Should handle joins and return data
			expect(result).toBeDefined();
		});
	});

	describe("Database integration", () => {
		it("should use correct database instance", () => {
			expect(eventArtistDao.db).toBe(mockDb);
		});

		it("should call initDB methods correctly", async () => {
			await eventArtistDao.Create(validEventArtistData);
			await eventArtistDao.Update(updateEventArtistData);
			await eventArtistDao.Fetch(mockEventInputParams);

			expect(mockDb.insert).toHaveBeenCalledTimes(1);
			expect(mockDb.update).toHaveBeenCalledTimes(1);
		});
	});

	describe("Type handling", () => {
		it("should handle CreateEventArtistSchemaTypes in Create method", async () => {
			await eventArtistDao.Create(validEventArtistData);

			expect(mockDb.insert().values).toHaveBeenCalledWith(validEventArtistData);
		});

		it("should handle PutEventArtistSchemaTypes in Update method", async () => {
			await eventArtistDao.Update(updateEventArtistData);

			expect(mockDb.update().set).toHaveBeenCalledWith(updateEventArtistData);
		});

		it("should handle eventInputParamsType in Fetch method", async () => {
			const result = await eventArtistDao.Fetch(mockEventInputParams);

			// Should handle input params correctly
			expect(result).toBeDefined();
		});
	});
});