import { describe, expect, it } from "vitest";
import { parseTagFilter, serializeTagFilter } from "./tagFilter";

describe("parseTagFilter", () => {
  it("returns empty list for all-tags sentinel", () => {
    expect(parseTagFilter("全部")).toEqual([]);
  });

  it("parses comma separated tags and ignores empty segments", () => {
    expect(parseTagFilter(" Space,Illustration,, ")).toEqual([
      "Space",
      "Illustration",
    ]);
  });
});

describe("serializeTagFilter", () => {
  it("returns all-tags sentinel for empty input", () => {
    expect(serializeTagFilter([])).toBe("全部");
  });

  it("deduplicates and sorts for stable queries", () => {
    expect(serializeTagFilter(["Space", "Illustration", "Space"])).toBe(
      "Illustration,Space",
    );
  });
});
