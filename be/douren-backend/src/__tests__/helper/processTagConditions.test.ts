import { describe, expect, it, vi } from "vitest";
import { processTagConditions } from "@/helper/processTagConditions";

// Mock drizzle-orm
vi.mock("drizzle-orm", () => ({
	eq: vi.fn((column, value) => ({ column, value, type: "eq" })),
	inArray: vi.fn((column, values) => ({ column, values, type: "inArray" })),
}));

// Mock database schema
vi.mock("@pkg/database/db", () => ({
	s: {
		tag: {
			tag: "tag.tag",
		},
	},
}));

describe("processTagConditions", () => {
	it("should return correct conditions for single tag", () => {
		const result = processTagConditions("原創");

		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({
			column: "tag.tag",
			value: "原創",
			type: "eq",
		});
	});

	it("should return correct conditions for multiple comma-separated tags", () => {
		const result = processTagConditions("原創,插畫,設計");

		expect(result).toHaveLength(3);
		expect(result[0]).toEqual({
			column: "tag.tag",
			value: "原創",
			type: "eq",
		});
		expect(result[1]).toEqual({
			column: "tag.tag",
			value: "插畫",
			type: "eq",
		});
		expect(result[2]).toEqual({
			column: "tag.tag",
			value: "設計",
			type: "eq",
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

	it("should handle tags with spaces (trimmed)", () => {
		const result = processTagConditions("原創, 插畫, 設計");

		expect(result).toHaveLength(3);
		expect(result[0]).toEqual({
			column: "tag.tag",
			value: "原創",
			type: "eq",
		});
		expect(result[1]).toEqual({
			column: "tag.tag",
			value: "插畫",
			type: "eq",
		});
		expect(result[2]).toEqual({
			column: "tag.tag",
			value: "設計",
			type: "eq",
		});
	});

	it("should handle single character tags", () => {
		const result = processTagConditions("A,B,C");

		expect(result).toHaveLength(3);
		expect(result[0]).toEqual({
			column: "tag.tag",
			value: "A",
			type: "eq",
		});
	});

	it("should filter out empty tags in comma-separated list", () => {
		const result = processTagConditions("原創,,插畫");

		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({
			column: "tag.tag",
			value: "原創",
			type: "eq",
		});
		expect(result[1]).toEqual({
			column: "tag.tag",
			value: "插畫",
			type: "eq",
		});
	});
});