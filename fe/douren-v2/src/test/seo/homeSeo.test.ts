/// <reference types="node" />
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { HOME_SOCIAL_IMAGE, SITE_ORIGIN } from "@/seo/site";

const readProjectFile = (path: string): string => readFileSync(path, "utf8");

describe("homepage SEO without JavaScript", () => {
  const html = new DOMParser().parseFromString(
    readProjectFile("index.html"),
    "text/html",
  );

  it("includes a canonical URL and matching site identity", () => {
    const canonical = `${SITE_ORIGIN}/`;
    expect(
      html.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ).toBe(canonical);
    expect(
      html.querySelector('meta[property="og:url"]')?.getAttribute("content"),
    ).toBe(canonical);
    expect(html.title).toContain("同人檔案館 Douren");
    expect(
      JSON.parse(html.getElementById("home-website-schema")?.textContent ?? ""),
    ).toMatchObject({ "@type": "WebSite", url: canonical });
  });

  it("uses the same dedicated image for Open Graph and Twitter", () => {
    for (const selector of [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
    ]) {
      expect(html.querySelector(selector)?.getAttribute("content")).toBe(
        HOME_SOCIAL_IMAGE,
      );
    }
    const imagePath = new URL(HOME_SOCIAL_IMAGE).pathname;
    const jpeg = readFileSync(`public${imagePath}`);
    expect(jpeg.subarray(0, 2).toString("hex")).toBe("ffd8");
  });

  it("provides a meaningful no-JavaScript fallback", () => {
    expect(html.querySelector("#root noscript h1")?.textContent).toContain(
      "同人檔案館 Douren",
    );
    expect(html.querySelector("#root noscript a")?.getAttribute("href")).toBe(
      "/about",
    );
  });

  it("exposes a production sitemap with the home and About URLs", () => {
    expect(readProjectFile("public/robots.txt")).toContain(
      `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    );
    const sitemap = readProjectFile("public/sitemap.xml");
    expect(sitemap).toContain(`<loc>${SITE_ORIGIN}/</loc>`);
    expect(sitemap).toContain(`<loc>${SITE_ORIGIN}/about</loc>`);
  });
});
