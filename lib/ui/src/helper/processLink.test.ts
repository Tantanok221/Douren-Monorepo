import { describe, it, expect } from "vitest";
import { LinkResult, processLink } from "./processLink.ts";

describe("processLink", () => {
  it("should return empty array when links is null", () => {
    const result = processLink(null, null, "test-category");
    expect(result).toEqual([]);
  });

  it("should process single link and name correctly", () => {
    const links = "https://example.com";
    const names = "Example Site";
    const category = "test-category";

    const expected: LinkResult[] = [
      {
        category: "test-category",
        link: "https://example.com",
        name: "Example Site",
      },
    ];

    const result = processLink(links, names, category);
    expect(result).toEqual(expected);
  });

  it("should process multiple links with corresponding names", () => {
    const links =
      "https://example1.com\nhttps://example2.com\nhttps://example3.com";
    const names = "Site 1\nSite 2\nSite 3";
    const category = "test-category";

    const expected: LinkResult[] = [
      {
        category: "test-category",
        link: "https://example1.com",
        name: "Site 1",
      },
      {
        category: "test-category",
        link: "https://example2.com",
        name: "Site 2",
      },
      {
        category: "test-category",
        link: "https://example3.com",
        name: "Site 3",
      },
    ];

    const result = processLink(links, names, category);
    expect(result).toEqual(expected);
  });

  it("should use first name for all links if fewer names than links", () => {
    const links = "https://example1.com\nhttps://example2.com";
    const names = "Default Site";
    const category = "test-category";

    const expected: LinkResult[] = [
      {
        category: "test-category",
        link: "https://example1.com",
        name: "Default Site",
      },
      {
        category: "test-category",
        link: "https://example2.com",
        name: "Default Site",
      },
    ];

    const result = processLink(links, names, category);
    expect(result).toEqual(expected);
  });

  it("should handle null names properly", () => {
    const links = "https://example.com";
    const names = null;
    const category = "test-category";

    const expected: LinkResult[] = [
      {
        category: "test-category",
        link: "https://example.com",
        name: "",
      },
    ];

    const result = processLink(links, names, category);
    expect(result).toEqual(expected);
  });

  it("should handle null category properly", () => {
    const links = "https://example.com";
    const names = "Example";
    const category = null;

    const expected: LinkResult[] = [
      {
        category: "",
        link: "https://example.com",
        name: "Example",
      },
    ];

    const result = processLink(links, names, category as any);
    expect(result).toEqual(expected);
  });
});
