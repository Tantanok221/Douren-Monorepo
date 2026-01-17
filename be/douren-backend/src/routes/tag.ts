import { publicProcedure, router } from "@/lib/trpc";
import { Hono } from "hono";
import { fetchTag } from "@/Dao/Tag";
import { HonoEnv } from "@/index";

export const trpcTagRoute = router({
	getTag: publicProcedure.query(async (opts) => {
		const data = await fetchTag(opts.ctx.db);
		if (!data) throw new Error("Fetch Tag Had Failed");
		return data;
	}),
});

export const TagRoute = new Hono<HonoEnv>().get("/", async (c) => {
	const data = fetchTag(c.var.db);
	return c.json(data);
});
