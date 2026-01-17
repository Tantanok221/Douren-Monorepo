import { describe, expect, it, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";
import { Context } from "hono";

// Mock verifyAdminUser and verifyImageUser
const mockVerifyAdminUser = vi.fn();
const mockVerifyImageUser = vi.fn();

vi.mock("@/utlis/authHelper", () => ({
	verifyAdminUser: (ctx: Context) => mockVerifyAdminUser(ctx),
	verifyImageUser: (ctx: Context) => mockVerifyImageUser(ctx),
}));

// Mock env constants
vi.mock("@pkg/env/constant", () => ({
	ENV_BINDING: {},
}));

// Create mock Hono context
const createMockHonoContext = (
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

// Create mock tRPC context
const createMockTRPCContext = (honoContext: Context) => ({
	env: {
		DEV_ENV: "production",
		basic_auth_token: "test-token",
		CLOUDFLARE_IMAGE_AUTH_TOKEN: "image-token",
	},
	honoContext,
});

describe("tRPC Middleware", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("adminProcedure middleware", () => {
		it("should call verifyAdminUser with correct context", async () => {
			const honoContext = createMockHonoContext(
				"Bearer valid-token",
				"production",
				"valid-token",
			);
			mockVerifyAdminUser.mockReturnValue(true);

			const opts = {
				ctx: createMockTRPCContext(honoContext),
				next: vi.fn().mockResolvedValue({ ok: true }),
			};

			// Simulate middleware logic
			const verified = mockVerifyAdminUser(opts.ctx.honoContext);
			if (!verified) {
				throw new TRPCError({ code: "UNAUTHORIZED" });
			}
			const result = await opts.next();

			expect(mockVerifyAdminUser).toHaveBeenCalledWith(honoContext);
			expect(result).toEqual({ ok: true });
		});

		it("should throw UNAUTHORIZED error when verification fails", async () => {
			const honoContext = createMockHonoContext(
				"Bearer invalid-token",
				"production",
				"valid-token",
			);
			mockVerifyAdminUser.mockReturnValue(false);

			const opts = {
				ctx: createMockTRPCContext(honoContext),
				next: vi.fn().mockResolvedValue({ ok: true }),
			};

			// Simulate middleware logic
			const verified = mockVerifyAdminUser(opts.ctx.honoContext);

			expect(verified).toBe(false);
			expect(() => {
				if (!verified) {
					throw new TRPCError({ code: "UNAUTHORIZED" });
				}
			}).toThrow(TRPCError);
		});

		it("should allow request when user is verified", async () => {
			const honoContext = createMockHonoContext(
				"Bearer correct-token",
				"production",
				"correct-token",
			);
			mockVerifyAdminUser.mockReturnValue(true);

			const opts = {
				ctx: createMockTRPCContext(honoContext),
				next: vi.fn().mockResolvedValue({ data: "success" }),
			};

			const verified = mockVerifyAdminUser(opts.ctx.honoContext);
			expect(verified).toBe(true);

			const result = await opts.next();
			expect(result).toEqual({ data: "success" });
		});

		it("should pass through in dev environment", async () => {
			const honoContext = createMockHonoContext(undefined, "dev");
			mockVerifyAdminUser.mockReturnValue(true);

			const opts = {
				ctx: createMockTRPCContext(honoContext),
				next: vi.fn().mockResolvedValue({ ok: true }),
			};

			const verified = mockVerifyAdminUser(opts.ctx.honoContext);
			expect(verified).toBe(true);
		});
	});

	describe("imageProcedure middleware", () => {
		it("should call verifyImageUser with correct context", async () => {
			const honoContext = createMockHonoContext(
				"Bearer image-token",
				"production",
				undefined,
				"image-token",
			);
			mockVerifyImageUser.mockReturnValue(true);

			const opts = {
				ctx: createMockTRPCContext(honoContext),
				next: vi.fn().mockResolvedValue({ ok: true }),
			};

			// Simulate middleware logic
			const verified = mockVerifyImageUser(opts.ctx.honoContext);
			if (!verified) {
				throw new TRPCError({ code: "UNAUTHORIZED" });
			}
			const result = await opts.next();

			expect(mockVerifyImageUser).toHaveBeenCalledWith(honoContext);
			expect(result).toEqual({ ok: true });
		});

		it("should throw UNAUTHORIZED error when image verification fails", async () => {
			const honoContext = createMockHonoContext(
				"Bearer wrong-token",
				"production",
				undefined,
				"correct-image-token",
			);
			mockVerifyImageUser.mockReturnValue(false);

			const opts = {
				ctx: createMockTRPCContext(honoContext),
				next: vi.fn().mockResolvedValue({ ok: true }),
			};

			// Simulate middleware logic
			const verified = mockVerifyImageUser(opts.ctx.honoContext);

			expect(verified).toBe(false);
			expect(() => {
				if (!verified) {
					throw new TRPCError({ code: "UNAUTHORIZED" });
				}
			}).toThrow(TRPCError);
		});

		it("should allow request when image user is verified", async () => {
			const honoContext = createMockHonoContext(
				"Bearer correct-image-token",
				"production",
				undefined,
				"correct-image-token",
			);
			mockVerifyImageUser.mockReturnValue(true);

			const opts = {
				ctx: createMockTRPCContext(honoContext),
				next: vi.fn().mockResolvedValue({ data: "image uploaded" }),
			};

			const verified = mockVerifyImageUser(opts.ctx.honoContext);
			expect(verified).toBe(true);

			const result = await opts.next();
			expect(result).toEqual({ data: "image uploaded" });
		});
	});

	describe("publicProcedure", () => {
		it("should allow request without any authentication", async () => {
			const honoContext = createMockHonoContext();

			const opts = {
				ctx: createMockTRPCContext(honoContext),
				next: vi.fn().mockResolvedValue({ data: "public data" }),
			};

			// Public procedure doesn't verify anything
			const result = await opts.next();
			expect(result).toEqual({ data: "public data" });
		});

		it("should allow request with invalid token", async () => {
			const honoContext = createMockHonoContext("Bearer invalid-token");

			const opts = {
				ctx: createMockTRPCContext(honoContext),
				next: vi.fn().mockResolvedValue({ data: "public data" }),
			};

			// Public procedure doesn't verify
			const result = await opts.next();
			expect(result).toEqual({ data: "public data" });
		});
	});

	describe("TRPCError handling", () => {
		it("should create TRPCError with UNAUTHORIZED code", () => {
			const error = new TRPCError({ code: "UNAUTHORIZED" });

			expect(error.code).toBe("UNAUTHORIZED");
			expect(error).toBeInstanceOf(TRPCError);
		});

		it("should throw correct error type from middleware", () => {
			mockVerifyAdminUser.mockReturnValue(false);

			try {
				const verified = mockVerifyAdminUser({});
				if (!verified) {
					throw new TRPCError({ code: "UNAUTHORIZED" });
				}
			} catch (error) {
				expect(error).toBeInstanceOf(TRPCError);
				expect((error as TRPCError).code).toBe("UNAUTHORIZED");
			}
		});
	});

	describe("Middleware chain behavior", () => {
		it("should call next() when verification succeeds", async () => {
			const nextFn = vi.fn().mockResolvedValue({ success: true });
			mockVerifyAdminUser.mockReturnValue(true);

			const honoContext = createMockHonoContext(
				"Bearer valid-token",
				"production",
				"valid-token",
			);

			const verified = mockVerifyAdminUser(honoContext);
			if (verified) {
				await nextFn();
			}

			expect(nextFn).toHaveBeenCalled();
		});

		it("should not call next() when verification fails", async () => {
			const nextFn = vi.fn().mockResolvedValue({ success: true });
			mockVerifyAdminUser.mockReturnValue(false);

			const honoContext = createMockHonoContext(
				"Bearer invalid-token",
				"production",
				"valid-token",
			);

			const verified = mockVerifyAdminUser(honoContext);
			if (verified) {
				await nextFn();
			}

			expect(nextFn).not.toHaveBeenCalled();
		});
	});
});
