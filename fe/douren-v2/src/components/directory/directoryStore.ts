import type { StoreApi } from "zustand";
import { createStore } from "zustand/vanilla";
import type { DirectoryFilters } from "@/types/models";
import {
  ALL_TAGS_FILTER,
  parseTagFilter,
  serializeTagFilter,
} from "./tagFilter";

const DEFAULT_FILTERS: DirectoryFilters = {
  day: "全部",
  search: "",
  sort: "Author_Main(Author),asc",
  tag: ALL_TAGS_FILTER,
  page: 1,
};

export interface DirectoryState {
  filters: DirectoryFilters;
  availableTags: string[];
  setDay: (day: string) => void;
  setSearch: (search: string) => void;
  setSort: (sort: string) => void;
  setTag: (tag: string) => void;
  toggleTag: (tag: string) => void;
  clearTags: () => void;
  setPage: (page: number) => void;
  setAvailableTags: (tags: string[]) => void;
}

export type DirectoryStore = StoreApi<DirectoryState>;

export const createDirectoryStore = (
  initialFilters?: Partial<DirectoryFilters>,
  availableTags: string[] = [],
): DirectoryStore => {
  const mergedFilters: DirectoryFilters = {
    ...DEFAULT_FILTERS,
    ...initialFilters,
  };

  return createStore<DirectoryState>((set) => ({
    filters: mergedFilters,
    availableTags,
    setDay: (day) =>
      set((state) => ({
        filters: { ...state.filters, day, page: 1 },
      })),
    setSearch: (search) =>
      set((state) => ({
        filters: { ...state.filters, search, page: 1 },
      })),
    setSort: (sort) =>
      set((state) => ({
        filters: { ...state.filters, sort, page: 1 },
      })),
    setTag: (tag) =>
      set((state) => ({
        filters: { ...state.filters, tag, page: 1 },
      })),
    toggleTag: (tag) =>
      set((state) => {
        const currentTags = parseTagFilter(state.filters.tag);
        const hasTag = currentTags.includes(tag);
        const nextTags = hasTag
          ? currentTags.filter((currentTag) => currentTag !== tag)
          : [...currentTags, tag];

        return {
          filters: {
            ...state.filters,
            tag: serializeTagFilter(nextTags),
            page: 1,
          },
        };
      }),
    clearTags: () =>
      set((state) => ({
        filters: { ...state.filters, tag: ALL_TAGS_FILTER, page: 1 },
      })),
    setPage: (page) =>
      set((state) => ({
        filters: { ...state.filters, page },
      })),
    setAvailableTags: (tags) =>
      set(() => ({
        availableTags: tags,
      })),
  }));
};
