import { publicProcedure, router } from "@/trpc";
import { Hono } from "hono";
import { BACKEND_BINDING } from "@pkg/env/constant";
import { fetchTag } from "@/Dao/Tag";

export const trpcTagRoute = router({
	getTag: publicProcedure.query(async (opts) => {
		const data = fetchTag(opts.ctx.env.DATABASE_URL);
		return data;
	}),
});

export const TagRoute = new Hono<{ Bindings: BACKEND_BINDING }>().get(
	"/",
	async (c) => {
		const data = fetchTag(c.env.DATABASE_URL);
		return c.json(data);
	},
);
