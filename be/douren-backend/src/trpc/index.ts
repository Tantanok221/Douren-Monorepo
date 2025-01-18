import { initTRPC, TRPCError } from "@trpc/server";
import { BACKEND_BINDING } from "@pkg/env/constant";
import { HonoVariables } from "@/index";
import { verifyUser } from "@/utlis/authHelper";
import { Context } from "hono";

type HonoContext = {
	env: BACKEND_BINDING;
	honoContext: Context;
} & HonoVariables;

const t = initTRPC.context<HonoContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(async (opts) => {
	const { ctx } = opts;
	if (!verifyUser(ctx.honoContext))
		throw new TRPCError({ code: "UNAUTHORIZED" });
	return opts.next();
});
