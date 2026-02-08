import { describe, expect, it } from "vitest";

import {
  getBranchName,
  isAuthorizedRequest,
  isProtectedBranch,
  withNoIndexHeader,
} from "./auth";

describe("staging auth helpers", () => {
  it("uses env branch when available", () => {
    expect(getBranchName("stg", "pr-42.douren-frontend.pages.dev")).toBe("stg");
  });

  it("falls back to hostname subdomain", () => {
    expect(getBranchName(undefined, "pr-42.douren-frontend.pages.dev")).toBe("pr-42");
  });

  it("protects staging and pr branches only", () => {
    expect(isProtectedBranch("stg")).toBe(true);
    expect(isProtectedBranch("pr-42")).toBe(true);
    expect(isProtectedBranch("main")).toBe(false);
  });

  it("accepts matching basic auth credentials", () => {
    const token = Buffer.from("shared-user:shared-pass").toString("base64");

    expect(
      isAuthorizedRequest(`Basic ${token}`, "shared-user", "shared-pass"),
    ).toBe(true);
  });

  it("rejects invalid basic auth credentials", () => {
    const token = Buffer.from("shared-user:wrong").toString("base64");

    expect(
      isAuthorizedRequest(`Basic ${token}`, "shared-user", "shared-pass"),
    ).toBe(false);
    expect(isAuthorizedRequest("Bearer token", "shared-user", "shared-pass")).toBe(
      false,
    );
  });

  it("adds noindex header", () => {
    const response = withNoIndexHeader(new Response("ok", { status: 200 }));

    expect(response.headers.get("X-Robots-Tag")).toBe(
      "noindex, nofollow, noarchive",
    );
  });
});
