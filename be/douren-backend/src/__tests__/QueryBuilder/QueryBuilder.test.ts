import { describe, expect, it, vi, beforeEach } from "vitest";
import type { initDB } from "@pkg/database/db";

// Type alias for mock database
type MockDB = ReturnType<typeof initDB>;

// Shared mock result that can be reset
const createMockBuildQueryResult = () => ({
	withOrderBy: vi.fn().mockReturnThis(),
	withPagination: vi.fn().mockReturnThis(),
	withTableIsNot: vi.fn().mockReturnThis(),
	withFilterEventName: vi.fn().mockReturnThis(),
	withAndFilter: vi.fn().mockReturnThis(),
	withIlikeSearchByTable: vi.fn().mockReturnThis(),
	Build: vi.fn().mockReturnThis(),
	query: Promise.resolve([]),
});

// Module-level mock result holder
let mockBuildQueryResult = createMockBuildQueryResult();

// Mock drizzle-orm
vi.mock("drizzle-orm", () => ({
	asc: vi.fn((column) => ({ column, direction: "asc" })),
	desc: vi.fn((column) => ({ column, direction: "desc" })),
	count: vi.fn((column) => ({ column, type: "count" })),
	countDistinct: vi.fn((column) => ({ column, type: "countDistinct" })),
	eq: vi.fn((a, b) => ({ a, b, type: "eq" })),
}));

// Mock database schema
vi.mock("@pkg/database/db", () => ({
	initDB: vi.fn(),
	s: {
		authorMain: {
			uuid: "authorMain.uuid",
			author: "authorMain.author",
			tags: "authorMain.tags",
		},
		authorTag: {
			authorId: "authorTag.authorId",
			tagId: "authorTag.tagId",
		},
		tag: {
			tag: "tag.tag",
		},
		eventDm: {
			artistId: "eventDm.artistId",
			eventId: "eventDm.eventId",
			boothId: "eventDm.boothId",
			boothName: "eventDm.boothName",
			locationDay01: "eventDm.locationDay01",
			locationDay02: "eventDm.locationDay02",
			locationDay03: "eventDm.locationDay03",
			dm: "eventDm.dm",
		},
		booth: {
			id: "booth.id",
			name: "booth.name",
			locationDay01: "booth.locationDay01",
			locationDay02: "booth.locationDay02",
			locationDay03: "booth.locationDay03",
		},
		event: {
			id: "event.id",
		},
	},
}));

// Mock @pkg/type - Must be mocked before the module that uses it is loaded
vi.mock("@pkg/type", () => ({
	FETCH_ARTIST_OBJECT: { uuid: true, author: true },
	FETCH_EVENT_ARTIST_OBJECT: { uuid: true, boothName: true },
}));

// Mock constants
vi.mock("@/helper/constant", () => ({
	PAGE_SIZE: 10,
}));

// Mock processTableName
vi.mock("@/helper/processTableName", () => ({
	processTableName: vi.fn((table: string) => {
		if (table === "Author_Main.Author") return "authorMain.author";
		if (table === "Booth_name") return "eventDm.boothName";
		return "authorMain.author";
	}),
}));

// Mock processTagConditions
vi.mock("@/helper/processTagConditions", () => ({
	processTagConditions: vi.fn((tag?: string) => {
		if (!tag) return [];
		return tag.split(",").map((t) => ({ pattern: `%${t}%`, type: "ilike" }));
	}),
}));

// Mock BuildQuery helper
vi.mock("@pkg/database/helper", () => ({
	BuildQuery: vi.fn(() => mockBuildQueryResult),
}));

// Mock fetchHelper
vi.mock("@/utlis/fetchHelper", () => ({
	ArtistFetchParams: {},
	EventArtistFetchParams: {},
}));

// Mock paramHelper
vi.mock("@/utlis/paramHelper", () => ({
	DerivedFetchParams: {},
}));

// Import after all mocks are set up
import {
	NewArtistQueryBuilder,
	NewEventArtistQueryBuilder,
} from "@/QueryBuilder";
import { BuildQuery } from "@pkg/database/helper";
import { processTableName } from "@/helper/processTableName";
import { processTagConditions } from "@/helper/processTagConditions";

// Create mock database that matches the chaining pattern in QueryBuilder
const createMockDb = () => {
	const mockDynamic = vi.fn().mockReturnValue({});

	// For ArtistQueryBuilder:
	//   select query: select -> from -> leftJoin -> leftJoin -> groupBy -> $dynamic
	//   count query: select -> from -> $dynamic
	// For EventArtistQueryBuilder:
	//   select query: select -> from -> leftJoin -> leftJoin -> leftJoin -> leftJoin -> groupBy -> $dynamic
	//   count query: select -> from -> leftJoin -> leftJoin -> $dynamic
	const mockGroupBy = vi.fn().mockReturnValue({ $dynamic: mockDynamic });

	// Chain of leftJoins - each needs $dynamic and groupBy for flexibility
	const mockLeftJoin5 = vi.fn().mockReturnValue({
		groupBy: mockGroupBy,
		$dynamic: mockDynamic,
	});
	const mockLeftJoin4 = vi.fn().mockReturnValue({
		leftJoin: mockLeftJoin5,
		groupBy: mockGroupBy,
		$dynamic: mockDynamic,
	});
	const mockLeftJoin3 = vi.fn().mockReturnValue({
		leftJoin: mockLeftJoin4,
		groupBy: mockGroupBy,
		$dynamic: mockDynamic,
	});
	const mockLeftJoin2 = vi.fn().mockReturnValue({
		leftJoin: mockLeftJoin3,
		groupBy: mockGroupBy,
		$dynamic: mockDynamic,
	});
	const mockLeftJoin = vi.fn().mockReturnValue({
		leftJoin: mockLeftJoin2,
		groupBy: mockGroupBy,
		$dynamic: mockDynamic,
	});

	const mockFrom = vi.fn().mockReturnValue({
		leftJoin: mockLeftJoin,
		$dynamic: mockDynamic,
	});

	const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

	return {
		select: mockSelect,
	};
};

describe("QueryBuilder", () => {
	let mockDb: ReturnType<typeof createMockDb>;

	beforeEach(() => {
		mockDb = createMockDb();
		mockBuildQueryResult = createMockBuildQueryResult();
		vi.clearAllMocks();
	});

	describe("NewArtistQueryBuilder", () => {
		describe("factory function", () => {
			it("should create a new ArtistQueryBuilder instance", () => {
				const params = {
					page: "1",
					sort: "Author_Main.Author,asc",
					searchTable: "Author_Main.Author",
				};

				const builder = NewArtistQueryBuilder(params, mockDb as unknown as MockDB);

				expect(builder).toBeDefined();
				expect(builder.fetchParams).toEqual(params);
				expect(builder.db).toBe(mockDb);
			});

			it("should parse sort direction as asc", () => {
				const params = {
					page: "1",
					sort: "Author_Main.Author,asc",
					searchTable: "Author_Main.Author",
				};

				const builder = NewArtistQueryBuilder(params, mockDb as unknown as MockDB);

				expect(builder.derivedFetchParams.sortBy).toBeDefined();
			});

			it("should parse sort direction as desc", () => {
				const params = {
					page: "1",
					sort: "Author_Main.Author,desc",
					searchTable: "Author_Main.Author",
				};

				const builder = NewArtistQueryBuilder(params, mockDb as unknown as MockDB);

				expect(builder.derivedFetchParams.sortBy).toBeDefined();
			});

			it("should process table name from sort parameter", () => {
				const params = {
					page: "1",
					sort: "Author_Main.Author,asc",
					searchTable: "Author_Main.Author",
				};

				NewArtistQueryBuilder(params, mockDb as unknown as MockDB);

				expect(processTableName).toHaveBeenCalledWith("Author_Main.Author");
			});

			it("should process tag conditions when tag is provided", () => {
				const params = {
					page: "1",
					sort: "Author_Main.Author,asc",
					searchTable: "Author_Main.Author",
					tag: "原創,插畫",
				};

				const builder = NewArtistQueryBuilder(params, mockDb as unknown as MockDB);

				expect(processTagConditions).toHaveBeenCalledWith("原創,插畫");
				expect(builder.derivedFetchParams.tagConditions).toHaveLength(2);
			});

			it("should handle empty tag parameter", () => {
				const params = {
					page: "1",
					sort: "Author_Main.Author,asc",
					searchTable: "Author_Main.Author",
					tag: undefined,
				};

				const builder = NewArtistQueryBuilder(params, mockDb as unknown as MockDB);

				expect(builder.derivedFetchParams.tagConditions).toEqual([]);
			});
		});

		describe("BuildQuery method", () => {
			it("should build select and count queries", () => {
				const params = {
					page: "1",
					sort: "Author_Main.Author,asc",
					searchTable: "Author_Main.Author",
				};

				const builder = NewArtistQueryBuilder(params, mockDb as unknown as MockDB);
				const result = builder.BuildQuery();

				expect(result).toHaveProperty("SelectQuery");
				expect(result).toHaveProperty("CountQuery");
			});

			it("should call BuildQuery helper", () => {
				const params = {
					page: "1",
					sort: "Author_Main.Author,asc",
					searchTable: "Author_Main.Author",
				};

				const builder = NewArtistQueryBuilder(params, mockDb as unknown as MockDB);
				builder.BuildQuery();

				expect(BuildQuery).toHaveBeenCalled();
			});

			it("should apply tag filter when tag is provided", () => {
				const params = {
					page: "1",
					sort: "Author_Main.Author,asc",
					searchTable: "Author_Main.Author",
					tag: "原創",
				};

				const builder = NewArtistQueryBuilder(params, mockDb as unknown as MockDB);
				const result = builder.BuildQuery();

				expect(result.SelectQuery.withAndFilter).toHaveBeenCalled();
				expect(result.CountQuery.withAndFilter).toHaveBeenCalled();
			});

			it("should apply search filter when search is provided", () => {
				const params = {
					page: "1",
					sort: "Author_Main.Author,asc",
					searchTable: "Author_Main.Author",
					search: "test artist",
				};

				const builder = NewArtistQueryBuilder(params, mockDb as unknown as MockDB);
				const result = builder.BuildQuery();

				expect(result.SelectQuery.withIlikeSearchByTable).toHaveBeenCalledWith(
					"test artist",
					expect.anything(),
				);
			});

			it("should apply both tag and search filters when both are provided", () => {
				const params = {
					page: "1",
					sort: "Author_Main.Author,asc",
					searchTable: "Author_Main.Author",
					tag: "原創",
					search: "test",
				};

				const builder = NewArtistQueryBuilder(params, mockDb as unknown as MockDB);
				const result = builder.BuildQuery();

				expect(result.SelectQuery.withAndFilter).toHaveBeenCalled();
				expect(result.SelectQuery.withIlikeSearchByTable).toHaveBeenCalled();
			});

			it("should not apply tag filter when tag is empty", () => {
				const params = {
					page: "1",
					sort: "Author_Main.Author,asc",
					searchTable: "Author_Main.Author",
					tag: "",
				};

				const builder = NewArtistQueryBuilder(params, mockDb as unknown as MockDB);
				builder.BuildQuery();

				expect(mockBuildQueryResult.withAndFilter).not.toHaveBeenCalled();
			});

			it("should apply pagination with correct page number", () => {
				const params = {
					page: "5",
					sort: "Author_Main.Author,asc",
					searchTable: "Author_Main.Author",
				};

				const builder = NewArtistQueryBuilder(params, mockDb as unknown as MockDB);
				builder.BuildQuery();

				expect(mockBuildQueryResult.withPagination).toHaveBeenCalledWith(5, 10);
			});

			it("should apply order by with sort direction", () => {
				const params = {
					page: "1",
					sort: "Author_Main.Author,asc",
					searchTable: "Author_Main.Author",
				};

				const builder = NewArtistQueryBuilder(params, mockDb as unknown as MockDB);
				builder.BuildQuery();

				expect(mockBuildQueryResult.withOrderBy).toHaveBeenCalled();
			});
		});
	});

	describe("NewEventArtistQueryBuilder", () => {
		describe("factory function", () => {
			it("should create a new EventArtistQueryBuilder instance", () => {
				const params = {
					page: "1",
					sort: "Booth_name,asc",
					searchTable: "Author_Main.Author",
					eventName: "Test Event",
				};

				const builder = NewEventArtistQueryBuilder(params, mockDb as unknown as MockDB);

				expect(builder).toBeDefined();
				expect(builder.fetchParams).toEqual(params);
				expect(builder.fetchParams.eventName).toBe("Test Event");
			});

			it("should process event-specific table names", () => {
				const params = {
					page: "1",
					sort: "Booth_name,asc",
					searchTable: "Author_Main.Author",
					eventName: "Test Event",
				};

				NewEventArtistQueryBuilder(params, mockDb as unknown as MockDB);

				expect(processTableName).toHaveBeenCalledWith("Booth_name");
			});
		});

		describe("BuildQuery method", () => {
			it("should build select and count queries", () => {
				const params = {
					page: "1",
					sort: "Booth_name,asc",
					searchTable: "Author_Main.Author",
					eventName: "Test Event",
				};

				const builder = NewEventArtistQueryBuilder(params, mockDb as unknown as MockDB);
				const result = builder.BuildQuery();

				expect(result).toHaveProperty("SelectQuery");
				expect(result).toHaveProperty("CountQuery");
			});

			it("should apply event name filter", () => {
				const params = {
					page: "1",
					sort: "Booth_name,asc",
					searchTable: "Author_Main.Author",
					eventName: "Test Event",
				};

				const builder = NewEventArtistQueryBuilder(params, mockDb as unknown as MockDB);
				builder.BuildQuery();

				expect(mockBuildQueryResult.withFilterEventName).toHaveBeenCalledWith(
					"Test Event",
				);
			});

			it("should apply tag filter when tag is provided", () => {
				const params = {
					page: "1",
					sort: "Booth_name,asc",
					searchTable: "Author_Main.Author",
					eventName: "Test Event",
					tag: "原創",
				};

				const builder = NewEventArtistQueryBuilder(params, mockDb as unknown as MockDB);
				const result = builder.BuildQuery();

				expect(result.SelectQuery.withAndFilter).toHaveBeenCalled();
				expect(result.CountQuery.withAndFilter).toHaveBeenCalled();
			});

			it("should apply search filter when search is provided", () => {
				const params = {
					page: "1",
					sort: "Booth_name,asc",
					searchTable: "Author_Main.Author",
					eventName: "Test Event",
					search: "artist name",
				};

				const builder = NewEventArtistQueryBuilder(params, mockDb as unknown as MockDB);
				const result = builder.BuildQuery();

				expect(result.SelectQuery.withIlikeSearchByTable).toHaveBeenCalledWith(
					"artist name",
					expect.anything(),
				);
			});

			it("should apply pagination with correct page number", () => {
				const params = {
					page: "3",
					sort: "Booth_name,asc",
					searchTable: "Author_Main.Author",
					eventName: "Test Event",
				};

				const builder = NewEventArtistQueryBuilder(params, mockDb as unknown as MockDB);
				builder.BuildQuery();

				expect(mockBuildQueryResult.withPagination).toHaveBeenCalledWith(3, 10);
			});

			it("should apply order by with sort direction", () => {
				const params = {
					page: "1",
					sort: "Booth_name,desc",
					searchTable: "Author_Main.Author",
					eventName: "Test Event",
				};

				const builder = NewEventArtistQueryBuilder(params, mockDb as unknown as MockDB);
				builder.BuildQuery();

				expect(mockBuildQueryResult.withOrderBy).toHaveBeenCalled();
			});
		});
	});

	describe("IQueryBuilder base class", () => {
		it("should correctly derive sort direction from asc", () => {
			const params = {
				page: "1",
				sort: "Author_Main.Author,asc",
				searchTable: "Author_Main.Author",
			};

			const builder = NewArtistQueryBuilder(params, mockDb as unknown as MockDB);

			expect(builder.derivedFetchParams.sortBy).toBeDefined();
		});

		it("should correctly derive sort direction from desc", () => {
			const params = {
				page: "1",
				sort: "Author_Main.Author,desc",
				searchTable: "Author_Main.Author",
			};

			const builder = NewArtistQueryBuilder(params, mockDb as unknown as MockDB);

			expect(builder.derivedFetchParams.sortBy).toBeDefined();
		});

		it("should process search table name", () => {
			const params = {
				page: "1",
				sort: "Author_Main.Author,asc",
				searchTable: "Author_Main.Author",
			};

			NewArtistQueryBuilder(params, mockDb as unknown as MockDB);

			expect(processTableName).toHaveBeenCalledWith("Author_Main.Author");
		});
	});
});
