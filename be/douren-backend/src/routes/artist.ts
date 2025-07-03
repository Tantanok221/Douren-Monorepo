import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
	CreateArtistSchema,
	CreateArtistSchemaTypes,
	DeleteAristSchema,
	GetArtistByIdSchema,
	UpdateArtistSchema,
} from "@/schema/artist.zod";
import { authProcedure, publicProcedure, router } from "@/trpc";
import { artistInputParams } from "@pkg/type";
import { NewArtistDao } from "@/Dao/Artist";
import { zodSchema, zodSchemaType } from "@pkg/database/zod";
import { HonoEnv } from "@/index";

export const trpcArtistRoute = router({
	getArtist: publicProcedure.input(artistInputParams).query(async (opts) => {
		const ArtistDao = NewArtistDao(opts.ctx.db);
		return await ArtistDao.Fetch(opts.input);
	}),
	getArtistById: publicProcedure
		.input(GetArtistByIdSchema)
		.query(async (opts) => {
			const ArtistDao = NewArtistDao(opts.ctx.db);
			return await ArtistDao.FetchById(opts.input.id);
		}),
	getArtistPageDetails: publicProcedure
		.input(GetArtistByIdSchema)
		.query(async (opts) => {
			const ArtistDao = NewArtistDao(opts.ctx.db);
			return await ArtistDao.FetchArtistPageDetails(opts.input.id);
		}),
	createArtist: authProcedure
		.input(CreateArtistSchema)
		.mutation(async (opts) => {
			const ArtistDao = NewArtistDao(opts.ctx.db);
			return await ArtistDao.Create(opts.input);
		}),
	updateArtist: authProcedure
		.input(UpdateArtistSchema)
		.mutation(async (opts) => {
			const ArtistDao = NewArtistDao(opts.ctx.db);
			return await ArtistDao.Update(opts.input.id, opts.input.data);
		}),
	deleteArtist: authProcedure
		.input(DeleteAristSchema)
		.mutation(async (opts) => {
			const ArtistDao = NewArtistDao(opts.ctx.db);
			return await ArtistDao.Delete(opts.input.id);
		}),
});

const ArtistRoute = new Hono<HonoEnv>()
	.get("/", zValidator("query", artistInputParams), async (c) => {
		const ArtistDao = NewArtistDao(c.var.db);
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
		const ArtistDao = NewArtistDao(c.var.db);
		const body: CreateArtistSchemaTypes = await c.req.json();
		const returnResponse = await ArtistDao.Create(body);
		return c.json(returnResponse, 200);
	})
	.delete("/:artistId", async (c) => {
		const ArtistDao = NewArtistDao(c.var.db);
		const { artistId } = c.req.param();
		const returnResponse = ArtistDao.Delete(artistId);
		return c.json(returnResponse, 200);
	})
	.put(
		"/:artistId",
		zValidator("json", zodSchema.authorMain.InsertSchema),
		async (c) => {
			const ArtistDao = NewArtistDao(c.var.db);
			const { artistId } = c.req.param();
			const body: zodSchemaType["authorMain"]["InsertSchema"] =
				await c.req.json();
			const returnResponse = await ArtistDao.Update(artistId, body);

			return c.json(returnResponse, 200);
		},
	);

export default ArtistRoute;
