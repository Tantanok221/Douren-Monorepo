import { publicProcedure, router } from "@/lib/trpc";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { fetchTag } from "@/Dao/Tag";
import { HonoEnv } from "@/index";
import { zodSchema } from "@pkg/database/zod";
import { z } from "zod";

export const trpcTagRoute = router({
	getTag: publicProcedure.query(async (opts) => {
		const data = await fetchTag(opts.ctx.db);
		if (!data) throw new Error("Fetch Tag Had Failed");
		return data;
	}),
});

const getTagRoute = createRoute({
	method: "get",
	path: "/",
	tags: ["Tag"],
	responses: {
		200: {
			description: "List tags",
			content: {
				"application/json": { schema: z.array(zodSchema.tag.SelectSchema) },
			},
		},
	},
});

export const TagRoute = new OpenAPIHono<HonoEnv>().openapi(
	getTagRoute,
	async (c) => {
		const data = await fetchTag(c.var.db);
		return c.json(data);
	},
);
