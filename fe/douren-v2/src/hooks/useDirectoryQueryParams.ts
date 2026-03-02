import { useMemo } from "react";
import type { DirectoryFilters } from "@/types/models";
import { parseTagFilter } from "@/components/directory/tagFilter";

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
  selectedTags: string[];
}

export const buildDirectoryQueryParams = (
  filters: DirectoryFilters,
): DirectoryQueryParams => {
  const selectedTags = parseTagFilter(filters.tag);

  return {
    page: String(filters.page),
    sort: filters.sort,
    search: filters.search || undefined,
    tag: selectedTags.length > 0 ? selectedTags.join(",") : undefined,
    day: dayFilterMap[filters.day as keyof typeof dayFilterMap],
    searchTable: SEARCH_TABLE,
    selectedTags,
  };
};

export const toSortedBookmarkIds = (bookmarks: Set<number>): number[] =>
  Array.from(bookmarks).sort((a, b) => a - b);

export const useDirectoryQueryParams = (
  filters: DirectoryFilters,
): DirectoryQueryParams =>
  useMemo(() => buildDirectoryQueryParams(filters), [filters]);
