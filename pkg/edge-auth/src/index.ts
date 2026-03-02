export const ROBOTS_HEADER_VALUE = "noindex, nofollow, noarchive";

export function getBranchName(envBranch: string | undefined, hostname: string): string {
  const [subdomain = ""] = hostname.split(".");
  if (envBranch && isProtectedBranch(envBranch)) {
    return envBranch;
  }

  if (subdomain) {
    return subdomain;
  }

  return envBranch ?? "";
}

export function isProtectedBranch(branch: string): boolean {
  return branch === "stg" || branch.startsWith("pr-");
}

export function isAuthorizedRequest(
  authorizationHeader: string | null,
  expectedUsername: string | undefined,
  expectedPassword: string | undefined,
): boolean {
  if (!expectedUsername || !expectedPassword) return false;
  if (!authorizationHeader || !authorizationHeader.startsWith("Basic ")) return false;

  const encodedCredentials = authorizationHeader.slice(6).trim();

  let decodedCredentials = "";
  try {
    decodedCredentials = atob(encodedCredentials);
  } catch {
    return false;
  }

  const separatorIndex = decodedCredentials.indexOf(":");
  if (separatorIndex < 0) return false;

  const username = decodedCredentials.slice(0, separatorIndex);
  const password = decodedCredentials.slice(separatorIndex + 1);

  return username === expectedUsername && password === expectedPassword;
}

export function withNoIndexHeader(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", ROBOTS_HEADER_VALUE);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
