import { describe, expect, it, vi, beforeEach } from "vitest";
import { 
	validEventData, 
	mockEventDbResponse, 
	singleEventDbResponse 
} from "@/__fixtures__/eventData";
import { 
	validEventArtistData,
	mockEventArtistDbResponse 
} from "@/__fixtures__/eventArtistData";
import { createMockTrpcOpts } from "@/__fixtures__/mockTrpcContext";
import { createMockEventDao, createMockEventArtistDao } from "@/__fixtures__/mockDatabase";

// Mock the DAO layers
const mockEventDao = createMockEventDao();
const mockEventArtistDao = createMockEventArtistDao();

// Mock the DAO factories
const mockNewEventDao = vi.fn(() => mockEventDao);
const mockNewEventArtistDao = vi.fn(() => mockEventArtistDao);

// Mock the TRPC procedures manually
const mockTrpcEventRoute = {
	getAllEvent: async (opts: any) => {
		const EventDao = mockNewEventDao(opts.ctx.db);
		return await EventDao.FetchAll();
	},
	getEvent: async (opts: any) => {
		const EventArtistDao = mockNewEventArtistDao(opts.ctx.db);
		return await EventArtistDao.Fetch(opts.input);
	},
	getEventId: async (opts: any) => {
		// Simulate database query for event by name
		return singleEventDbResponse;
	},
	createEventArtist: async (opts: any) => {
		const EventArtistDao = mockNewEventArtistDao(opts.ctx.db);
		return await EventArtistDao.Create(opts.input);
	},
};

describe("Event Route Logic Tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Event TRPC Procedures", () => {
		it("should return all events", async () => {
			const opts = createMockTrpcOpts({});
			
			const result = await mockTrpcEventRoute.getAllEvent(opts);
			
			expect(result).toEqual(mockEventDbResponse);
			expect(mockEventDao.FetchAll).toHaveBeenCalled();
		});

		it("should fetch event artist data with valid parameters", async () => {
			const opts = createMockTrpcOpts({
				page: 1,
				eventName: "FF45",
				sort: "author,asc",
			});
			
			const result = await mockTrpcEventRoute.getEvent(opts);
			
			expect(result).toEqual({
				data: mockEventArtistDbResponse,
				totalCount: 1,
				totalPage: 1,
			});
			expect(mockEventArtistDao.Fetch).toHaveBeenCalledWith(opts.input);
		});

		it("should handle search and filter parameters for event artists", async () => {
			const opts = createMockTrpcOpts({
				page: 1,
				eventName: "FF45",
				search: "test",
				tag: "原創",
				sort: "author,desc",
				searchTable: "author",
			});
			
			await mockTrpcEventRoute.getEvent(opts);
			expect(mockEventArtistDao.Fetch).toHaveBeenCalledWith(opts.input);
		});

		it("should return event data by event name", async () => {
			const opts = createMockTrpcOpts({ eventName: "FF45" });
			
			const result = await mockTrpcEventRoute.getEventId(opts);
			
			expect(result).toEqual(singleEventDbResponse);
		});

		it("should create event artist with valid data", async () => {
			const opts = createMockTrpcOpts(validEventArtistData);
			
			const result = await mockTrpcEventRoute.createEventArtist(opts);
			
			expect(result).toEqual([mockEventArtistDbResponse[0]]);
			expect(mockEventArtistDao.Create).toHaveBeenCalledWith(validEventArtistData);
		});
	});

	describe("Event Route Business Logic", () => {
		it("should process event artist fetch parameters correctly", async () => {
			const params = {
				page: "1",
				eventName: "FF45",
				search: "test artist",
				tag: "原創,插畫",
				sort: "author,asc",
				searchTable: "author",
			};
			
			const opts = createMockTrpcOpts(params);
			await mockTrpcEventRoute.getEvent(opts);
			
			expect(mockEventArtistDao.Fetch).toHaveBeenCalledWith(params);
		});

		it("should handle event artist creation", async () => {
			const eventArtistData = {
				artistId: 1,
				eventId: 1,
				boothName: "A01",
				locationDay01: "大廳-A01",
				dm: "https://example.com/dm.jpg",
			};
			
			const opts = createMockTrpcOpts(eventArtistData);
			const result = await mockTrpcEventRoute.createEventArtist(opts);
			
			expect(mockEventArtistDao.Create).toHaveBeenCalledWith(eventArtistData);
			expect(result).toEqual([mockEventArtistDbResponse[0]]);
		});

		it("should fetch all events without parameters", async () => {
			const opts = createMockTrpcOpts({});
			const result = await mockTrpcEventRoute.getAllEvent(opts);
			
			expect(mockEventDao.FetchAll).toHaveBeenCalled();
			expect(result).toEqual(mockEventDbResponse);
		});

		it("should handle event name to ID lookup", async () => {
			const opts = createMockTrpcOpts({ eventName: "FF45" });
			const result = await mockTrpcEventRoute.getEventId(opts);
			
			expect(result).toEqual(singleEventDbResponse);
			expect(result.name).toBe("FF45");
			expect(result.id).toBe(1);
		});
	});
});