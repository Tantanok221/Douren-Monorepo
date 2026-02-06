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

  it("initializes from localStorage and toggles ids", () => {
    localStorageMock.setItem("douren-v2-bookmarks", JSON.stringify([2, 7]));

    const initial = readBookmarksFromStorage();
    expect(Array.from(initial)).toEqual([2, 7]);

    const toggled = toggleBookmarkSet(initial, 7);
    const updated = toggleBookmarkSet(toggled, 9);
    writeBookmarksToStorage(updated);

    const stored = JSON.parse(
      localStorageMock.getItem("douren-v2-bookmarks") ?? "[]",
    ) as number[];
    expect(stored.sort((a, b) => a - b)).toEqual([2, 9]);
  });

  it("writes empty set to storage", () => {
    localStorageMock.setItem("douren-v2-bookmarks", JSON.stringify([1]));
    const empty = new Set<number>();
    writeBookmarksToStorage(empty);
    expect(localStorageMock.getItem("douren-v2-bookmarks")).toBe("[]");
  });
});
