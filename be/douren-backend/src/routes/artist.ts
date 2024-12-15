import { Hono } from "hono";
import { BACKEND_BINDING } from "@pkg/env/constant";
import { zValidator } from "@hono/zod-validator";
import {
	CreateArtistSchema,
	CreateArtistSchemaTypes,
} from "../schema/artist.zod";
import { verifyUser } from "../utlis/authHelper";
import { authProcedure, publicProcedure, router } from "../trpc";
import { artistInputParams } from "@pkg/type";
import { NewArtistDao } from "../Dao/Artist";
import { zodSchema, zodSchemaType } from "@pkg/database/zod";

const ArtistDao = NewArtistDao();

export const trpcArtistRoute = router({
	getArtist: publicProcedure.input(artistInputParams).query(async (opts) => {
		return await ArtistDao.Fetch(opts.input);
	}),
	createArtist: authProcedure
		.input(CreateArtistSchema)
		.mutation(async (opts) => {
			return await ArtistDao.Create(opts.input);
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
		const returnResponse = await ArtistDao.Create(body);
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
		const returnResponse = ArtistDao.Delete(artistId)
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
			const { artistId } = c.req.param();
			const body: zodSchemaType["authorMain"]["InsertSchema"] = await c.req.json();
			const returnResponse = await ArtistDao.Update(artistId,body)

			return c.json(returnResponse, 200);
		},
	);

export default ArtistRoute;
