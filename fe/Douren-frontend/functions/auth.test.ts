import { describe, expect, it, vi } from "vitest";

import { onRequest } from "./_middleware";

interface TestPagesContext {
  request: Request;
  env: {
    BASIC_AUTH_USERNAME?: string;
    BASIC_AUTH_PASSWORD?: string;
    CF_PAGES_BRANCH?: string;
  };
  next: () => Promise<Response>;
}

const createContext = ({
  url,
  branch,
  authorization,
  nextResponse = new Response("ok", { status: 200 }),
}: {
  url: string;
  branch?: string;
  authorization?: string;
  nextResponse?: Response;
}): TestPagesContext => {
  const headers = authorization
    ? new Headers({ Authorization: authorization })
    : new Headers();

  return {
    request: new Request(url, { headers }),
    env: {
      BASIC_AUTH_USERNAME: "shared-user",
      BASIC_AUTH_PASSWORD: "shared-pass",
      CF_PAGES_BRANCH: branch,
    },
    next: vi.fn().mockResolvedValue(nextResponse),
  };
};

describe("staging middleware", () => {
  it("passes through unprotected branches", async () => {
    const context = createContext({
      url: "https://main.douren-frontend.pages.dev",
      branch: "main",
    });

    const response = await onRequest(context);

    expect(response.status).toBe(200);
    expect(response.headers.get("X-Robots-Tag")).toBeNull();
    expect(context.next).toHaveBeenCalledOnce();
  });

  it("returns 401 with WWW-Authenticate for missing auth on protected branches", async () => {
    const context = createContext({
      url: "https://pr-42.douren-frontend.pages.dev",
      branch: "pr-42",
    });

    const response = await onRequest(context);

    expect(response.status).toBe(401);
    expect(response.headers.get("WWW-Authenticate")).toBe(
      'Basic realm="Staging", charset="UTF-8"',
    );
    expect(response.headers.get("X-Robots-Tag")).toBe(
      "noindex, nofollow, noarchive",
    );
    expect(context.next).not.toHaveBeenCalled();
  });

  it("returns 401 with WWW-Authenticate for invalid auth on protected branches", async () => {
    const wrongToken = Buffer.from("shared-user:wrong-pass").toString("base64");
    const context = createContext({
      url: "https://stg.douren-frontend.pages.dev",
      branch: "stg",
      authorization: `Basic ${wrongToken}`,
    });

    const response = await onRequest(context);

    expect(response.status).toBe(401);
    expect(response.headers.get("WWW-Authenticate")).toBe(
      'Basic realm="Staging", charset="UTF-8"',
    );
    expect(response.headers.get("X-Robots-Tag")).toBe(
      "noindex, nofollow, noarchive",
    );
    expect(context.next).not.toHaveBeenCalled();
  });

  it("allows authorized protected branches and adds noindex header", async () => {
    const token = Buffer.from("shared-user:shared-pass").toString("base64");
    const context = createContext({
      url: "https://stg.douren-frontend.pages.dev",
      branch: "stg",
      authorization: `Basic ${token}`,
    });

    const response = await onRequest(context);

    expect(response.status).toBe(200);
    expect(response.headers.get("X-Robots-Tag")).toBe(
      "noindex, nofollow, noarchive",
    );
    expect(context.next).toHaveBeenCalledOnce();
  });
});
