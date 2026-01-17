interface Env {
  WORKERS_DEV_SUBDOMAIN?: string;
}

type PreviewTarget = "frontend" | "cms" | "api";

function parsePreviewHost(hostname: string): { prBranch: string; target: PreviewTarget } | null {
  const firstLabel = hostname.split(".")[0] ?? "";

  const match = firstLabel.match(/^pr-(\d+)(?:-(cms|api))?-stg$/);
  if (!match) return null;

  const prNumber = match[1];
  if (!prNumber) return null;

  const kind = match[2];
  const target: PreviewTarget = kind === "cms" ? "cms" : kind === "api" ? "api" : "frontend";

  return { prBranch: `pr-${prNumber}`, target };
}

function targetForHost(prBranch: string, target: PreviewTarget, env: Env): string | null {
  if (target === "cms") return `https://${prBranch}.douren-cms.pages.dev`;
  if (target === "frontend") return `https://${prBranch}.douren-frontend.pages.dev`;

  const subdomain = env.WORKERS_DEV_SUBDOMAIN?.trim();
  if (!subdomain) return null;
  return `https://douren-backend-${prBranch}.${subdomain}.workers.dev`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const incomingUrl = new URL(request.url);
    const hostname = incomingUrl.hostname.toLowerCase();

    const parsed = parsePreviewHost(hostname);
    if (!parsed) return new Response("Not found", { status: 404 });

    const targetBase = targetForHost(parsed.prBranch, parsed.target, env);
    if (!targetBase) {
      return new Response(
        "Preview router not configured for this hostname",
        { status: 502 },
      );
    }

    const targetUrl = new URL(targetBase);
    targetUrl.pathname = incomingUrl.pathname;
    targetUrl.search = incomingUrl.search;

    const proxyRequest = new Request(targetUrl.toString(), request);
    return fetch(proxyRequest);
  },
};
