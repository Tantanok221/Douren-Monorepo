import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { initDB, s } from "@pkg/database/db";
import { zValidator } from "@hono/zod-validator";
import {
	CreateEventArtistSchema,
	CreateEventSchema,
	PutEventArtistSchema,
	PutEventArtistSchemaTypes,
	GetEventArtistByIdSchema,
	UpdateEventArtistSchema,
} from "@/schema/event.zod";
import { authProcedure, publicProcedure, router } from "@/lib/trpc";
import { eventInputParams, eventNameInputParams } from "@pkg/type";
import { zodSchema } from "@pkg/database/zod";
import { NewEventArtistDao } from "@/Dao/EventArtist";
import { NewEventDao } from "@/Dao/Event";
import { HonoEnv } from "@/index";

export const trpcEventRoute = router({
	getAllEvent: publicProcedure.query(async (opts) => {
		const EventDao = NewEventDao(opts.ctx.db);
		return await EventDao.FetchAll();
	}),
	getEvent: publicProcedure.input(eventInputParams).query(async (opts) => {
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
	createEventArtist: publicProcedure
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
});

const EventRoute = new Hono<HonoEnv>()
	.get("/:eventName/artist", async (c) => {
		const { page, search, tag, sort, searchTable } = c.req.query();
		const EventArtistDao = NewEventArtistDao(c.var.db);
		const { eventName } = c.req.param();
		const returnObj = await EventArtistDao.Fetch({
			page,
			search,
			sort,
			searchTable,
			tag,
			eventName,
		});
		return c.json(returnObj);
	})
	.get("/", async (c) => {
		const EventDao = NewEventDao(c.var.db);
		const data = await EventDao.FetchAll();
		return c.json(data);
	})
	.get("/:eventName", async (c) => {
		const { eventName } = c.req.param();
		const EventDao = NewEventDao(c.var.db);
		const data = await EventDao.FetchByEventName(eventName);
		return c.json(data);
	})
	.post("/artist", zValidator("json", CreateEventArtistSchema), async (c) => {
		const EventArtistDao = NewEventArtistDao(c.var.db);
		const body: PutEventArtistSchemaTypes = await c.req.json();
		const returnResponse = await EventArtistDao.Create(body);

		return c.json(returnResponse, 201);
	})
	.post("/", zValidator("json", CreateEventSchema), async (c) => {
		const EventDao = NewEventDao(c.var.db);
		const body = await c.req.json();
		const returnResponse = await EventDao.Create(body);
		return c.json(returnResponse, 201);
	})
	.delete("/:eventId/artist/:artistId", async (c) => {
		const { artistId, eventId } = c.req.param();
		const db = initDB(c.env.DATABASE_URL);
		const returnResponse = await db
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
	.put(
		"/artist/:eventArtistId",
		zValidator("json", PutEventArtistSchema),
		async (c) => {
			const EventArtistDao = NewEventArtistDao(c.var.db);
			const { eventArtistId } = c.req.param();
			const body: PutEventArtistSchemaTypes = await c.req.json();
			const returnResponse = await EventArtistDao.Update(eventArtistId, body);

			return c.json(returnResponse, 200);
		},
	);

export default EventRoute;
