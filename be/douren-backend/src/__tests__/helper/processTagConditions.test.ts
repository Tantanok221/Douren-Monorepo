import { describe, expect, it, vi } from "vitest";
import { processTagConditions } from "@/helper/processTagConditions";

// Mock drizzle-orm
vi.mock("drizzle-orm", () => ({
	ilike: vi.fn((column, pattern) => ({ column, pattern, type: "ilike" })),
}));

// Mock database schema
vi.mock("@pkg/database/db", () => ({
	s: {
		authorMain: {
			tags: "authorMain.tags",
		},
	},
}));

describe("processTagConditions", () => {
	it("should return correct conditions for single tag", () => {
		const result = processTagConditions("原創");

		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({
			column: "authorMain.tags",
			pattern: "%原創%",
			type: "ilike",
		});
	});

	it("should return correct conditions for multiple comma-separated tags", () => {
		const result = processTagConditions("原創,插畫,設計");

		expect(result).toHaveLength(3);
		expect(result[0]).toEqual({
			column: "authorMain.tags",
			pattern: "%原創%",
			type: "ilike",
		});
		expect(result[1]).toEqual({
			column: "authorMain.tags",
			pattern: "%插畫%",
			type: "ilike",
		});
		expect(result[2]).toEqual({
			column: "authorMain.tags",
			pattern: "%設計%",
			type: "ilike",
		});
	});

	it("should return empty array for empty string", () => {
		const result = processTagConditions("");

		expect(result).toEqual([]);
	});

	it("should return empty array for undefined input", () => {
		const result = processTagConditions(undefined);

		expect(result).toEqual([]);
	});

	it("should handle tags with spaces", () => {
		const result = processTagConditions("原創, 插畫, 設計");

		expect(result).toHaveLength(3);
		expect(result[0]).toEqual({
			column: "authorMain.tags",
			pattern: "%原創%",
			type: "ilike",
		});
		expect(result[1]).toEqual({
			column: "authorMain.tags",
			pattern: "% 插畫%",
			type: "ilike",
		});
		expect(result[2]).toEqual({
			column: "authorMain.tags",
			pattern: "% 設計%",
			type: "ilike",
		});
	});

	it("should handle single character tags", () => {
		const result = processTagConditions("A,B,C");

		expect(result).toHaveLength(3);
		expect(result[0]).toEqual({
			column: "authorMain.tags",
			pattern: "%A%",
			type: "ilike",
		});
	});

	it("should handle empty tags in comma-separated list", () => {
		const result = processTagConditions("原創,,插畫");

		expect(result).toHaveLength(3);
		expect(result[1]).toEqual({
			column: "authorMain.tags",
			pattern: "%%",
			type: "ilike",
		});
	});
});