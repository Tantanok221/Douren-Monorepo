import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

// Mock database schema for drizzle-zod
vi.mock("@pkg/database/db", () => ({
	s: {
		eventDm: {
			uuid: { dataType: "integer", notNull: true },
			artistId: { dataType: "integer", notNull: false },
			eventId: { dataType: "integer", notNull: false },
			boothName: { dataType: "text", notNull: false },
			locationDay01: { dataType: "text", notNull: false },
			locationDay02: { dataType: "text", notNull: false },
			locationDay03: { dataType: "text", notNull: false },
			dm: { dataType: "text", notNull: false },
		},
		event: {
			id: { dataType: "integer", notNull: true },
			name: { dataType: "text", notNull: true },
			date: { dataType: "text", notNull: false },
			location: { dataType: "text", notNull: false },
		},
	},
}));

// Mock drizzle-zod with proper schema generators
vi.mock("drizzle-zod", () => ({
	createInsertSchema: vi.fn((table, overrides) => {
		// Return different schemas based on the table
		if (table === "event_dm" || (table && table.uuid)) {
			const baseSchema = z.object({
				uuid: z.number(),
				artistId: z.number().nullable().optional(),
				eventId: z.number().nullable().optional(),
				boothName: z.string().nullable().optional(),
				locationDay01: z.string().nullable().optional(),
				locationDay02: z.string().nullable().optional(),
				locationDay03: z.string().nullable().optional(),
				dm: z.string().nullable().optional(),
			});

			// Apply overrides if provided (for making uuid optional)
			if (overrides?.uuid) {
				return z.object({
					uuid: z.number().optional(),
					artistId: z.number().nullable().optional(),
					eventId: z.number().nullable().optional(),
					boothName: z.string().nullable().optional(),
					locationDay01: z.string().nullable().optional(),
					locationDay02: z.string().nullable().optional(),
					locationDay03: z.string().nullable().optional(),
					dm: z.string().nullable().optional(),
				});
			}
			return baseSchema;
		}

		// Event table schema
		if (table && table.id) {
			const baseSchema = z.object({
				id: z.number(),
				name: z.string(),
				date: z.string().nullable().optional(),
				location: z.string().nullable().optional(),
			});

			if (overrides?.id) {
				return z.object({
					id: z.number().optional(),
					name: z.string(),
					date: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
				});
			}
			return baseSchema;
		}

		return z.object({
			uuid: z.number().optional(),
			artistId: z.number().nullable().optional(),
			eventId: z.number().nullable().optional(),
			boothName: z.string().nullable().optional(),
		});
	}),
}));

// Import after mocks
import {
	CreateEventArtistSchema,
	PutEventArtistSchema,
	CreateEventSchema,
	GetEventArtistByIdSchema,
	UpdateEventArtistSchema,
} from "@/schema/event.zod";

describe("Event Zod Schemas", () => {
	describe("CreateEventArtistSchema", () => {
		it("should accept valid event artist data", () => {
			const validData = {
				artistId: 1,
				eventId: 1,
				boothName: "Booth A",
				locationDay01: "A-01",
				locationDay02: "A-02",
				locationDay03: "A-03",
				dm: "Sample DM",
			};

			const result = CreateEventArtistSchema.safeParse(validData);

			expect(result.success).toBe(true);
		});

		it("should accept data without uuid (optional)", () => {
			const dataWithoutUuid = {
				artistId: 1,
				eventId: 1,
				boothName: "Booth B",
			};

			const result = CreateEventArtistSchema.safeParse(dataWithoutUuid);

			expect(result.success).toBe(true);
		});

		it("should accept minimal data with only optional fields", () => {
			const minimalData = {};

			const result = CreateEventArtistSchema.safeParse(minimalData);

			expect(result.success).toBe(true);
		});

		it("should accept null values for optional fields", () => {
			const dataWithNulls = {
				artistId: null,
				eventId: null,
				boothName: null,
				locationDay01: null,
				locationDay02: null,
				locationDay03: null,
				dm: null,
			};

			const result = CreateEventArtistSchema.safeParse(dataWithNulls);

			expect(result.success).toBe(true);
		});

		it("should reject non-numeric artistId", () => {
			const invalidData = {
				artistId: "not-a-number",
				eventId: 1,
			};

			const result = CreateEventArtistSchema.safeParse(invalidData);

			expect(result.success).toBe(false);
		});

		it("should handle location strings", () => {
			const locationData = {
				locationDay01: "Hall A, Booth 101",
				locationDay02: "Hall B, Booth 202",
				locationDay03: "Hall C, Booth 303",
			};

			const result = CreateEventArtistSchema.safeParse(locationData);

			expect(result.success).toBe(true);
		});
	});

	describe("PutEventArtistSchema", () => {
		it("should require uuid for updates", () => {
			const validData = {
				uuid: 123,
				artistId: 1,
				eventId: 1,
				boothName: "Updated Booth",
			};

			const result = PutEventArtistSchema.safeParse(validData);

			expect(result.success).toBe(true);
		});

		it("should reject missing uuid", () => {
			const invalidData = {
				artistId: 1,
				eventId: 1,
				boothName: "No UUID",
			};

			const result = PutEventArtistSchema.safeParse(invalidData);

			expect(result.success).toBe(false);
		});

		it("should accept full update data", () => {
			const fullData = {
				uuid: 456,
				artistId: 2,
				eventId: 2,
				boothName: "Full Update Booth",
				locationDay01: "New Location 1",
				locationDay02: "New Location 2",
				locationDay03: "New Location 3",
				dm: "Updated DM",
			};

			const result = PutEventArtistSchema.safeParse(fullData);

			expect(result.success).toBe(true);
		});
	});

	describe("CreateEventSchema", () => {
		it("should accept valid event data", () => {
			const validData = {
				name: "Test Event",
				date: "2024-06-01",
				location: "Convention Center",
			};

			const result = CreateEventSchema.safeParse(validData);

			expect(result.success).toBe(true);
		});

		it("should accept event with optional id", () => {
			const dataWithId = {
				id: 100,
				name: "Event with ID",
			};

			const result = CreateEventSchema.safeParse(dataWithId);

			expect(result.success).toBe(true);
		});

		it("should accept event without id", () => {
			const dataWithoutId = {
				name: "Event without ID",
			};

			const result = CreateEventSchema.safeParse(dataWithoutId);

			expect(result.success).toBe(true);
		});

		it("should require name field", () => {
			const invalidData = {
				date: "2024-06-01",
				location: "Somewhere",
			};

			const result = CreateEventSchema.safeParse(invalidData);

			expect(result.success).toBe(false);
		});

		it("should accept null values for optional fields", () => {
			const dataWithNulls = {
				name: "Event Name",
				date: null,
				location: null,
			};

			const result = CreateEventSchema.safeParse(dataWithNulls);

			expect(result.success).toBe(true);
		});

		it("should handle Unicode event names", () => {
			const unicodeData = {
				name: "コミックマーケット C100",
				location: "東京ビッグサイト",
			};

			const result = CreateEventSchema.safeParse(unicodeData);

			expect(result.success).toBe(true);
		});
	});

	describe("GetEventArtistByIdSchema", () => {
		it("should accept valid id string", () => {
			const validData = {
				id: "789",
			};

			const result = GetEventArtistByIdSchema.safeParse(validData);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.id).toBe("789");
			}
		});

		it("should reject missing id", () => {
			const invalidData = {};

			const result = GetEventArtistByIdSchema.safeParse(invalidData);

			expect(result.success).toBe(false);
		});

		it("should reject non-string id", () => {
			const invalidData = {
				id: 789,
			};

			const result = GetEventArtistByIdSchema.safeParse(invalidData);

			expect(result.success).toBe(false);
		});

		it("should accept empty string id", () => {
			const emptyIdData = {
				id: "",
			};

			const result = GetEventArtistByIdSchema.safeParse(emptyIdData);

			expect(result.success).toBe(true);
		});
	});

	describe("UpdateEventArtistSchema", () => {
		it("should accept valid update data", () => {
			const validData = {
				id: "123",
				data: {
					artistId: 1,
					eventId: 1,
					boothName: "Updated Booth",
				},
			};

			const result = UpdateEventArtistSchema.safeParse(validData);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.id).toBe("123");
			}
		});

		it("should reject missing id", () => {
			const invalidData = {
				data: {
					boothName: "Test",
				},
			};

			const result = UpdateEventArtistSchema.safeParse(invalidData);

			expect(result.success).toBe(false);
		});

		it("should reject missing data object", () => {
			const invalidData = {
				id: "123",
			};

			const result = UpdateEventArtistSchema.safeParse(invalidData);

			expect(result.success).toBe(false);
		});

		it("should reject non-string id", () => {
			const invalidData = {
				id: 123,
				data: {
					boothName: "Test",
				},
			};

			const result = UpdateEventArtistSchema.safeParse(invalidData);

			expect(result.success).toBe(false);
		});

		it("should accept partial update data", () => {
			const partialData = {
				id: "123",
				data: {
					boothName: "Only booth updated",
				},
			};

			const result = UpdateEventArtistSchema.safeParse(partialData);

			expect(result.success).toBe(true);
		});

		it("should accept update with all location fields", () => {
			const locationUpdateData = {
				id: "123",
				data: {
					locationDay01: "A-01",
					locationDay02: "B-02",
					locationDay03: "C-03",
				},
			};

			const result = UpdateEventArtistSchema.safeParse(locationUpdateData);

			expect(result.success).toBe(true);
		});

		it("should accept update with null values", () => {
			const nullUpdateData = {
				id: "123",
				data: {
					boothName: null,
					locationDay01: null,
					dm: null,
				},
			};

			const result = UpdateEventArtistSchema.safeParse(nullUpdateData);

			expect(result.success).toBe(true);
		});
	});

	describe("Schema type inference", () => {
		it("should infer correct types for CreateEventArtistSchema", () => {
			const validData: z.infer<typeof CreateEventArtistSchema> = {
				artistId: 1,
				eventId: 1,
				boothName: "Test Booth",
			};

			expect(validData.boothName).toBe("Test Booth");
		});

		it("should infer correct types for CreateEventSchema", () => {
			const validData: z.infer<typeof CreateEventSchema> = {
				name: "Test Event",
				date: "2024-01-01",
				location: "Test Location",
			};

			expect(validData.name).toBe("Test Event");
		});
	});
});
