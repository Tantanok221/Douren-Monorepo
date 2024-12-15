import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(async (opts) => {
	return opts.next(opts.ctx);
});
