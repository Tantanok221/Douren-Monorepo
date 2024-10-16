import { Hono } from "hono";
import { BACKEND_BINDING } from "@pkg/env/constant";
import { desc, eq } from "drizzle-orm";
import { initDB, s } from "@pkg/database/db";
import { zValidator } from "@hono/zod-validator";
import {
	CreateArtistSchema,
	CreateArtistSchemaTypes,
} from "../schema/artist.zod";
import { verifyUser } from "../utlis/authHelper";
import { publicProcedure, router } from "../trpc";
import { zodSchema, zodSchemaType } from "@pkg/database/zod";
import { artistInputParams, artistSchema } from "@pkg/type";
import { NewArtistDao } from "../Dao/Artist";

const ArtistDao = NewArtistDao();

export const trpcArtistRoute = router({
	getArtist: publicProcedure.input(artistInputParams).query(async (opts) => {
		const data = await ArtistDao.Fetch(opts.input);
		return data;
	}),
});

const ArtistRoute = new Hono<{ Bindings: BACKEND_BINDING }>()
	.get("/", zValidator("query", artistInputParams), async (c) => {
		const { page, search, tag, sort, searchTable } = c.req.query();
		const returnObj = await ArtistDao.Fetch({
			page,
			search,
			tag,
			sort,
			searchTable,
		});
		return c.json(returnObj);
	})
	.post("/", zValidator("json", CreateArtistSchema), async (c) => {
		const verified = verifyUser(c);
		if (!verified)
			return c.json(
				{ message: "You are not authorized to create artist" },
				401,
			);

		const body: CreateArtistSchemaTypes = await c.req.json();
		const db = initDB();
		const [counts] = await db
			.select({ count: s.authorMain.uuid })
			.from(s.authorMain)
			.orderBy(desc(s.authorMain.uuid))
			.limit(1);
		if (!body.uuid) {
			body.uuid = counts.count + 1;
		}
		const returnResponse = await db
			.insert(s.authorMain)
			.values(body)
			.onConflictDoNothing({ target: s.authorMain.uuid })
			.returning();
		return c.json(returnResponse, 200);
	})
	.delete("/:artistId", async (c) => {
		const verified = verifyUser(c);
		if (!verified)
			return c.json(
				{ message: "You are not authorized to create artist" },
				401,
			);
		const { artistId } = c.req.param();
		const db = initDB();
		const returnResponse = await db
			.delete(s.authorMain)
			.where(eq(s.authorMain.uuid, Number(artistId)))
			.returning();
		return c.json(returnResponse, 200);
	})
	.put(
		"/:artistId",
		zValidator("json", zodSchema.authorMain.InsertSchema),
		async (c) => {
			const verified = verifyUser(c);
			if (!verified)
				return c.json(
					{ message: "You are not authorized to create artist" },
					401,
				);
			const body: zodSchemaType["authorMain"]["InsertSchema"] =
				await c.req.json();
			const { artistId } = c.req.param();
			const db = initDB();
			body.uuid = Number(artistId);
			const returnResponse = await db
				.update(s.authorMain)
				.set(body)
				.where(eq(s.authorMain.uuid, Number(artistId)))
				.returning();
			return c.json(returnResponse, 200);
		},
	);

export default ArtistRoute;
