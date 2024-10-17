import { describe, it, expect, beforeEach } from "vitest";
import { TagObject, useTagFilter } from "./useTagFilter.ts";

// Mock data
const mockTags: TagObject[] = [
  { tag: "原創", count: 149, index: 0 },
  { tag: "同人", count: 100, index: 1 },
  { tag: "漫畫", count: 75, index: 2 },
];

describe("useTagFilter Store", () => {
  beforeEach(() => {
    // Reset the store state before each test
    useTagFilter.setState({
      allFilter: [],
      tagFilter: [],
      checked: Array(30).fill(false),
    });
  });

  it("should initialize with default values", () => {
    const state = useTagFilter.getState();
    expect(state.allFilter).toEqual([]);
    expect(state.tagFilter).toEqual([]);
    expect(state.checked).toEqual(Array(30).fill(false));
  });

  it("should set all filters", async () => {
    const { setAllFilter } = useTagFilter.getState();
    await setAllFilter(mockTags);

    const state = useTagFilter.getState();
    expect(state.allFilter).toEqual(mockTags);
  });

  it("should add tag to filter", () => {
    const { addTagFilter } = useTagFilter.getState();
    const newTag = mockTags[0];

    addTagFilter(newTag);

    const state = useTagFilter.getState();
    expect(state.tagFilter).toContainEqual(newTag);
    expect(state.tagFilter).toHaveLength(1);
  });

  it("should remove tag from filter", () => {
    const { addTagFilter, removeTagFilter } = useTagFilter.getState();
    const tag = mockTags[0];

    // First add a tag
    addTagFilter(tag);
    // Then remove it
    removeTagFilter(tag);

    const state = useTagFilter.getState();
    expect(state.tagFilter).not.toContainEqual(tag);
    expect(state.tagFilter).toHaveLength(0);
  });

  it("should remove all tags from filter", () => {
    const { addTagFilter, removeAllTagFilter } = useTagFilter.getState();

    // Add multiple tags
    mockTags.forEach((tag) => addTagFilter(tag));

    // Remove all tags
    removeAllTagFilter();

    const state = useTagFilter.getState();
    expect(state.tagFilter).toHaveLength(0);
    expect(state.checked).toEqual(Array(30).fill(""));
  });

  it("should get tag by name", async () => {
    const { setAllFilter, getTag } = useTagFilter.getState();

    // Set all filters first
    await setAllFilter(mockTags);

    // Get specific tag
    const result = getTag("原創");
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(mockTags[0]);
  });

  it("should set checked status for specific index", () => {
    const { setChecked } = useTagFilter.getState();

    // Set checked status for index 1
    setChecked(1, true);

    const state = useTagFilter.getState();
    expect(state.checked[1]).toBe(true);
    // Verify other indices remain unchanged
    expect(state.checked[0]).toBe(false);
    expect(state.checked[2]).toBe(false);
  });

  it("should handle multiple tag additions", () => {
    const { addTagFilter } = useTagFilter.getState();

    // Add multiple tags
    mockTags.forEach((tag) => addTagFilter(tag));

    const state = useTagFilter.getState();
    expect(state.tagFilter).toHaveLength(mockTags.length);
    expect(state.tagFilter).toEqual(mockTags);
  });

  it("should handle tag removal when tag doesnt exist", () => {
    const { removeTagFilter } = useTagFilter.getState();
    const nonExistentTag = { tag: "nonexistent", count: 0, index: 999 };

    // Try to remove non-existent tag
    removeTagFilter(nonExistentTag);

    const state = useTagFilter.getState();
    expect(state.tagFilter).toEqual([]);
  });

  it("should maintain correct state after multiple operations", async () => {
    const { setAllFilter, addTagFilter, removeTagFilter, setChecked } =
      useTagFilter.getState();

    // Perform multiple operations
    await setAllFilter(mockTags);
    addTagFilter(mockTags[0]);
    addTagFilter(mockTags[1]);
    removeTagFilter(mockTags[0]);
    setChecked(1, true);

    const state = useTagFilter.getState();
    expect(state.allFilter).toEqual(mockTags);
    expect(state.tagFilter).toHaveLength(1);
    expect(state.tagFilter[0]).toEqual(mockTags[1]);
    expect(state.checked[1]).toBe(true);
  });
});
