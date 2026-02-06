import { useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";

const SITE_ORIGIN = "https://douren.net";
const SITE_NAME = "同人檔案館 Douren";
const DEFAULT_TITLE = "同人檔案館 Douren | 動漫展同人活動創作者名錄";
const DEFAULT_DESCRIPTION = "同人檔案館（Douren）收錄台灣動漫展與同人活動創作者資訊，支援社團名、攤位、標籤搜尋與收藏功能，快速找到你喜歡的創作者與作品。";

interface SeoMeta {
  canonicalUrl: string;
  title: string;
  description: string;
}

const decodePathSegment = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const upsertCanonical = (href: string): void => {
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", href);
};

const upsertMetaByName = (name: string, content: string): void => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const upsertMetaByProperty = (property: string, content: string): void => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const toSeoMeta = (pathname: string): SeoMeta => {
  const segments = pathname.split("/").filter(Boolean);
  const isEventRoute = segments[0] === "events" && Boolean(segments[1]);

  if (!isEventRoute) {
    return {
      canonicalUrl: `${SITE_ORIGIN}/`,
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    };
  }

  const eventName = decodePathSegment(segments[1] ?? "");
  const encodedEventName = encodeURIComponent(eventName);

  return {
    canonicalUrl: `${SITE_ORIGIN}/event/${encodedEventName}`,
    title: `${eventName} 創作者名錄 | ${SITE_NAME}`,
    description: `瀏覽 ${eventName} 創作者與社團資訊，依攤位、標籤快速搜尋，並收藏喜愛創作者。`,
  };
};

export const RouteSeoMeta = () => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const seoMeta = useMemo(() => toSeoMeta(pathname), [pathname]);

  useEffect(() => {
    document.title = seoMeta.title;
    upsertCanonical(seoMeta.canonicalUrl);
    upsertMetaByName("description", seoMeta.description);
    upsertMetaByProperty("og:site_name", SITE_NAME);
    upsertMetaByProperty("og:url", seoMeta.canonicalUrl);
    upsertMetaByProperty("og:title", seoMeta.title);
    upsertMetaByProperty("og:description", seoMeta.description);
    upsertMetaByName("twitter:title", seoMeta.title);
    upsertMetaByName("twitter:description", seoMeta.description);
  }, [seoMeta]);

  return null;
};
