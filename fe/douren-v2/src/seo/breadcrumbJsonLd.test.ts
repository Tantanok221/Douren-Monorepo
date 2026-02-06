import { describe, expect, it } from "vitest";
import { buildBreadcrumbJsonLd, buildBreadcrumbItems } from "./breadcrumbJsonLd";

describe("buildBreadcrumbItems", () => {
  it("creates home + event breadcrumbs for event directory routes", () => {
    expect(buildBreadcrumbItems("/events/Fancy%20Frontier%2044")).toEqual([
      { name: "同人檔案館", path: "/" },
      { name: "Fancy Frontier 44", path: "/events/Fancy%20Frontier%2044" },
    ]);
  });

  it("creates home + event + bookmarks breadcrumbs for bookmarks routes", () => {
    expect(buildBreadcrumbItems("/events/FF44/bookmarks")).toEqual([
      { name: "同人檔案館", path: "/" },
      { name: "FF44", path: "/events/FF44" },
      { name: "我的收藏", path: "/events/FF44/bookmarks" },
    ]);
  });
});

describe("buildBreadcrumbJsonLd", () => {
  it("creates schema.org breadcrumb list with absolute item URLs", () => {
    const schema = buildBreadcrumbJsonLd("https://douren.example", [
      { name: "同人檔案館", path: "/" },
      { name: "FF44", path: "/events/FF44" },
    ]);

    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "同人檔案館",
          item: "https://douren.example/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "FF44",
          item: "https://douren.example/events/FF44",
        },
      ],
    });
  });
});
