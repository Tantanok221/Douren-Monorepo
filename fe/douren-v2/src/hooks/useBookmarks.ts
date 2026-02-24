import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "douren-v2-bookmarks";
type BookmarkStorage = Record<string, number[]>;

export interface BookmarksStore {
  bookmarks: Set<number>;
  toggle: (id: number) => void;
  has: (id: number) => boolean;
  clear: () => void;
}

const parseStorageObject = (raw: string | null): BookmarkStorage => {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return {};
    if (!parsed || typeof parsed !== "object") return {};
    return Object.fromEntries(
      Object.entries(parsed).map(([eventName, ids]) => [
        eventName,
        Array.isArray(ids)
          ? (ids.filter((value) => Number.isFinite(value)) as number[])
          : [],
      ]),
    );
  } catch {
    return {};
  }
};

export const readBookmarksFromStorage = (eventName: string): Set<number> => {
  if (typeof localStorage === "undefined") return new Set<number>();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return new Set<number>();
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((value) => Number.isFinite(value)));
    }
    if (!parsed || typeof parsed !== "object") return new Set<number>();
    const record = parsed as Record<string, unknown>;
    const eventBookmarks = record[eventName];
    if (!Array.isArray(eventBookmarks)) return new Set<number>();
    return new Set(eventBookmarks.filter((value) => Number.isFinite(value)));
  } catch {
    return new Set<number>();
  }
};

export const writeBookmarksToStorage = (
  eventName: string,
  bookmarks: Set<number>,
) => {
  if (typeof localStorage === "undefined") return;
  const storage = parseStorageObject(localStorage.getItem(STORAGE_KEY));
  storage[eventName] = Array.from(bookmarks);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
};

export const toggleBookmarkSet = (prev: Set<number>, id: number) => {
  const next = new Set(prev);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  return next;
};

export const useBookmarks = (eventName: string): BookmarksStore => {
  const [bookmarks, setBookmarks] = useState<Set<number>>(() =>
    readBookmarksFromStorage(eventName),
  );

  useEffect(() => {
    setBookmarks(readBookmarksFromStorage(eventName));
  }, [eventName]);

  useEffect(() => {
    writeBookmarksToStorage(eventName, bookmarks);
  }, [eventName, bookmarks]);

  const toggle = useCallback((id: number) => {
    setBookmarks((prev) => {
      return toggleBookmarkSet(prev, id);
    });
  }, []);

  const has = useCallback(
    (id: number) => {
      return bookmarks.has(id);
    },
    [bookmarks],
  );

  const clear = useCallback(() => {
    setBookmarks(new Set());
  }, []);

  return useMemo(
    () => ({
      bookmarks,
      toggle,
      has,
      clear,
    }),
    [bookmarks, toggle, has, clear],
  );
};
