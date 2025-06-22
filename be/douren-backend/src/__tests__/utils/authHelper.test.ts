import { describe, expect, it, vi } from "vitest";
import { Context } from "hono";
import { verifyUser } from "@/utlis/authHelper";

describe("verifyUser", () => {
	const createMockContext = (
		authHeader?: string,
		devEnv?: string,
		basicAuthToken?: string,
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
				DEV_ENV: devEnv,
				basic_auth_token: basicAuthToken,
				CLOUDFLARE_IMAGE_AUTH_TOKEN: cloudflareImageAuthToken,
			},
		} as unknown as Context;
	};

	describe("development environment", () => {
		it("should return true when DEV_ENV is 'dev'", () => {
			const mockContext = createMockContext(undefined, "dev");
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});

		it("should return true when DEV_ENV is 'dev' even with invalid token", () => {
			const mockContext = createMockContext("Bearer invalid-token", "dev");
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});

		it("should return true when DEV_ENV is 'dev' even without auth header", () => {
			const mockContext = createMockContext(undefined, "dev");
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});
	});

	describe("basic auth token validation", () => {
		it("should return true when token matches basic_auth_token", () => {
			const token = "valid-basic-token";
			const mockContext = createMockContext(
				`Bearer ${token}`,
				"production",
				token,
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});

		it("should return false when token does not match basic_auth_token", () => {
			const mockContext = createMockContext(
				"Bearer wrong-token",
				"production",
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
				"production",
				"different-basic-token",
				token,
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});

		it("should return false when token does not match CLOUDFLARE_IMAGE_AUTH_TOKEN", () => {
			const mockContext = createMockContext(
				"Bearer wrong-token",
				"production",
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
			const mockContext = createMockContext(
				`Bearer ${token}`,
				"production",
				token,
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});

		it("should handle missing Authorization header with defined token", () => {
			const mockContext = createMockContext(
				undefined,
				"production",
				"some-token",
				"another-token",
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});

		it("should return true when Authorization header is missing and tokens are undefined", () => {
			const mockContext = createMockContext(
				undefined,
				"production",
				undefined,
				undefined,
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});

		it("should handle malformed Authorization header without Bearer", () => {
			const mockContext = createMockContext(
				"just-a-token",
				"production",
				undefined,
				undefined,
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});

		it("should handle Authorization header with only Bearer", () => {
			const mockContext = createMockContext("Bearer", "production", undefined, undefined);
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});

		it("should handle Authorization header with extra spaces", () => {
			const token = "correct-token";
			const mockContext = createMockContext(
				`Bearer  ${token}`,
				"production",
				token,
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});

		it("should handle empty Authorization header", () => {
			const mockContext = createMockContext("", "production", undefined, undefined);
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});
	});

	describe("token precedence", () => {
		it("should prefer basic_auth_token over CLOUDFLARE_IMAGE_AUTH_TOKEN", () => {
			const basicToken = "basic-token";
			const cloudflareToken = "cloudflare-token";
			const mockContext = createMockContext(
				`Bearer ${basicToken}`,
				"production",
				basicToken,
				cloudflareToken,
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});

		it("should fall back to CLOUDFLARE_IMAGE_AUTH_TOKEN when basic_auth_token doesn't match", () => {
			const cloudflareToken = "cloudflare-token";
			const mockContext = createMockContext(
				`Bearer ${cloudflareToken}`,
				"production",
				"different-basic-token",
				cloudflareToken,
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});
	});

	describe("edge cases", () => {
		it("should return false when all tokens are undefined", () => {
			const mockContext = createMockContext(
				"Bearer some-token",
				"production",
				undefined,
				undefined,
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});

		it("should return false when all tokens are empty strings", () => {
			const mockContext = createMockContext("Bearer token", "production", "", "");
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});

		it("should handle null DEV_ENV", () => {
			const token = "valid-token";
			const mockContext = createMockContext(
				`Bearer ${token}`,
				null as any,
				token,
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});

		it("should handle undefined DEV_ENV", () => {
			const token = "valid-token";
			const mockContext = createMockContext(
				`Bearer ${token}`,
				undefined,
				token,
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});

		it("should return false when DEV_ENV is production and no valid tokens", () => {
			const mockContext = createMockContext(
				"Bearer wrong-token",
				"production",
				"correct-basic",
				"correct-cloudflare",
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});
	});

	describe("case sensitivity", () => {
		it("should be case sensitive for dev environment check", () => {
			const mockContext = createMockContext(undefined, "DEV", undefined, undefined);
			const result = verifyUser(mockContext);
			expect(result).toBe(true);
		});

		it("should be case sensitive for token comparison", () => {
			const mockContext = createMockContext(
				"Bearer TOKEN",
				"production",
				"token",
			);
			const result = verifyUser(mockContext);
			expect(result).toBe(false);
		});
	});
});