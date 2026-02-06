import { describe, it, expect } from "vitest";
import { createDirectoryStore } from "./directoryStore";

describe("createDirectoryStore", () => {
  it("initializes defaults and overrides", () => {
    const store = createDirectoryStore({ page: 3 }, ["A", "B"]);
    const state = store.getState();

    expect(state.filters.day).toBe("全部");
    expect(state.filters.page).toBe(3);
    expect(state.availableTags).toEqual(["A", "B"]);
  });

  it("resets page on filter changes but not on setPage", () => {
    const store = createDirectoryStore({ page: 4 }, []);

    store.getState().setPage(2);
    expect(store.getState().filters.page).toBe(2);

    store.getState().setDay("第二天");
    expect(store.getState().filters.day).toBe("第二天");
    expect(store.getState().filters.page).toBe(1);

    store.getState().setSearch("abc");
    expect(store.getState().filters.search).toBe("abc");
    expect(store.getState().filters.page).toBe(1);

    store.getState().setTag("Illustration");
    expect(store.getState().filters.tag).toBe("Illustration");
    expect(store.getState().filters.page).toBe(1);
  });

  it("updates available tags", () => {
    const store = createDirectoryStore();
    store.getState().setAvailableTags(["X"]);
    expect(store.getState().availableTags).toEqual(["X"]);
  });
});
