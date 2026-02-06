import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "douren-v2-bookmarks";

export interface BookmarksStore {
  bookmarks: Set<number>;
  toggle: (id: number) => void;
  has: (id: number) => boolean;
  clear: () => void;
}

export const readBookmarksFromStorage = (): Set<number> => {
  if (typeof localStorage === "undefined") return new Set<number>();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return new Set<number>();
  try {
    const parsed = JSON.parse(raw) as number[];
    return new Set(parsed.filter((value) => Number.isFinite(value)));
  } catch {
    return new Set<number>();
  }
};

export const writeBookmarksToStorage = (bookmarks: Set<number>) => {
  if (typeof localStorage === "undefined") return;
  const data = Array.from(bookmarks);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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

export const useBookmarks = (): BookmarksStore => {
  const [bookmarks, setBookmarks] = useState<Set<number>>(() =>
    readBookmarksFromStorage(),
  );

  useEffect(() => {
    writeBookmarksToStorage(bookmarks);
  }, [bookmarks]);

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
