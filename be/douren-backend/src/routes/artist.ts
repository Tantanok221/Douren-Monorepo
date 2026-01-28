import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import {
	CreateArtistSchema,
	DeleteAristSchema,
	GetArtistByIdSchema,
	UpdateArtistSchema,
} from "@/schema/artist.zod";
import { authProcedure, publicProcedure, router } from "@/lib/trpc";
import { artistInputParams, artistSchema } from "@pkg/type";
import { NewArtistDao } from "@/Dao/Artist";
import { zodSchema, zodSchemaType } from "@pkg/database/zod";
import { HonoEnv } from "@/index";
import { canEditArtist, canDeleteArtist } from "@/lib/authorization";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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

			const artistData = {
				...opts.input,
				userId: opts.ctx.user.id,
			};

			return await ArtistDao.Create(artistData);
		}),
	updateArtist: authProcedure
		.input(UpdateArtistSchema)
		.mutation(async (opts) => {
			const ArtistDao = NewArtistDao(opts.ctx.db);

			const authorized = await canEditArtist(
				opts.ctx.db,
				opts.ctx.user.id,
				Number(opts.input.id),
			);

			if (!authorized) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You don't have permission to edit this artist",
				});
			}

			return await ArtistDao.Update(opts.input.id, opts.input.data);
		}),
	deleteArtist: authProcedure
		.input(DeleteAristSchema)
		.mutation(async (opts) => {
			const ArtistDao = NewArtistDao(opts.ctx.db);

			const authorized = await canDeleteArtist(
				opts.ctx.db,
				opts.ctx.user.id,
				Number(opts.input.id),
			);

			if (!authorized) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You don't have permission to delete this artist",
				});
			}

			return await ArtistDao.Delete(opts.input.id);
		}),
});

const listArtistRoute = createRoute({
	method: "get",
	path: "/",
	tags: ["Artist"],
	request: {
		query: artistInputParams,
	},
	responses: {
		200: {
			description: "Paginated artist list",
			content: { "application/json": { schema: artistSchema } },
		},
	},
});

const getArtistByIdRoute = createRoute({
	method: "get",
	path: "/{artistId}",
	tags: ["Artist"],
	request: {
		params: z.object({ artistId: z.string() }),
	},
	responses: {
		200: {
			description: "Artist by ID",
			content: {
				"application/json": {
					schema: zodSchema.authorMain.SelectSchema.nullable(),
				},
			},
		},
	},
});

const createArtistRoute = createRoute({
	method: "post",
	path: "/",
	tags: ["Artist"],
	request: {
		body: {
			content: {
				"application/json": { schema: CreateArtistSchema },
			},
		},
	},
	responses: {
		200: {
			description: "Create artist",
			content: {
				"application/json": {
					schema: z.array(zodSchema.authorMain.SelectSchema),
				},
			},
		},
	},
});

const deleteArtistRoute = createRoute({
	method: "delete",
	path: "/{artistId}",
	tags: ["Artist"],
	request: {
		params: z.object({ artistId: z.string() }),
	},
	responses: {
		200: {
			description: "Delete artist",
			content: {
				"application/json": {
					schema: z.array(zodSchema.authorMain.SelectSchema),
				},
			},
		},
		403: {
			description:
				"Forbidden - User does not have permission to delete this artist",
			content: {
				"application/json": {
					schema: z.object({ message: z.string() }),
				},
			},
		},
	},
});

const updateArtistRoute = createRoute({
	method: "put",
	path: "/{artistId}",
	tags: ["Artist"],
	request: {
		params: z.object({ artistId: z.string() }),
		body: {
			content: {
				"application/json": { schema: zodSchema.authorMain.InsertSchema },
			},
		},
	},
	responses: {
		200: {
			description: "Update artist",
			content: {
				"application/json": {
					schema: z.array(zodSchema.authorMain.SelectSchema),
				},
			},
		},
		403: {
			description:
				"Forbidden - User does not have permission to edit this artist",
			content: {
				"application/json": {
					schema: z.object({ message: z.string() }),
				},
			},
		},
	},
});

const ArtistRoute = new OpenAPIHono<HonoEnv>()
	.openapi(listArtistRoute, async (c) => {
		const ArtistDao = NewArtistDao(c.var.db);
		const query = c.req.valid("query");
		const returnObj = await ArtistDao.Fetch(query);
		return c.json(returnObj);
	})
	.openapi(getArtistByIdRoute, async (c) => {
		const ArtistDao = NewArtistDao(c.var.db);
		const { artistId } = c.req.valid("param");
		const returnObj = await ArtistDao.FetchById(artistId);
		return c.json(returnObj ?? null);
	})
	.openapi(createArtistRoute, async (c) => {
		const user = c.get("user");
		// sessionAuthMiddleware guarantees user exists for POST requests
		if (!user) {
			return c.json(
				[] as z.infer<typeof zodSchema.authorMain.SelectSchema>[],
				200,
			);
		}

		const ArtistDao = NewArtistDao(c.var.db);
		const body = c.req.valid("json");

		// Associate the artist with the authenticated user
		const artistData = {
			...body,
			userId: user.id,
		};

		const returnResponse = await ArtistDao.Create(artistData);
		return c.json(returnResponse, 200);
	})
	.openapi(deleteArtistRoute, async (c) => {
		const user = c.get("user");
		// sessionAuthMiddleware guarantees user exists for DELETE requests
		if (!user) {
			return c.json(
				[] as z.infer<typeof zodSchema.authorMain.SelectSchema>[],
				200,
			);
		}

		const { artistId } = c.req.valid("param");

		// Check if user is authorized to delete this artist
		const authorized = await canDeleteArtist(
			c.var.db,
			user.id,
			Number(artistId),
		);

		if (!authorized) {
			return c.json(
				{ message: "You don't have permission to delete this artist" },
				403,
			);
		}

		const ArtistDao = NewArtistDao(c.var.db);
		const returnResponse = await ArtistDao.Delete(artistId);
		return c.json(returnResponse, 200);
	})
	.openapi(updateArtistRoute, async (c) => {
		const user = c.get("user");
		// sessionAuthMiddleware guarantees user exists for PUT requests
		if (!user) {
			return c.json(
				[] as z.infer<typeof zodSchema.authorMain.SelectSchema>[],
				200,
			);
		}

		const { artistId } = c.req.valid("param");

		// Check if user is authorized to edit this artist
		const authorized = await canEditArtist(c.var.db, user.id, Number(artistId));

		if (!authorized) {
			return c.json(
				{ message: "You don't have permission to edit this artist" },
				403,
			);
		}

		const ArtistDao = NewArtistDao(c.var.db);
		const body: zodSchemaType["authorMain"]["InsertSchema"] =
			c.req.valid("json");
		const returnResponse = await ArtistDao.Update(artistId, body);
		return c.json(returnResponse, 200);
	});

export default ArtistRoute;
