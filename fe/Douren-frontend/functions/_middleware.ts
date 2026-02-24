import {
  getBranchName,
  isAuthorizedRequest,
  isProtectedBranch,
  withNoIndexHeader,
} from "@pkg/edge-auth";

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
  const branch = getBranchName(
    context.env.CF_PAGES_BRANCH,
    new URL(context.request.url).hostname,
  );

  if (!isProtectedBranch(branch)) {
    return context.next();
  }

  const isAuthorized = isAuthorizedRequest(
    context.request.headers.get("Authorization"),
    context.env.BASIC_AUTH_USERNAME,
    context.env.BASIC_AUTH_PASSWORD,
  );

  if (!isAuthorized) {
    return unauthorizedResponse();
  }

  const response = await context.next();
  return withNoIndexHeader(response);
};
