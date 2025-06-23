import { initTRPC, TRPCError } from "@trpc/server";
import { BACKEND_BINDING } from "@pkg/env/constant";
import { HonoVariables } from "@/index";
import { Context } from "hono";
import { verifyAdminUser, verifyImageUser } from "@/utlis/authHelper";

type HonoContext = {
	env: BACKEND_BINDING;
	honoContext: Context;
} & HonoVariables;

const t = initTRPC.context<HonoContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const adminProcedure = t.procedure.use(async (opts) => {
	const verified = verifyAdminUser(opts.ctx.honoContext);
	if (!verified) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return opts.next();
});

export const imageProcedure = t.procedure.use(async (opts) => {
	const verified = verifyImageUser(opts.ctx.honoContext);
	if (!verified) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return opts.next();
});

// Keep the old authProcedure for backward compatibility during transition
export const authProcedure = adminProcedure;
