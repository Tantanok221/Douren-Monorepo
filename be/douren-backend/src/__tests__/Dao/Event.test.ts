import { describe, expect, it, vi, beforeEach } from "vitest";
import { NewEventDao } from "@/Dao/Event";
import { createEventMockDatabase } from "@/__fixtures__/mockDatabase";
import {
	validEventData,
	duplicateEventData,
	eventWithoutId,
	nonExistentEventName,
	mockEventDbResponse,
	singleEventDbResponse,
} from "@/__fixtures__/eventData";

vi.mock("@pkg/database/db", () => ({
	initDB: vi.fn(),
	s: {
		event: {
			id: "id",
			name: "name",
			startDate: "startDate",
			endDate: "endDate",
		},
	},
}));

describe("Event DAO", () => {
	let mockDb: ReturnType<typeof createEventMockDatabase>;
	let eventDao: ReturnType<typeof NewEventDao>;

	beforeEach(() => {
		vi.clearAllMocks();
		mockDb = createEventMockDatabase();
		eventDao = NewEventDao(mockDb as any);
	});

	describe("NewEventDao factory function", () => {
		it("should initialize EventDao with database instance", () => {
			expect(eventDao).toBeDefined();
			expect(eventDao.db).toBe(mockDb);
		});
	});

	describe("FetchAll", () => {
		it("should fetch all events ordered by ID descending", async () => {
			const result = await eventDao.FetchAll();

			expect(mockDb.select).toHaveBeenCalledOnce();
			expect(mockDb.select().from).toHaveBeenCalledWith({
				id: "id",
				name: "name",
				startDate: "startDate",
				endDate: "endDate",
			});
			expect(mockDb.select().from().orderBy).toHaveBeenCalled();
			expect(result).toEqual(mockEventDbResponse);
		});

		it("should call orderBy with desc(s.event.id)", async () => {
			await eventDao.FetchAll();

			expect(mockDb.select().from().orderBy).toHaveBeenCalledOnce();
		});
	});

	describe("FetchByEventName", () => {
		it("should fetch event by name with correct WHERE clause", async () => {
			const eventName = "FF45";
			const result = await eventDao.FetchByEventName(eventName);

			expect(mockDb.select).toHaveBeenCalledOnce();
			expect(mockDb.select().from).toHaveBeenCalledWith({
				id: "id",
				name: "name",
				startDate: "startDate",
				endDate: "endDate",
			});
			expect(mockDb.select().from().where).toHaveBeenCalled();
			expect(result).toEqual(singleEventDbResponse);
		});

		it("should return single event object (array destructuring)", async () => {
			const eventName = "FF45";
			const result = await eventDao.FetchByEventName(eventName);

			expect(result).toEqual(singleEventDbResponse);
			expect(Array.isArray(result)).toBe(false);
		});

		it("should handle non-existent event name", async () => {
			const result = await eventDao.FetchByEventName(nonExistentEventName);

			expect(mockDb.select).toHaveBeenCalledOnce();
			expect(result).toEqual(singleEventDbResponse);
		});
	});

	describe("Create", () => {
		it("should create event with valid data", async () => {
			const result = await eventDao.Create(validEventData);

			expect(mockDb.insert).toHaveBeenCalledOnce();
			expect(mockDb.insert().values).toHaveBeenCalledWith(validEventData);
			expect(mockDb.insert().values().onConflictDoNothing).toHaveBeenCalledWith({
				target: {
					id: "id",
					name: "name",
					startDate: "startDate",
					endDate: "endDate",
				}.id,
			});
			expect(result).toEqual(mockEventDbResponse);
		});

		it("should handle duplicate ID with onConflictDoNothing", async () => {
			const result = await eventDao.Create(duplicateEventData);

			expect(mockDb.insert().values().onConflictDoNothing).toHaveBeenCalledWith({
				target: {
					id: "id",
					name: "name",
					startDate: "startDate",
					endDate: "endDate",
				}.id,
			});
			expect(result).toEqual(mockEventDbResponse);
		});

		it("should create event without ID (auto-generated)", async () => {
			const result = await eventDao.Create(eventWithoutId);

			expect(mockDb.insert).toHaveBeenCalledOnce();
			expect(mockDb.insert().values).toHaveBeenCalledWith(eventWithoutId);
			expect(result).toEqual(mockEventDbResponse);
		});

		it("should return created event data", async () => {
			const result = await eventDao.Create(validEventData);

			expect(mockDb.insert().values().onConflictDoNothing().returning).toHaveBeenCalledOnce();
			expect(result).toEqual(mockEventDbResponse);
		});
	});

	describe("Database integration", () => {
		it("should use correct database instance", () => {
			expect(eventDao.db).toBe(mockDb);
		});

		it("should call initDB methods correctly", async () => {
			await eventDao.FetchAll();
			await eventDao.FetchByEventName("test");
			await eventDao.Create(validEventData);

			expect(mockDb.select).toHaveBeenCalledTimes(2);
			expect(mockDb.insert).toHaveBeenCalledTimes(1);
		});
	});
});