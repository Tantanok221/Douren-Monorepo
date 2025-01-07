import { publicProcedure, router } from "@/trpc";
import { Hono } from "hono";
import { BACKEND_BINDING } from "@pkg/env/constant";
import { fetchTag } from "@/Dao/Tag";
import { HonoEnv } from "@/index";

export const trpcTagRoute = router({
	getTag: publicProcedure.query(async (opts) => {
		const data = await fetchTag(opts.ctx.db, opts.ctx.redis);
		if (!data) throw new Error("Fetch Tag Had Failed");
		return data;
	}),
});

export const TagRoute = new Hono<HonoEnv>().get("/", async (c) => {
	const data = fetchTag(c.var.db, c.var.redis);
	return c.json(data);
});
