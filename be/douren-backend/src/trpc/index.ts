import { initTRPC } from "@trpc/server";
import { BACKEND_BINDING } from "@pkg/env/constant";

type HonoContext = {
	env: BACKEND_BINDING
}

const t = initTRPC.context<HonoContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure