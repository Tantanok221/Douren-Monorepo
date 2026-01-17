import { describe, expect, it, vi } from "vitest";
import { Context } from "hono";
import {
	verifyUser,
	verifyAdminUser,
	verifyImageUser,
} from "@/utlis/authHelper";

describe("verifyUser", () => {
	const createMockContext = (
		authHeader?: string,
		viteBasicAuthToken?: string,
		cloudflareImageAuthToken?: string,
	): Context => {
		return {
			req: {
				header: vi.fn((name: string) => {
					if (name === "Authorization") return authHeader;
					return undefined;
				}),
			},
			env: {
				vite_basic_auth_token: viteBasicAuthToken,
				CLOUDFLARE_IMAGE_AUTH_TOKEN: cloudflareImageAuthToken,
			},
		} as unknown as Context;
	};

	describe("vite basic auth token validation", () => {
		it("should return true when token matches vite_basic_auth_token", () => {
			const token = "valid-basic-token";
			const mockContext = createMockContext(`Bearer ${token}`, token);
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});

		it("should return false when token does not match vite_basic_auth_token", () => {
			const mockContext = createMockContext(
				"Bearer wrong-token",
				"correct-basic-token",
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});
	});

	describe("cloudflare image auth token validation", () => {
		it("should return true when token matches CLOUDFLARE_IMAGE_AUTH_TOKEN", () => {
			const token = "valid-cloudflare-token";
			const mockContext = createMockContext(
				`Bearer ${token}`,
				"different-basic-token",
				token,
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});

		it("should return false when token does not match CLOUDFLARE_IMAGE_AUTH_TOKEN", () => {
			const mockContext = createMockContext(
				"Bearer wrong-token",
				"different-basic-token",
				"correct-cloudflare-token",
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});
	});

	describe("authorization header parsing", () => {
		it("should correctly parse Bearer token from Authorization header", () => {
			const token = "correct-token";
			const mockContext = createMockContext(`Bearer ${token}`, token);
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});

		it("should reject missing Authorization header", () => {
			const mockContext = createMockContext(
				undefined,
				"some-token",
				"another-token",
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});

		it("should reject missing Authorization header even with undefined tokens", () => {
			const mockContext = createMockContext(undefined, undefined, undefined);
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});

		it("should reject malformed Authorization header without Bearer prefix", () => {
			const mockContext = createMockContext(
				"just-a-token",
				"just-a-token",
				"just-a-token",
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});

		it("should reject Authorization header with only Bearer keyword", () => {
			const mockContext = createMockContext("Bearer", "token", "token");
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});

		it("should reject Authorization header with extra spaces after Bearer", () => {
			const token = "correct-token";
			const mockContext = createMockContext(`Bearer  ${token}`, token);
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});

		it("should reject empty Authorization header", () => {
			const mockContext = createMockContext("", "token", "token");
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});

		it("should reject Authorization header with Bearer and empty token", () => {
			const mockContext = createMockContext("Bearer ", "token", "token");
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});

		it("should reject non-Bearer authorization schemes", () => {
			const mockContext = createMockContext(
				"Basic dXNlcjpwYXNz",
				"token",
				"token",
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});
	});

	describe("token precedence", () => {
		it("should check vite_basic_auth_token first", () => {
			const basicToken = "basic-token";
			const cloudflareToken = "cloudflare-token";
			const mockContext = createMockContext(
				`Bearer ${basicToken}`,
				basicToken,
				cloudflareToken,
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});

		it("should fall back to CLOUDFLARE_IMAGE_AUTH_TOKEN when vite_basic_auth_token doesn't match", () => {
			const cloudflareToken = "cloudflare-token";
			const mockContext = createMockContext(
				`Bearer ${cloudflareToken}`,
				"different-basic-token",
				cloudflareToken,
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});
	});

	describe("edge cases", () => {
		it("should return false when environment tokens are undefined", () => {
			const mockContext = createMockContext(
				"Bearer some-token",
				undefined,
				undefined,
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});

		it("should return false when environment tokens are empty strings", () => {
			const mockContext = createMockContext("Bearer token", "", "");
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});

		it("should return true when token matches vite_basic_auth_token", () => {
			const token = "valid-token";
			const mockContext = createMockContext(`Bearer ${token}`, token);
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});

		it("should return false when no valid tokens match", () => {
			const mockContext = createMockContext(
				"Bearer wrong-token",
				"correct-basic",
				"correct-cloudflare",
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});

		it("should require both valid header format AND matching token", () => {
			const mockContext = createMockContext(
				"Bearer valid-token",
				"different-token",
				"another-different-token",
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});

		it("should reject when token is undefined even with proper Bearer format", () => {
			const mockContext = createMockContext(
				"Bearer undefined",
				undefined,
				undefined,
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});
	});

	describe("case sensitivity", () => {
		it("should be case sensitive for Bearer keyword", () => {
			const mockContext = createMockContext(
				"bearer valid-token",
				"valid-token",
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});

		it("should be case sensitive for token comparison", () => {
			const mockContext = createMockContext("Bearer TOKEN", "token");
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});
	});
});

describe("verifyAdminUser", () => {
	const createMockContext = (
		authHeader?: string,
		viteAdminAuthToken?: string,
	): Context => {
		return {
			req: {
				header: vi.fn((name: string) => {
					if (name === "Authorization") return authHeader;
					return undefined;
				}),
			},
			env: {
				VITE_ADMIN_AUTH_TOKEN: viteAdminAuthToken,
			},
		} as unknown as Context;
	};

	describe("admin auth token validation", () => {
		it("should return true when token matches VITE_ADMIN_AUTH_TOKEN", () => {
			const token = "valid-admin-token";
			const mockContext = createMockContext(`Bearer ${token}`, token);
			const result = verifyAdminUser(mockContext);
			expect(result).toBe(true);
		});

		it("should return false when token does not match VITE_ADMIN_AUTH_TOKEN", () => {
			const mockContext = createMockContext(
				"Bearer wrong-token",
				"correct-admin-token",
			);
			const result = verifyAdminUser(mockContext);
			expect(result).toBe(false);
		});

		it("should return falsy when VITE_ADMIN_AUTH_TOKEN is undefined", () => {
			const mockContext = createMockContext("Bearer some-token", undefined);
			const result = verifyAdminUser(mockContext);
			expect(result).toBeFalsy();
		});
	});

	describe("authorization header validation", () => {
		it("should reject missing Authorization header", () => {
			const mockContext = createMockContext(undefined, "some-token");
			const result = verifyAdminUser(mockContext);
			expect(result).toBe(false);
		});

		it("should reject malformed Authorization header without Bearer prefix", () => {
			const mockContext = createMockContext("just-a-token", "just-a-token");
			const result = verifyAdminUser(mockContext);
			expect(result).toBe(false);
		});

		it("should reject Authorization header with only Bearer keyword", () => {
			const mockContext = createMockContext("Bearer", "token");
			const result = verifyAdminUser(mockContext);
			expect(result).toBe(false);
		});
	});
});

describe("verifyImageUser", () => {
	const createMockContext = (
		authHeader?: string,
		cloudflareImageAuthToken?: string,
	): Context => {
		return {
			req: {
				header: vi.fn((name: string) => {
					if (name === "Authorization") return authHeader;
					return undefined;
				}),
			},
			env: {
				CLOUDFLARE_IMAGE_AUTH_TOKEN: cloudflareImageAuthToken,
			},
		} as unknown as Context;
	};

	describe("cloudflare image auth token validation", () => {
		it("should return true when token matches CLOUDFLARE_IMAGE_AUTH_TOKEN", () => {
			const token = "valid-cloudflare-token";
			const mockContext = createMockContext(`Bearer ${token}`, token);
			const result = verifyImageUser(mockContext);
			expect(result).toBe(true);
		});

		it("should return false when token does not match CLOUDFLARE_IMAGE_AUTH_TOKEN", () => {
			const mockContext = createMockContext(
				"Bearer wrong-token",
				"correct-cloudflare-token",
			);
			const result = verifyImageUser(mockContext);
			expect(result).toBe(false);
		});

		it("should return falsy when CLOUDFLARE_IMAGE_AUTH_TOKEN is undefined", () => {
			const mockContext = createMockContext("Bearer some-token", undefined);
			const result = verifyImageUser(mockContext);
			expect(result).toBeFalsy();
		});
	});

	describe("authorization header validation", () => {
		it("should reject missing Authorization header", () => {
			const mockContext = createMockContext(undefined, "some-token");
			const result = verifyImageUser(mockContext);
			expect(result).toBe(false);
		});

		it("should reject malformed Authorization header without Bearer prefix", () => {
			const mockContext = createMockContext("just-a-token", "just-a-token");
			const result = verifyImageUser(mockContext);
			expect(result).toBe(false);
		});

		it("should reject Authorization header with only Bearer keyword", () => {
			const mockContext = createMockContext("Bearer", "token");
			const result = verifyImageUser(mockContext);
			expect(result).toBe(false);
		});
	});

	describe("token specificity", () => {
		it("should NOT accept other tokens even if valid format", () => {
			const basicToken = "basic-token";
			const mockContext = createMockContext(
				`Bearer ${basicToken}`,
				"different-cloudflare-token",
			);
			const result = verifyImageUser(mockContext);
			expect(result).toBe(false);
		});

		it("should only accept CLOUDFLARE_IMAGE_AUTH_TOKEN", () => {
			const cloudflareToken = "cloudflare-token";
			const mockContext = createMockContext(
				`Bearer ${cloudflareToken}`,
				cloudflareToken,
			);
			const result = verifyImageUser(mockContext);
			expect(result).toBe(true);
		});
	});
});
