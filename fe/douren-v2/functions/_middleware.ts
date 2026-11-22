import {
  getBranchName,
  isAuthorizedRequest,
  isProtectedBranch,
  withNoIndexHeader,
} from "@pkg/edge-auth";
import { DEFAULT_SOCIAL_IMAGE } from "../src/seo/site";

interface PagesHtmlRewriter {
  on(
    selector: string,
    handler: {
      element(element: {
        remove(): void;
        setAttribute(name: string, value: string): void;
      }): void;
    },
  ): PagesHtmlRewriter;
  transform(response: Response): Response;
}

declare const HTMLRewriter: new () => PagesHtmlRewriter;

interface PagesContext {
  request: Request;
  env: {
    BASIC_AUTH_USERNAME?: string;
    BASIC_AUTH_PASSWORD?: string;
    CF_PAGES_BRANCH?: string;
  };
  next: () => Promise<Response>;
}

function unauthorizedResponse(): Response {
  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Staging", charset="UTF-8"',
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}

export const onRequest = async (context: PagesContext): Promise<Response> => {
  const { hostname, pathname } = new URL(context.request.url);
  const branch = getBranchName(context.env.CF_PAGES_BRANCH, hostname);
  const isProtected = isProtectedBranch(branch);

  if (
    isProtected &&
    !isAuthorizedRequest(
      context.request.headers.get("Authorization"),
      context.env.BASIC_AUTH_USERNAME,
      context.env.BASIC_AUTH_PASSWORD,
    )
  ) {
    return unauthorizedResponse();
  }

  let response = await context.next();

  // Pages serves index.html for SPA routes as well as the homepage.
  if (
    pathname !== "/" &&
    response.body &&
    response.headers.get("Content-Type")?.startsWith("text/html")
  ) {
    response = new HTMLRewriter()
      .on("[data-home-only]", { element: (element) => element.remove() })
      .on('meta[property="og:image"], meta[name="twitter:image"]', {
        element: (element) =>
          element.setAttribute("content", DEFAULT_SOCIAL_IMAGE),
      })
      .transform(response);
  }

  return isProtected ? withNoIndexHeader(response) : response;
};
