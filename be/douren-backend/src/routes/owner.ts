import { publicProcedure, router } from "@/lib/trpc";
import { NewOwnerDao } from "@/Dao/Owner";
import { HonoEnv } from "@/index";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { zodSchema } from "@pkg/database/zod";
import { z } from "zod";

export const trpcOwnerRoute = router({
	getOwner: publicProcedure.query(async (opts) => {
		const OwnerDao = NewOwnerDao(opts.ctx.db);
		return await OwnerDao.Fetch();
	}),
});

const getOwnerRoute = createRoute({
	method: "get",
	path: "/",
	tags: ["Owner"],
	responses: {
		200: {
			description: "List owners",
			content: {
				"application/json": { schema: z.array(zodSchema.owner.SelectSchema) },
			},
		},
	},
});

const OwnerRoute = new OpenAPIHono<HonoEnv>().openapi(
	getOwnerRoute,
	async (c) => {
		const OwnerDao = NewOwnerDao(c.var.db);
		const data = await OwnerDao.Fetch();
		return c.json(data);
	},
);

export default OwnerRoute;
