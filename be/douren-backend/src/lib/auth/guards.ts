import { TRPCError } from "@trpc/server";
import type { Context } from "hono";

import type { HonoEnv, HonoVariables } from "@/index";

export const UNAUTHORIZED_MESSAGE =
	"You must be logged in to access this resource";

export type AuthenticatedSession = {
	user: NonNullable<HonoVariables["user"]>;
	session: NonNullable<HonoVariables["session"]>;
};

export function assertAuthenticatedSession(
	ctx: Pick<HonoVariables, "user" | "session">,
): AuthenticatedSession {
	const { user, session } = ctx;
	if (!user || !session) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: UNAUTHORIZED_MESSAGE,
		});
	}
	return { user, session };
}

export function respondUnauthorized(c: Context<HonoEnv>): Response {
	return c.json({ message: UNAUTHORIZED_MESSAGE }, 401);
}

export function requireAuthenticatedUser(
	c: Context<HonoEnv>,
): NonNullable<HonoVariables["user"]> | Response {
	const user = c.get("user");
	if (!user) return respondUnauthorized(c);
	return user;
}
