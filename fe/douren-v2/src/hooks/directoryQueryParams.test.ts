import { describe, expect, it } from "vitest";
import type { DirectoryFilters } from "@/types/models";
import {
  buildDirectoryQueryParams,
  toSortedBookmarkIds,
} from "./useDirectoryQueryParams";

describe("buildDirectoryQueryParams", () => {
  it("maps all-filters values to server query params", () => {
    const filters: DirectoryFilters = {
      day: "全部",
      search: "",
      sort: "Author_Main(Author),asc",
      tag: "全部",
      page: 3,
    };

    expect(buildDirectoryQueryParams(filters)).toEqual({
      page: "3",
      sort: "Author_Main(Author),asc",
      search: undefined,
      tag: undefined,
      day: undefined,
      searchTable: "Author_Main.Author",
      selectedTag: undefined,
    });
  });

  it("maps day and tag filters to API-ready values", () => {
    const filters: DirectoryFilters = {
      day: "第二天",
      search: "abc",
      sort: "Author_Main(Author),desc",
      tag: "Illustration",
      page: 1,
    };

    expect(buildDirectoryQueryParams(filters)).toEqual({
      page: "1",
      sort: "Author_Main(Author),desc",
      search: "abc",
      tag: "Illustration",
      day: "day2",
      searchTable: "Author_Main.Author",
      selectedTag: "Illustration",
    });
  });
});

describe("toSortedBookmarkIds", () => {
  it("returns sorted bookmark ids for stable queries", () => {
    const bookmarks = new Set([9, 2, 5]);
    expect(toSortedBookmarkIds(bookmarks)).toEqual([2, 5, 9]);
  });
});
