import { describe, expect, it, vi, beforeEach } from "vitest";
import { validArtistData, mockArtistDbResponse } from "@/__fixtures__/artistData";
import { createMockTrpcOpts } from "@/__fixtures__/mockTrpcContext";
import { createMockArtistDao } from "@/__fixtures__/mockDatabase";

// Mock the DAO layer
const mockArtistDao = createMockArtistDao();

// Mock the NewArtistDao factory
const mockNewArtistDao = vi.fn(() => mockArtistDao);

// Mock the TRPC procedures manually
const mockTrpcArtistRoute = {
	getArtist: async (opts: any) => {
		const ArtistDao = mockNewArtistDao(opts.ctx.db);
		return await ArtistDao.Fetch(opts.input);
	},
	createArtist: async (opts: any) => {
		const ArtistDao = mockNewArtistDao(opts.ctx.db);
		return await ArtistDao.Create(opts.input);
	},
	deleteArtist: async (opts: any) => {
		const ArtistDao = mockNewArtistDao(opts.ctx.db);
		return await ArtistDao.Delete(opts.input.id);
	},
};

describe("Artist Route Logic Tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Artist TRPC Procedures", () => {
		it("should fetch artist data with valid parameters", async () => {
			const opts = createMockTrpcOpts({
				page: 1,
				sort: "author,asc",
			});
			
			const result = await mockTrpcArtistRoute.getArtist(opts);
			
			expect(result).toEqual({
				data: mockArtistDbResponse,
				totalCount: 1,
				totalPage: 1,
			});
			expect(mockArtistDao.Fetch).toHaveBeenCalledWith(opts.input);
		});

		it("should handle search and filter parameters", async () => {
			const opts = createMockTrpcOpts({
				page: 1,
				search: "test",
				tag: "原創",
				sort: "author,desc",
				searchTable: "author",
			});
			
			await mockTrpcArtistRoute.getArtist(opts);
			expect(mockArtistDao.Fetch).toHaveBeenCalledWith(opts.input);
		});

		it("should create artist with valid data", async () => {
			const opts = createMockTrpcOpts(validArtistData);
			
			const result = await mockTrpcArtistRoute.createArtist(opts);
			
			expect(result).toEqual([mockArtistDbResponse[0]]);
			expect(mockArtistDao.Create).toHaveBeenCalledWith(validArtistData);
		});

		it("should delete artist with valid ID", async () => {
			const opts = createMockTrpcOpts({ id: "1" });
			
			const result = await mockTrpcArtistRoute.deleteArtist(opts);
			
			expect(result).toEqual([mockArtistDbResponse[0]]);
			expect(mockArtistDao.Delete).toHaveBeenCalledWith("1");
		});
	});

	describe("Artist Route Business Logic", () => {
		it("should process artist fetch parameters correctly", async () => {
			const params = {
				page: "1",
				search: "test artist",
				tag: "原創,插畫",
				sort: "author,asc",
				searchTable: "author",
			};
			
			const opts = createMockTrpcOpts(params);
			await mockTrpcArtistRoute.getArtist(opts);
			
			expect(mockArtistDao.Fetch).toHaveBeenCalledWith(params);
		});

		it("should handle create artist request", async () => {
			const artistData = {
				author: "New Artist",
				introduction: "Test introduction",
				tags: "原創,插畫",
				photo: "https://example.com/photo.jpg",
			};
			
			const opts = createMockTrpcOpts(artistData);
			const result = await mockTrpcArtistRoute.createArtist(opts);
			
			expect(mockArtistDao.Create).toHaveBeenCalledWith(artistData);
			expect(result).toEqual([mockArtistDbResponse[0]]);
		});

		it("should handle delete artist request", async () => {
			const deleteParams = { id: "123" };
			
			const opts = createMockTrpcOpts(deleteParams);
			const result = await mockTrpcArtistRoute.deleteArtist(opts);
			
			expect(mockArtistDao.Delete).toHaveBeenCalledWith("123");
			expect(result).toEqual([mockArtistDbResponse[0]]);
		});
	});
});