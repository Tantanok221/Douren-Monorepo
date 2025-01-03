import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { initDB, s } from "@pkg/database/db";
import { BACKEND_BINDING } from "@pkg/env/constant";
import { zValidator } from "@hono/zod-validator";
import {
	CreateEventArtistSchema,
	CreateEventSchema,
	PutEventArtistSchema,
	PutEventArtistSchemaTypes,
} from "@/schema/event.zod";
import { verifyUser } from "@/utlis/authHelper";
import { publicProcedure, router } from "@/trpc";
import { eventInputParams, eventNameInputParams } from "@pkg/type";
import { zodSchema } from "@pkg/database/zod";
import { NewEventArtistDao } from "@/Dao/EventArtist";
import { NewEventDao } from "@/Dao/Event";

export const trpcEventRoute = router({
	getAllEvent: publicProcedure.query(async (opts) => {
		const EventDao = NewEventDao(opts.ctx.env.DATABASE_URL);
		return await EventDao.FetchAll();
	}),
	getEvent: publicProcedure.input(eventInputParams).query(async (opts) => {
		const EventArtistDao = NewEventArtistDao(opts.ctx.env.DATABASE_URL);
		return await EventArtistDao.Fetch(opts.input);
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
});

const EventRoute = new Hono<{ Bindings: BACKEND_BINDING }>()
	.get("/:eventName/artist", async (c) => {
		const { page, search, tag, sort, searchTable } = c.req.query();
		const EventArtistDao = NewEventArtistDao(c.env.DATABASE_URL);
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
		const EventDao = NewEventDao(c.env.DATABASE_URL);
		const data = EventDao.FetchAll();
		return c.json(data);
	})
	.get("/:eventName", async (c) => {
		const { eventName } = c.req.param();
		const EventDao = NewEventDao(c.env.DATABASE_URL);
		const data = EventDao.FetchByEventName(eventName);
		return c.json(data);
	})
	.post("/artist", zValidator("json", CreateEventArtistSchema), async (c) => {
		const verified = verifyUser(c);
		if (!verified)
			return c.json(
				{ message: "You are not authorized to create artist" },
				401,
			);

		const EventArtistDao = NewEventArtistDao(c.env.DATABASE_URL);
		const body: PutEventArtistSchemaTypes = await c.req.json();
		const returnResponse = await EventArtistDao.Create(body);

		return c.json(returnResponse, 201);
	})
	.post("/", zValidator("json", CreateEventSchema), async (c) => {
		const verified = verifyUser(c);
		if (!verified)
			return c.json(
				{ message: "You are not authorized to create artist" },
				401,
			);

		const EventDao = NewEventDao(c.env.DATABASE_URL);

		const body = await c.req.json();
		const returnResponse = EventDao.Create(body);
		return c.json(returnResponse, 201);
	})
	.delete("/:eventId/artist/:artistId", async (c) => {
		const verified = verifyUser(c);
		if (!verified)
			return c.json(
				{ message: "You are not authorized to create artist" },
				401,
			);
		const { artistId, eventId } = c.req.param();
		console.log(artistId, eventId);
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
	.put("/artist", zValidator("json", PutEventArtistSchema), async (c) => {
		const verified = verifyUser(c);
		if (!verified)
			return c.json(
				{ message: "You are not authorized to create artist" },
				401,
			);
		const EventArtistDao = NewEventArtistDao(c.env.DATABASE_URL);
		const body: PutEventArtistSchemaTypes = await c.req.json();
		const returnResponse = await EventArtistDao.Update(body);

		return c.json(returnResponse, 200);
	});

export default EventRoute;
