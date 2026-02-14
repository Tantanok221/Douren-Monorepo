import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";

import type { HonoVariables } from "@/types/hono";
import {
	assertAuthenticatedSession,
	UNAUTHORIZED_MESSAGE,
} from "@/lib/auth/guards";

describe("auth guards", () => {
	it("throws UNAUTHORIZED when user is missing", () => {
		const ctx: Pick<HonoVariables, "user" | "session"> = {
			user: null,
			session: null,
		};

		expect(() => assertAuthenticatedSession(ctx)).toThrowError(TRPCError);
		expect(() => assertAuthenticatedSession(ctx)).toThrowError(
			UNAUTHORIZED_MESSAGE,
		);
	});

	it("returns user and session when present", () => {
		const ctx: Pick<HonoVariables, "user" | "session"> = {
			user: { id: "user-1" } as NonNullable<HonoVariables["user"]>,
			session: { id: "session-1" } as NonNullable<HonoVariables["session"]>,
		};

		const result = assertAuthenticatedSession(ctx);
		expect(result.user).toBe(ctx.user);
		expect(result.session).toBe(ctx.session);
	});
});
