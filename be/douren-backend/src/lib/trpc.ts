import { initTRPC, TRPCError } from "@trpc/server";
import { ENV_BINDING } from "@pkg/env/constant";
import type { HonoVariables } from "@/types/hono";
import { Context } from "hono";
import { isAdmin } from "@/lib/authorization";
import { assertAuthenticatedSession } from "@/lib/auth/guards";

type HonoContext = {
	env: ENV_BINDING;
	honoContext: Context;
} & HonoVariables;

const t = initTRPC.context<HonoContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

type AuthContext = HonoContext & {
	user: NonNullable<HonoContext["user"]>;
	session: NonNullable<HonoContext["session"]>;
};

export const authProcedure: ReturnType<typeof t.procedure.use<AuthContext>> =
	t.procedure.use(async (opts) => {
		const { user, session } = assertAuthenticatedSession(opts.ctx);
		return opts.next({
			ctx: {
				...opts.ctx,
				session,
				user,
			},
		});
	});

type AdminContext = AuthContext & {
	isAdmin: boolean;
};

export const adminProcedure: ReturnType<
	typeof authProcedure.use<AdminContext>
> = authProcedure.use(async (opts) => {
	const userIsAdmin = await isAdmin(opts.ctx.db, opts.ctx.user.id);

	if (!userIsAdmin) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Admin access required",
		});
	}

	return opts.next({
		ctx: {
			...opts.ctx,
			isAdmin: true as const,
		},
	});
});
