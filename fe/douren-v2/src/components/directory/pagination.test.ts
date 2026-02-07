import { describe, expect, it } from "vitest";
import { getPaginationPageNumbers, toPaginationParams } from "./pagination";

describe("toPaginationParams", () => {
  it("converts API pagination data into shared pagination params", () => {
    const pagination = toPaginationParams({
      currentPage: 3,
      totalPage: 8,
      totalCount: 95,
      pageSize: 12,
    });

    expect(pagination).toEqual({
      currentPage: 3,
      totalPages: 8,
      totalItems: 95,
      itemsPerPage: 12,
      disabled: false,
    });
  });

  it("clamps invalid values to safe pagination defaults", () => {
    const pagination = toPaginationParams({
      currentPage: -5,
      totalPage: 0,
      totalCount: -10,
      pageSize: 0,
      disabled: true,
    });

    expect(pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 1,
      disabled: true,
    });
  });

  it("clamps current page to total pages", () => {
    const pagination = toPaginationParams({
      currentPage: 99,
      totalPage: 4,
      totalCount: 40,
      pageSize: 10,
    });

    expect(pagination.currentPage).toBe(4);
  });
});

describe("getPaginationPageNumbers", () => {
  it("returns all pages when total pages are small", () => {
    expect(getPaginationPageNumbers(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("returns leading ellipsis when current page is near the end", () => {
    expect(getPaginationPageNumbers(9, 10)).toEqual([1, "...", 6, 7, 8, 9, 10]);
  });

  it("returns both ellipses when current page is in the middle", () => {
    expect(getPaginationPageNumbers(5, 10)).toEqual([
      1,
      "...",
      4,
      5,
      6,
      "...",
      10,
    ]);
  });
});
