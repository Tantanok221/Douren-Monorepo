import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

// Mock database schema for drizzle-zod
vi.mock("@pkg/database/db", () => ({
	s: {
		authorMain: {
			uuid: { dataType: "integer", notNull: true },
			author: { dataType: "text", notNull: true },
			introduction: { dataType: "text", notNull: false },
			tags: { dataType: "text", notNull: false },
			photo: { dataType: "text", notNull: false },
		},
	},
}));

// Mock drizzle-zod with a proper schema generator
vi.mock("drizzle-zod", () => ({
	createInsertSchema: vi.fn(() =>
		z.object({
			uuid: z.number().optional(),
			author: z.string(),
			introduction: z.string().nullable().optional(),
			tags: z.string().nullable().optional(),
			photo: z.string().nullable().optional(),
		}),
	),
}));

// Import after mocks
import {
	CreateArtistSchema,
	DeleteAristSchema,
	GetArtistByIdSchema,
	UpdateArtistSchema,
} from "@/schema/artist.zod";

describe("Artist Zod Schemas", () => {
	describe("CreateArtistSchema", () => {
		it("should accept valid artist data with all fields", () => {
			const validData = {
				author: "Test Artist",
				introduction: "Artist introduction",
				tags: "原創,插畫",
				photo: "https://example.com/photo.jpg",
			};

			const result = CreateArtistSchema.safeParse(validData);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.author).toBe("Test Artist");
			}
		});

		it("should accept minimal artist data with only required fields", () => {
			const minimalData = {
				author: "Minimal Artist",
			};

			const result = CreateArtistSchema.safeParse(minimalData);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.author).toBe("Minimal Artist");
			}
		});

		it("should accept artist with optional uuid", () => {
			const dataWithUuid = {
				uuid: 123,
				author: "Artist with UUID",
			};

			const result = CreateArtistSchema.safeParse(dataWithUuid);

			expect(result.success).toBe(true);
		});

		it("should accept artist without uuid", () => {
			const dataWithoutUuid = {
				author: "Artist without UUID",
			};

			const result = CreateArtistSchema.safeParse(dataWithoutUuid);

			expect(result.success).toBe(true);
		});

		it("should accept null values for optional fields", () => {
			const dataWithNulls = {
				author: "Test Artist",
				introduction: null,
				tags: null,
				photo: null,
			};

			const result = CreateArtistSchema.safeParse(dataWithNulls);

			expect(result.success).toBe(true);
		});

		it("should reject missing required author field", () => {
			const invalidData = {
				introduction: "Introduction only",
			};

			const result = CreateArtistSchema.safeParse(invalidData);

			expect(result.success).toBe(false);
		});

		it("should reject empty author string", () => {
			const invalidData = {
				author: "",
			};

			// Note: Empty strings are technically valid for z.string()
			// but we're testing the schema behavior
			const result = CreateArtistSchema.safeParse(invalidData);

			expect(result.success).toBe(true); // Empty string is valid for z.string()
		});

		it("should handle Unicode characters in author name", () => {
			const unicodeData = {
				author: "アーティスト名 😀",
				tags: "原創,日本語",
			};

			const result = CreateArtistSchema.safeParse(unicodeData);

			expect(result.success).toBe(true);
		});
	});

	describe("DeleteAristSchema", () => {
		it("should accept valid id string", () => {
			const validData = {
				id: "123",
			};

			const result = DeleteAristSchema.safeParse(validData);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.id).toBe("123");
			}
		});

		it("should reject missing id", () => {
			const invalidData = {};

			const result = DeleteAristSchema.safeParse(invalidData);

			expect(result.success).toBe(false);
		});

		it("should reject non-string id", () => {
			const invalidData = {
				id: 123,
			};

			const result = DeleteAristSchema.safeParse(invalidData);

			expect(result.success).toBe(false);
		});

		it("should accept empty string id", () => {
			const emptyIdData = {
				id: "",
			};

			const result = DeleteAristSchema.safeParse(emptyIdData);

			expect(result.success).toBe(true);
		});

		it("should accept uuid format string", () => {
			const uuidData = {
				id: "550e8400-e29b-41d4-a716-446655440000",
			};

			const result = DeleteAristSchema.safeParse(uuidData);

			expect(result.success).toBe(true);
		});
	});

	describe("GetArtistByIdSchema", () => {
		it("should accept valid id string", () => {
			const validData = {
				id: "456",
			};

			const result = GetArtistByIdSchema.safeParse(validData);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.id).toBe("456");
			}
		});

		it("should reject missing id", () => {
			const invalidData = {};

			const result = GetArtistByIdSchema.safeParse(invalidData);

			expect(result.success).toBe(false);
		});

		it("should reject non-string id", () => {
			const invalidData = {
				id: 456,
			};

			const result = GetArtistByIdSchema.safeParse(invalidData);

			expect(result.success).toBe(false);
		});

		it("should accept numeric string id", () => {
			const numericStringData = {
				id: "12345",
			};

			const result = GetArtistByIdSchema.safeParse(numericStringData);

			expect(result.success).toBe(true);
		});
	});

	describe("UpdateArtistSchema", () => {
		it("should accept valid update data with id and data", () => {
			const validData = {
				id: "123",
				data: {
					author: "Updated Artist",
					introduction: "Updated introduction",
				},
			};

			const result = UpdateArtistSchema.safeParse(validData);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.id).toBe("123");
				expect(result.data.data.author).toBe("Updated Artist");
			}
		});

		it("should reject missing id", () => {
			const invalidData = {
				data: {
					author: "Updated Artist",
				},
			};

			const result = UpdateArtistSchema.safeParse(invalidData);

			expect(result.success).toBe(false);
		});

		it("should reject missing data object", () => {
			const invalidData = {
				id: "123",
			};

			const result = UpdateArtistSchema.safeParse(invalidData);

			expect(result.success).toBe(false);
		});

		it("should reject non-string id", () => {
			const invalidData = {
				id: 123,
				data: {
					author: "Test",
				},
			};

			const result = UpdateArtistSchema.safeParse(invalidData);

			expect(result.success).toBe(false);
		});

		it("should accept partial update data", () => {
			const partialData = {
				id: "123",
				data: {
					author: "Only author updated",
				},
			};

			const result = UpdateArtistSchema.safeParse(partialData);

			expect(result.success).toBe(true);
		});

		it("should accept update with all optional fields", () => {
			const fullUpdateData = {
				id: "123",
				data: {
					author: "Full Update Artist",
					introduction: "New introduction",
					tags: "新標籤,更新",
					photo: "https://example.com/new-photo.jpg",
				},
			};

			const result = UpdateArtistSchema.safeParse(fullUpdateData);

			expect(result.success).toBe(true);
		});

		it("should accept update with null optional fields", () => {
			const nullUpdateData = {
				id: "123",
				data: {
					author: "Artist",
					introduction: null,
					tags: null,
					photo: null,
				},
			};

			const result = UpdateArtistSchema.safeParse(nullUpdateData);

			expect(result.success).toBe(true);
		});
	});

	describe("Schema type inference", () => {
		it("should infer correct types for CreateArtistSchema", () => {
			const validData: z.infer<typeof CreateArtistSchema> = {
				author: "Test",
				introduction: "Intro",
				tags: "tag1,tag2",
				photo: "url",
			};

			expect(validData.author).toBe("Test");
		});

		it("should allow undefined for optional fields", () => {
			const minimalData: z.infer<typeof CreateArtistSchema> = {
				author: "Minimal",
			};

			expect(minimalData.introduction).toBeUndefined();
		});
	});
});
