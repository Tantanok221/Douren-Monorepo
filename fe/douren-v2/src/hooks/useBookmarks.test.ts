import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  readBookmarksFromStorage,
  toggleBookmarkSet,
  writeBookmarksToStorage,
} from "./useBookmarks";

const localStorageMock = {
  store: {} as Record<string, string>,
  getItem(key: string) {
    return this.store[key] ?? null;
  },
  setItem(key: string, value: string) {
    this.store[key] = value;
  },
  removeItem(key: string) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  },
};

vi.stubGlobal("localStorage", localStorageMock);

describe("useBookmarks", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("initializes from event-scoped localStorage and toggles ids", () => {
    localStorageMock.setItem(
      "douren-v2-bookmarks",
      JSON.stringify({ FF45: [2, 7], FF42: [8] }),
    );

    const initial = readBookmarksFromStorage("FF45");
    expect(Array.from(initial)).toEqual([2, 7]);

    const toggled = toggleBookmarkSet(initial, 7);
    const updated = toggleBookmarkSet(toggled, 9);
    writeBookmarksToStorage("FF45", updated);

    const stored = JSON.parse(
      localStorageMock.getItem("douren-v2-bookmarks") ?? "{}",
    ) as Record<string, number[]>;
    expect(stored.FF45.sort((a, b) => a - b)).toEqual([2, 9]);
    expect(stored.FF42).toEqual([8]);
  });

  it("writes empty set to one event key only", () => {
    localStorageMock.setItem(
      "douren-v2-bookmarks",
      JSON.stringify({ FF45: [1], FF42: [10] }),
    );
    const empty = new Set<number>();
    writeBookmarksToStorage("FF45", empty);
    expect(localStorageMock.getItem("douren-v2-bookmarks")).toBe(
      JSON.stringify({ FF45: [], FF42: [10] }),
    );
  });

  it("migrates legacy array bookmarks into current event scope", () => {
    localStorageMock.setItem("douren-v2-bookmarks", JSON.stringify([3, 4]));
    const bookmarks = readBookmarksFromStorage("FF45");
    expect(Array.from(bookmarks)).toEqual([3, 4]);
  });
});
