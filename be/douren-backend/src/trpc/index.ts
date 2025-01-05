import { initTRPC } from "@trpc/server";
import { BACKEND_BINDING } from "@pkg/env/constant";
import { HonoVariables } from "@/index";

type HonoContext = {
	env: BACKEND_BINDING;
} & HonoVariables;

const t = initTRPC.context<HonoContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure;
