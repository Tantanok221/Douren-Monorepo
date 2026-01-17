interface Env {
  WORKERS_DEV_SUBDOMAIN?: string;
}

function parsePrLabel(hostname: string): string | null {
  const firstLabel = hostname.split(".")[0] ?? "";
  if (!/^pr-\d+$/.test(firstLabel)) return null;
  return firstLabel;
}

function targetForHost(hostname: string, pr: string, env: Env): string | null {
  if (hostname.endsWith(".stg.cms.douren.net")) {
    return `https://${pr}.douren-cms.pages.dev`;
  }

  if (hostname.endsWith(".stg.douren.net")) {
    return `https://${pr}.douren-frontend.pages.dev`;
  }

  if (hostname.endsWith(".stg.api.douren.net")) {
    const subdomain = env.WORKERS_DEV_SUBDOMAIN?.trim();
    if (!subdomain) return null;
    return `https://douren-backend-${pr}.${subdomain}.workers.dev`;
  }

  return null;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const incomingUrl = new URL(request.url);
    const hostname = incomingUrl.hostname.toLowerCase();

    const pr = parsePrLabel(hostname);
    if (!pr) return new Response("Not found", { status: 404 });

    const targetBase = targetForHost(hostname, pr, env);
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

