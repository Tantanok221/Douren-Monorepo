import { Hono } from "hono";
import { and, desc, eq } from "drizzle-orm";
import { initDB, s } from "@pkg/database/db";
import { BACKEND_BINDING } from "@pkg/env/constant";
import { zValidator } from "@hono/zod-validator";
import {
	CreateEventArtistSchema,
	CreateEventSchema,
	PutEventArtistSchema,
	PutEventArtistSchemaTypes,
} from "../schema/event.zod";
import { verifyUser } from "../utlis/authHelper";
import { publicProcedure, router } from "../trpc";
import {
	eventArtistSchema,
	eventInputParams,
	eventNameInputParams,
} from "@pkg/type";
import { zodSchema } from "@pkg/database/zod";
import { NewEventArtistDao } from "../Dao/EventArtist";

const EventArtistDao = NewEventArtistDao();

export const trpcEventRoute = router({
	getEvent: publicProcedure.input(eventInputParams).query(async (opts) => {
		return await EventArtistDao.Fetch(opts.input);
	}),
	getEventId: publicProcedure
		.input(eventNameInputParams)
		.output(zodSchema.event.SelectSchema)
		.query(async (opts) => {
			const { eventName } = opts.input;
			const db = initDB();
			const [data] = await db
				.select()
				.from(s.event)
				.where(eq(s.event.name, eventName));
			return data;
		}),
});

const EventRoute = new Hono<{ Bindings: BACKEND_BINDING }>()
	.get("/:eventId/artist", async (c) => {
		const { page, search, tag, sort, searchTable } = c.req.query();
		const { eventId } = c.req.param();
		const returnObj = await EventArtistDao.Fetch({
			page,
			search,
			sort,
			searchTable,
			tag,
			eventId,
		});
		return c.json(returnObj);
	})
	.get("/:eventName", async (c) => {
		const { eventName } = c.req.param();
		const db = initDB();
		const [data] = await db
			.select()
			.from(s.event)
			.where(eq(s.event.name, eventName));
		return c.json(data);
	})
	.post("/artist", zValidator("json", CreateEventArtistSchema), async (c) => {
		// infer as PutEventArtistSchemaTypes to ignore type error mean while getting automatic type from zod
		const verified = verifyUser(c);
		if (!verified)
			return c.json(
				{ message: "You are not authorized to create artist" },
				401,
			);
		const body: PutEventArtistSchemaTypes = await c.req.json();
		const db = initDB();
		const [counts] = await db
			.select({ count: s.eventDm.uuid })
			.from(s.eventDm)
			.orderBy(desc(s.eventDm.uuid))
			.limit(1);
		if (!body.uuid) {
			body.uuid = counts.count + 1;
		}
		const returnResponse = await db
			.insert(s.eventDm)
			.values(body)
			.onConflictDoNothing({ target: s.eventDm.uuid })
			.returning();
		return c.json(returnResponse, 201);
	})
	.post("/", zValidator("json", CreateEventSchema), async (c) => {
		const verified = verifyUser(c);
		if (!verified)
			return c.json(
				{ message: "You are not authorized to create artist" },
				401,
			);

		const body = await c.req.json();
		const db = initDB();
		const [counts] = await db
			.select({ count: s.event.id })
			.from(s.event)
			.orderBy(desc(s.event.id))
			.limit(1);
		if (!body.id) {
			body.id = counts.count + 1;
		}
		const returnResponse = await db
			.insert(s.event)
			.values(body)
			.onConflictDoNothing({ target: s.event.id })
			.returning();
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
		const db = initDB();
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
		const body: PutEventArtistSchemaTypes = await c.req.json();
		const db = initDB();
		const returnResponse = await db
			.update(s.eventDm)
			.set(body)
			.where(eq(s.eventDm.uuid, Number(body.uuid)))
			.returning();
		return c.json(returnResponse, 200);
	});

export default EventRoute;
