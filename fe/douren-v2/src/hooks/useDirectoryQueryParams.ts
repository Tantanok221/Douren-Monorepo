import { useMemo } from "react";
import type { DirectoryFilters } from "@/types/models";

const SEARCH_TABLE = "Author_Main.Author";

const dayFilterMap = {
  第一天: "day1",
  第二天: "day2",
  第三天: "day3",
} as const;

interface DirectoryQueryParams {
  page: string;
  sort: string;
  search: string | undefined;
  tag: string | undefined;
  day: "day1" | "day2" | "day3" | undefined;
  searchTable: string;
  selectedTag: string | undefined;
}

export const buildDirectoryQueryParams = (
  filters: DirectoryFilters,
): DirectoryQueryParams => ({
  page: String(filters.page),
  sort: filters.sort,
  search: filters.search || undefined,
  tag: filters.tag === "全部" ? undefined : filters.tag,
  day: dayFilterMap[filters.day as keyof typeof dayFilterMap],
  searchTable: SEARCH_TABLE,
  selectedTag: filters.tag === "全部" ? undefined : filters.tag,
});

export const toSortedBookmarkIds = (bookmarks: Set<number>): number[] =>
  Array.from(bookmarks).sort((a, b) => a - b);

export const useDirectoryQueryParams = (
  filters: DirectoryFilters,
): DirectoryQueryParams =>
  useMemo(() => buildDirectoryQueryParams(filters), [filters]);
