import { describe, expect, it, vi } from "vitest";
import { processTableName } from "@/helper/processTableName";

// Mock database schema
vi.mock("@pkg/database/db", () => ({
	s: {
		authorMain: {
			author: "authorMain.author",
		},
		eventDm: {
			boothName: "eventDm.boothName",
			locationDay01: "eventDm.locationDay01",
			locationDay02: "eventDm.locationDay02",
			locationDay03: "eventDm.locationDay03",
		},
	},
}));

describe("processTableName", () => {
	describe("author table mapping", () => {
		it("should return author column for Author_Main(Author)", () => {
			const result = processTableName("Author_Main(Author)");

			expect(result).toBe("authorMain.author");
		});

		it("should return author column for Author_Main.Author", () => {
			const result = processTableName("Author_Main.Author");

			expect(result).toBe("authorMain.author");
		});
	});

	describe("event DM table mapping", () => {
		it("should return boothName column for Booth_name", () => {
			const result = processTableName("Booth_name");

			expect(result).toBe("eventDm.boothName");
		});

		it("should return locationDay01 column for Location_Day01", () => {
			const result = processTableName("Location_Day01");

			expect(result).toBe("eventDm.locationDay01");
		});

		it("should return locationDay02 column for Location_Day02", () => {
			const result = processTableName("Location_Day02");

			expect(result).toBe("eventDm.locationDay02");
		});

		it("should return locationDay03 column for Location_Day03", () => {
			const result = processTableName("Location_Day03");

			expect(result).toBe("eventDm.locationDay03");
		});
	});

	describe("default behavior", () => {
		it("should return author column for unknown table", () => {
			const result = processTableName("UnknownTable");

			expect(result).toBe("authorMain.author");
		});

		it("should return author column for empty string", () => {
			const result = processTableName("");

			expect(result).toBe("authorMain.author");
		});

		it("should return author column for null input", () => {
			const result = processTableName(null as any);

			expect(result).toBe("authorMain.author");
		});

		it("should return author column for undefined input", () => {
			const result = processTableName(undefined as any);

			expect(result).toBe("authorMain.author");
		});
	});

	describe("case sensitivity", () => {
		it("should be case sensitive for Author_Main(Author)", () => {
			const result = processTableName("author_main(author)");

			expect(result).toBe("authorMain.author"); // Falls back to default
		});

		it("should be case sensitive for booth_name", () => {
			const result = processTableName("booth_name");

			expect(result).toBe("authorMain.author"); // Falls back to default
		});
	});

	describe("partial matches", () => {
		it("should not match partial Author_Main string", () => {
			const result = processTableName("Author_Main");

			expect(result).toBe("authorMain.author"); // Falls back to default
		});

		it("should not match substring of Booth_name", () => {
			const result = processTableName("Booth");

			expect(result).toBe("authorMain.author"); // Falls back to default
		});
	});

	describe("special characters and formatting", () => {
		it("should handle table names with spaces", () => {
			const result = processTableName(" Author_Main.Author ");

			expect(result).toBe("authorMain.author"); // Falls back to default due to spaces
		});

		it("should handle table names with different separators", () => {
			const result = processTableName("Author_Main:Author");

			expect(result).toBe("authorMain.author"); // Falls back to default
		});
	});
});