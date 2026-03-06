import { describe, expect, it } from "vitest";
import { createPaginationObject } from "@/helper/createPaginationObject";

describe("createPaginationObject", () => {
	const mockData = [
		{ id: 1, name: "Item 1" },
		{ id: 2, name: "Item 2" },
	];

	describe("first page scenario", () => {
		it("should create correct pagination object for first page", () => {
			const result = createPaginationObject(mockData, 1, 10, 25);

			expect(result).toEqual({
				data: mockData,
				totalCount: 25,
				totalPage: 3,
				nextPageAvailable: true,
				previousPageAvailable: false,
				pageSize: 10,
			});
		});
	});

	describe("middle page scenario", () => {
		it("should create correct pagination object for middle page", () => {
			const result = createPaginationObject(mockData, 2, 10, 25);

			expect(result).toEqual({
				data: mockData,
				totalCount: 25,
				totalPage: 3,
				nextPageAvailable: true,
				previousPageAvailable: true,
				pageSize: 10,
			});
		});
	});

	describe("last page scenario", () => {
		it("should create correct pagination object for last page", () => {
			const result = createPaginationObject(mockData, 3, 10, 25);

			expect(result).toEqual({
				data: mockData,
				totalCount: 25,
				totalPage: 3,
				nextPageAvailable: false,
				previousPageAvailable: true,
				pageSize: 10,
			});
		});
	});

	describe("edge cases", () => {
		it("should handle 0 results", () => {
			const result = createPaginationObject([], 1, 10, 0);

			expect(result).toEqual({
				data: [],
				totalCount: 0,
				totalPage: 0,
				nextPageAvailable: false,
				previousPageAvailable: false,
				pageSize: 10,
			});
		});

		it("should handle single page scenario", () => {
			const result = createPaginationObject(mockData, 1, 10, 5);

			expect(result).toEqual({
				data: mockData,
				totalCount: 5,
				totalPage: 1,
				nextPageAvailable: false,
				previousPageAvailable: false,
				pageSize: 10,
			});
		});

		it("should handle exact page size match", () => {
			const result = createPaginationObject(mockData, 1, 10, 10);

			expect(result).toEqual({
				data: mockData,
				totalCount: 10,
				totalPage: 1,
				nextPageAvailable: false,
				previousPageAvailable: false,
				pageSize: 10,
			});
		});

		it("should handle large dataset", () => {
			const result = createPaginationObject(mockData, 5, 20, 100);

			expect(result).toEqual({
				data: mockData,
				totalCount: 100,
				totalPage: 5,
				nextPageAvailable: false,
				previousPageAvailable: true,
				pageSize: 20,
			});
		});

		it("should handle small page size", () => {
			const result = createPaginationObject(mockData, 2, 1, 3);

			expect(result).toEqual({
				data: mockData,
				totalCount: 3,
				totalPage: 3,
				nextPageAvailable: true,
				previousPageAvailable: true,
				pageSize: 1,
			});
		});
	});

	describe("mathematical correctness", () => {
		it("should calculate total pages correctly with remainder", () => {
			const result = createPaginationObject(mockData, 1, 7, 22);

			expect(result.totalPage).toBe(4); // Math.ceil(22/7) = 4
		});

		it("should calculate total pages correctly without remainder", () => {
			const result = createPaginationObject(mockData, 1, 5, 20);

			expect(result.totalPage).toBe(4); // Math.ceil(20/5) = 4
		});
	});

	describe("generic data types", () => {
		it("should work with string data", () => {
			const stringData = "test string";
			const result = createPaginationObject(stringData, 1, 10, 1);

			expect(result.data).toBe(stringData);
		});

		it("should work with number data", () => {
			const numberData = 42;
			const result = createPaginationObject(numberData, 1, 10, 1);

			expect(result.data).toBe(numberData);
		});

		it("should work with object data", () => {
			const objectData = { key: "value", nested: { prop: 123 } };
			const result = createPaginationObject(objectData, 1, 10, 1);

			expect(result.data).toEqual(objectData);
		});
	});
});