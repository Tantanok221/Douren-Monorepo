import fs from "node:fs/promises";
import path from "node:path";

const SITE_ORIGIN = "https://douren.net";
const DEFAULT_BACKEND_ORIGIN = "https://api.douren.net";

const resolveBackendOrigin = () => {
  const raw = process.env.VITE_BACKEND_URL?.trim();
  if (!raw) return DEFAULT_BACKEND_ORIGIN;

  try {
    const url = new URL(raw);
    if (url.pathname.endsWith("/trpc")) {
      url.pathname = url.pathname.replace(/\/trpc\/?$/, "");
      url.search = "";
      url.hash = "";
    }
    return url.origin + url.pathname.replace(/\/+$/, "");
  } catch {
    return DEFAULT_BACKEND_ORIGIN;
  }
};

const xmlEscape = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const buildUrlEntry = (loc) => `  <url>
    <loc>${xmlEscape(loc)}</loc>
  </url>`;

const buildSitemapXml = (eventNames) => {
  const uniqueEventNames = [...new Set(eventNames.filter(Boolean))];
  const urls = [
    `${SITE_ORIGIN}/`,
    `${SITE_ORIGIN}/about`,
    ...uniqueEventNames.map(
      (eventName) => `${SITE_ORIGIN}/events/${encodeURIComponent(eventName)}`,
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(buildUrlEntry).join("\n")}
</urlset>
`;
};

const fetchEventNames = async (backendOrigin) => {
  const endpoint = `${backendOrigin}/event`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch events from ${endpoint} (${response.status})`,
    );
  }

  const payload = await response.json();
  if (!Array.isArray(payload)) return [];

  return payload
    .map((event) => (typeof event?.name === "string" ? event.name.trim() : ""))
    .filter(Boolean);
};

const writeSitemap = async (xml) => {
  const outputPath = path.resolve(process.cwd(), "public/sitemap.xml");
  await fs.writeFile(outputPath, xml, "utf8");
  return outputPath;
};

const main = async () => {
  const backendOrigin = resolveBackendOrigin();

  try {
    const eventNames = await fetchEventNames(backendOrigin);
    const xml = buildSitemapXml(eventNames);
    const outputPath = await writeSitemap(xml);
    console.log(
      `Sitemap generated at ${outputPath} with ${eventNames.length} event URLs.`,
    );
  } catch (error) {
    const xml = buildSitemapXml([]);
    const outputPath = await writeSitemap(xml);
    console.warn(
      `Sitemap fallback generated at ${outputPath} (no event URLs). Reason: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
};

await main();
