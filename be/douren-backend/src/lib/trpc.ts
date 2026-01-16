import { initTRPC, TRPCError } from "@trpc/server";
import { ENV_BINDING } from "@pkg/env/constant";
import { HonoVariables } from "@/index";
import { Context } from "hono";
import { isAdmin } from "@/lib/authorization";

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
		const user = opts.ctx.user;
		const session = opts.ctx.session;
		if (!user || !session) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "You must be logged in to access this resource",
			});
		}
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
