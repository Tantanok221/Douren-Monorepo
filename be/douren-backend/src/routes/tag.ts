import { publicProcedure, router } from "@/trpc";
import { Hono } from "hono";
import { BACKEND_BINDING } from "@pkg/env/constant";
import { initDB, s } from "@pkg/database/db";

export const trpcTagRoute = router({
	getTag: publicProcedure.query(async () => {
		const db = initDB();
		const data = await db.select().from(s.tag);
		return data;
	}),
});

export const TagRoute = new Hono<{ Bindings: BACKEND_BINDING }>().get(
	"/",
	async (c) => {
		const db = initDB();
		const data = await db.select().from(s.tag);
		return c.json(data);
	},
);
