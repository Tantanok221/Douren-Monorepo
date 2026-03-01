import { and, eq } from "drizzle-orm";
import { initDB, s } from "@pkg/database/db";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import {
	CreateEventArtistSchema,
	CreateEventSchema,
	CreateBoothSchema,
	DeleteBoothSchema,
	GetBoothByEventSchema,
	PutEventArtistSchema,
	PutEventArtistSchemaTypes,
	GetEventArtistByIdSchema,
	UpdateBoothSchema,
	UpdateEventArtistSchema,
	UpdateEventSchema,
	DeleteEventSchema,
	SetDefaultEventSchema,
} from "@/schema/event.zod";
import {
	adminProcedure,
	authProcedure,
	publicProcedure,
	router,
} from "@/lib/trpc";
import {
	artistInputParams,
	eventArtistSchema,
	eventNameInputParams,
} from "@pkg/type";
import { zodSchema } from "@pkg/database/zod";
import { NewEventArtistDao } from "@/Dao/EventArtist";
import { NewEventDao } from "@/Dao/Event";
import { NewBoothDao } from "@/Dao/Booth";
import { HonoEnv } from "@/index";
import { z } from "zod";

type EventDmSelect = z.infer<typeof zodSchema.eventDm.SelectSchema>;
type BoothSelect = z.infer<typeof zodSchema.booth.SelectSchema>;

async function enrichWithBoothFields(
	db: ReturnType<typeof initDB>,
	body: PutEventArtistSchemaTypes,
): Promise<PutEventArtistSchemaTypes> {
	if (!body.boothId) return body;

	const BoothDao = NewBoothDao(db);
	const booth = await BoothDao.FetchById(body.boothId);
	if (!booth) return body;

	return {
		...body,
		eventId: body.eventId ?? booth.eventId,
		boothName: body.boothName ?? booth.name,
		locationDay01: body.locationDay01 ?? booth.locationDay01,
		locationDay02: body.locationDay02 ?? booth.locationDay02,
		locationDay03: body.locationDay03 ?? booth.locationDay03,
	};
}

export const trpcEventRoute = router({
	getAllEvent: publicProcedure.query(async (opts) => {
		const EventDao = NewEventDao(opts.ctx.db);
		return await EventDao.FetchAll();
	}),
	getEvent: publicProcedure
		.input(artistInputParams.extend({ eventName: z.string() }))
		.query(async (opts) => {
			const EventArtistDao = NewEventArtistDao(opts.ctx.db);
			return await EventArtistDao.Fetch(opts.input);
		}),
	getEventArtistById: publicProcedure
		.input(GetEventArtistByIdSchema)
		.query(async (opts) => {
			const EventArtistDao = NewEventArtistDao(opts.ctx.db);
			return await EventArtistDao.FetchById(opts.input.id);
		}),
	getBoothsByEventId: publicProcedure
		.input(GetBoothByEventSchema)
		.query(async (opts) => {
			const BoothDao = NewBoothDao(opts.ctx.db);
			return await BoothDao.FetchByEventId(opts.input.eventId);
		}),
	getBoothViewByEventId: publicProcedure
		.input(GetBoothByEventSchema)
		.query(async (opts) => {
			const booths = await opts.ctx.db
				.select()
				.from(s.booth)
				.where(eq(s.booth.eventId, opts.input.eventId));

			const memberships = await opts.ctx.db
				.select({
					boothId: s.eventDm.boothId,
					artistId: s.authorMain.uuid,
					artistName: s.authorMain.author,
				})
				.from(s.eventDm)
				.leftJoin(s.authorMain, eq(s.authorMain.uuid, s.eventDm.artistId))
				.where(eq(s.eventDm.eventId, opts.input.eventId));

			const artistsByBooth = new Map<
				number,
				Array<{ artistId: number; artistName: string }>
			>();

			for (const membership of memberships) {
				if (!membership.boothId || !membership.artistId) continue;
				const boothArtists = artistsByBooth.get(membership.boothId) ?? [];
				boothArtists.push({
					artistId: membership.artistId,
					artistName: membership.artistName ?? "未命名繪師",
				});
				artistsByBooth.set(membership.boothId, boothArtists);
			}

			return booths.map((booth) => ({
				id: booth.id,
				eventId: booth.eventId,
				name: booth.name,
				locationDay01: booth.locationDay01,
				locationDay02: booth.locationDay02,
				locationDay03: booth.locationDay03,
				artists: artistsByBooth.get(booth.id) ?? [],
			}));
		}),
	getEventId: publicProcedure
		.input(eventNameInputParams)
		.output(zodSchema.event.SelectSchema)
		.query(async (opts) => {
			const { eventName } = opts.input;
			const db = initDB(opts.ctx.env.DATABASE_URL);
			const [data] = await db
				.select()
				.from(s.event)
				.where(eq(s.event.name, eventName));
			return data;
		}),
	createEventArtist: authProcedure
		.input(CreateEventArtistSchema)
		.mutation(async (opts) => {
			const EventArtistDao = NewEventArtistDao(opts.ctx.db);
			const payload = await enrichWithBoothFields(opts.ctx.db, opts.input);
			return await EventArtistDao.Create(payload);
		}),
	updateEventArtist: authProcedure
		.input(UpdateEventArtistSchema)
		.mutation(async (opts) => {
			const EventArtistDao = NewEventArtistDao(opts.ctx.db);
			return await EventArtistDao.Update(opts.input.id, opts.input.data);
		}),
	upsertEventArtist: authProcedure
		.input(PutEventArtistSchema)
		.mutation(async (opts) => {
			const EventArtistDao = NewEventArtistDao(opts.ctx.db);
			const payload = await enrichWithBoothFields(opts.ctx.db, opts.input);
			return await EventArtistDao.Upsert(payload);
		}),
	createBooth: authProcedure.input(CreateBoothSchema).mutation(async (opts) => {
		const BoothDao = NewBoothDao(opts.ctx.db);
		return await BoothDao.Create(opts.input);
	}),
	upsertBooth: authProcedure.input(CreateBoothSchema).mutation(async (opts) => {
		const BoothDao = NewBoothDao(opts.ctx.db);
		return await BoothDao.UpsertByEventAndName(opts.input);
	}),
	updateBooth: authProcedure
		.input(z.object({ id: z.number(), data: UpdateBoothSchema }))
		.mutation(async (opts) => {
			const BoothDao = NewBoothDao(opts.ctx.db);
			return await BoothDao.Update(opts.input.id, opts.input.data);
		}),
	deleteBooth: authProcedure.input(DeleteBoothSchema).mutation(async (opts) => {
		const BoothDao = NewBoothDao(opts.ctx.db);
		return await BoothDao.Delete(opts.input.id);
	}),
});

// Admin-only event management routes
export const trpcEventAdminRoute = router({
	getDefaultEvent: publicProcedure.query(async (opts) => {
		const EventDao = NewEventDao(opts.ctx.db);
		return await EventDao.GetDefault();
	}),
	createEvent: adminProcedure
		.input(CreateEventSchema)
		.mutation(async (opts) => {
			const EventDao = NewEventDao(opts.ctx.db);
			return await EventDao.Create(opts.input);
		}),
	updateEvent: adminProcedure
		.input(
			z.object({
				id: z.number(),
				data: UpdateEventSchema,
			}),
		)
		.mutation(async (opts) => {
			const EventDao = NewEventDao(opts.ctx.db);
			return await EventDao.Update(opts.input.id, opts.input.data);
		}),
	deleteEvent: adminProcedure
		.input(DeleteEventSchema)
		.mutation(async (opts) => {
			const EventDao = NewEventDao(opts.ctx.db);
			return await EventDao.Delete(opts.input.id);
		}),
	setDefaultEvent: adminProcedure
		.input(SetDefaultEventSchema)
		.mutation(async (opts) => {
			const EventDao = NewEventDao(opts.ctx.db);
			return await EventDao.SetDefault(opts.input.id);
		}),
});

const getEventArtistRoute = createRoute({
	method: "get",
	path: "/{eventName}/artist",
	tags: ["Event"],
	request: {
		params: z.object({ eventName: z.string() }),
		query: artistInputParams,
	},
	responses: {
		200: {
			description: "Paginated event artists list",
			content: { "application/json": { schema: eventArtistSchema } },
		},
	},
});

const listEventRoute = createRoute({
	method: "get",
	path: "/",
	tags: ["Event"],
	responses: {
		200: {
			description: "List events",
			content: {
				"application/json": { schema: z.array(zodSchema.event.SelectSchema) },
			},
		},
	},
});

const getEventByNameRoute = createRoute({
	method: "get",
	path: "/{eventName}",
	tags: ["Event"],
	request: {
		params: z.object({ eventName: z.string() }),
	},
	responses: {
		200: {
			description: "Event by name",
			content: {
				"application/json": { schema: zodSchema.event.SelectSchema.nullable() },
			},
		},
	},
});

const getBoothsByEventRoute = createRoute({
	method: "get",
	path: "/{eventId}/booth",
	tags: ["Event"],
	request: {
		params: z.object({ eventId: z.coerce.number().int().positive() }),
	},
	responses: {
		200: {
			description: "List booths by event",
			content: {
				"application/json": { schema: z.array(zodSchema.booth.SelectSchema) },
			},
		},
	},
});

const createEventArtistRoute = createRoute({
	method: "post",
	path: "/artist",
	tags: ["Event"],
	request: {
		body: {
			content: { "application/json": { schema: CreateEventArtistSchema } },
		},
	},
	responses: {
		201: {
			description: "Create event artist",
			content: {
				"application/json": { schema: z.array(zodSchema.eventDm.SelectSchema) },
			},
		},
	},
});

const createEventRoute = createRoute({
	method: "post",
	path: "/",
	tags: ["Event"],
	request: {
		body: { content: { "application/json": { schema: CreateEventSchema } } },
	},
	responses: {
		201: {
			description: "Create event",
			content: {
				"application/json": { schema: z.array(zodSchema.event.SelectSchema) },
			},
		},
	},
});

const createBoothRoute = createRoute({
	method: "post",
	path: "/booth",
	tags: ["Event"],
	request: {
		body: { content: { "application/json": { schema: CreateBoothSchema } } },
	},
	responses: {
		201: {
			description: "Create booth",
			content: {
				"application/json": { schema: z.array(zodSchema.booth.SelectSchema) },
			},
		},
	},
});

const deleteEventArtistRoute = createRoute({
	method: "delete",
	path: "/{eventId}/artist/{artistId}",
	tags: ["Event"],
	request: {
		params: z.object({ eventId: z.string(), artistId: z.string() }),
	},
	responses: {
		200: {
			description: "Delete event artist mapping",
			content: {
				"application/json": { schema: z.array(zodSchema.eventDm.SelectSchema) },
			},
		},
	},
});

const updateEventArtistRoute = createRoute({
	method: "put",
	path: "/artist/{eventArtistId}",
	tags: ["Event"],
	request: {
		params: z.object({ eventArtistId: z.string() }),
		body: {
			content: { "application/json": { schema: PutEventArtistSchema } },
		},
	},
	responses: {
		200: {
			description: "Update event artist mapping",
			content: {
				"application/json": { schema: z.array(zodSchema.eventDm.SelectSchema) },
			},
		},
	},
});

const updateBoothRoute = createRoute({
	method: "put",
	path: "/booth/{boothId}",
	tags: ["Event"],
	request: {
		params: z.object({ boothId: z.coerce.number().int().positive() }),
		body: {
			content: { "application/json": { schema: UpdateBoothSchema } },
		},
	},
	responses: {
		200: {
			description: "Update booth",
			content: {
				"application/json": { schema: z.array(zodSchema.booth.SelectSchema) },
			},
		},
	},
});

const deleteBoothRoute = createRoute({
	method: "delete",
	path: "/booth/{boothId}",
	tags: ["Event"],
	request: {
		params: z.object({ boothId: z.coerce.number().int().positive() }),
	},
	responses: {
		200: {
			description: "Delete booth",
			content: {
				"application/json": { schema: z.array(zodSchema.booth.SelectSchema) },
			},
		},
	},
});

const EventRoute = new OpenAPIHono<HonoEnv>()
	.openapi(getEventArtistRoute, async (c) => {
		const query = c.req.valid("query");
		const { eventName } = c.req.valid("param");
		const EventArtistDao = NewEventArtistDao(c.var.db);
		const returnObj = await EventArtistDao.Fetch({ ...query, eventName });
		return c.json(returnObj);
	})
	.openapi(listEventRoute, async (c) => {
		const EventDao = NewEventDao(c.var.db);
		const data = await EventDao.FetchAll();
		return c.json(data);
	})
	.openapi(getEventByNameRoute, async (c) => {
		const { eventName } = c.req.valid("param");
		const EventDao = NewEventDao(c.var.db);
		const data = await EventDao.FetchByEventName(eventName);
		return c.json(data ?? null);
	})
	.openapi(getBoothsByEventRoute, async (c) => {
		const { eventId } = c.req.valid("param");
		const BoothDao = NewBoothDao(c.var.db);
		const data: BoothSelect[] = await BoothDao.FetchByEventId(eventId);
		return c.json(data);
	})
	.openapi(createEventArtistRoute, async (c) => {
		const EventArtistDao = NewEventArtistDao(c.var.db);
		const body: PutEventArtistSchemaTypes = c.req.valid("json");
		const payload = await enrichWithBoothFields(c.var.db, body);
		const returnResponse: EventDmSelect[] =
			await EventArtistDao.Create(payload);
		return c.json(returnResponse, 201);
	})
	.openapi(createEventRoute, async (c) => {
		const EventDao = NewEventDao(c.var.db);
		const body = c.req.valid("json");
		const returnResponse = await EventDao.Create(body);
		return c.json(returnResponse, 201);
	})
	.openapi(createBoothRoute, async (c) => {
		const BoothDao = NewBoothDao(c.var.db);
		const body = c.req.valid("json");
		const returnResponse: BoothSelect[] = await BoothDao.Create(body);
		return c.json(returnResponse, 201);
	})
	.openapi(deleteEventArtistRoute, async (c) => {
		const { artistId, eventId } = c.req.valid("param");
		const db = initDB(c.env.DATABASE_URL);
		const returnResponse: EventDmSelect[] = await db
			.delete(s.eventDm)
			.where(
				and(
					eq(s.eventDm.artistId, Number(artistId)),
					eq(s.eventDm.eventId, Number(eventId)),
				),
			)
			.returning();
		return c.json(returnResponse, 200);
	})
	.openapi(updateEventArtistRoute, async (c) => {
		const EventArtistDao = NewEventArtistDao(c.var.db);
		const { eventArtistId } = c.req.valid("param");
		const body: PutEventArtistSchemaTypes = c.req.valid("json");
		const payload = await enrichWithBoothFields(c.var.db, body);
		const returnResponse: EventDmSelect[] = await EventArtistDao.Update(
			eventArtistId,
			payload,
		);
		return c.json(returnResponse, 200);
	})
	.openapi(updateBoothRoute, async (c) => {
		const BoothDao = NewBoothDao(c.var.db);
		const { boothId } = c.req.valid("param");
		const body = c.req.valid("json");
		const returnResponse: BoothSelect[] = await BoothDao.Update(boothId, body);
		return c.json(returnResponse, 200);
	})
	.openapi(deleteBoothRoute, async (c) => {
		const BoothDao = NewBoothDao(c.var.db);
		const { boothId } = c.req.valid("param");
		const returnResponse: BoothSelect[] = await BoothDao.Delete(boothId);
		return c.json(returnResponse, 200);
	});

export default EventRoute;
