import { useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";
import { buildBreadcrumbItems, buildBreadcrumbJsonLd } from "@/seo/breadcrumbJsonLd";

const resolveSiteOrigin = (): string => {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  return "https://example.com";
};

export const BreadcrumbJsonLd = () => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const schemaJson = useMemo(() => {
    const breadcrumbs = buildBreadcrumbItems(pathname);
    const schema = buildBreadcrumbJsonLd(resolveSiteOrigin(), breadcrumbs);

    return JSON.stringify(schema);
  }, [pathname]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaJson }}
    />
  );
};
