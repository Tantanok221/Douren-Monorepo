import { Hono } from "hono";
import { publicProcedure, router } from "@/lib/trpc";
import { NewOwnerDao } from "@/Dao/Owner";
import { HonoEnv } from "@/index";

export const trpcOwnerRoute = router({
	getOwner: publicProcedure.query(async (opts) => {
		const OwnerDao = NewOwnerDao(opts.ctx.db);
		return await OwnerDao.Fetch();
	}),
});

const OwnerRoute = new Hono<HonoEnv>().get("/", async (c) => {
	const OwnerDao = NewOwnerDao(c.var.db);
	const data = await OwnerDao.Fetch();
	return c.json(data);
});

export default OwnerRoute;
