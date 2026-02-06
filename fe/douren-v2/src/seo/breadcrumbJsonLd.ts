const HOME_LABEL = "同人檔案館";
const BOOKMARKS_LABEL = "我的收藏";
const FALLBACK_ORIGIN = "https://example.com";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface BreadcrumbJsonLd {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

const decodePathSegment = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const normalizePathname = (pathname: string): string => {
  if (!pathname) return "/";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
};

const normalizeOrigin = (siteOrigin: string): string => {
  try {
    return new URL(siteOrigin).origin;
  } catch {
    return FALLBACK_ORIGIN;
  }
};

export const buildBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
  const segments = normalizePathname(pathname).split("/").filter(Boolean);

  if (segments[0] !== "events" || !segments[1]) {
    return [{ name: HOME_LABEL, path: "/" }];
  }

  const eventName = decodePathSegment(segments[1]);
  const encodedEventName = encodeURIComponent(eventName);
  const eventPath = `/events/${encodedEventName}`;
  const breadcrumbs: BreadcrumbItem[] = [
    { name: HOME_LABEL, path: "/" },
    { name: eventName, path: eventPath },
  ];

  if (segments[2] === "bookmarks") {
    breadcrumbs.push({
      name: BOOKMARKS_LABEL,
      path: `${eventPath}/bookmarks`,
    });
  }

  return breadcrumbs;
};

export const buildBreadcrumbJsonLd = (
  siteOrigin: string,
  breadcrumbs: BreadcrumbItem[],
): BreadcrumbJsonLd => {
  const origin = normalizeOrigin(siteOrigin);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: new URL(breadcrumb.path, `${origin}/`).toString(),
    })),
  };
};
