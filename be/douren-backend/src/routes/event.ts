import { and, eq } from "drizzle-orm";
import { initDB, s } from "@pkg/database/db";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import {
	CreateEventArtistSchema,
	CreateEventSchema,
	PutEventArtistSchema,
	PutEventArtistSchemaTypes,
	GetEventArtistByIdSchema,
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
import { HonoEnv } from "@/index";
import { z } from "zod";

type EventDmSelect = z.infer<typeof zodSchema.eventDm.SelectSchema>;

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
			return await EventArtistDao.Create(opts.input);
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
			return await EventArtistDao.Upsert(opts.input);
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
	.openapi(createEventArtistRoute, async (c) => {
		const EventArtistDao = NewEventArtistDao(c.var.db);
		const body: PutEventArtistSchemaTypes = c.req.valid("json");
		const returnResponse: EventDmSelect[] = await EventArtistDao.Create(body);
		return c.json(returnResponse, 201);
	})
	.openapi(createEventRoute, async (c) => {
		const EventDao = NewEventDao(c.var.db);
		const body = c.req.valid("json");
		const returnResponse = await EventDao.Create(body);
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
		const returnResponse: EventDmSelect[] = await EventArtistDao.Update(
			eventArtistId,
			body,
		);
		return c.json(returnResponse, 200);
	});

export default EventRoute;
