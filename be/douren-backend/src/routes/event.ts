import { Hono } from "hono";
import { BuildQuery } from "@pkg/database/helper";
import {and, asc, count, desc, eq} from "drizzle-orm";
import { logger } from "hono/logger";
import { initDB, s } from "@pkg/database/db";
import { trimTrailingSlash } from "hono/trailing-slash";
import {BACKEND_BINDING} from "@pkg/env/constant";
import {initRedis} from "@pkg/redis/redis";
import {processTableName} from "../helper/processTableName";
import {processTagConditions} from "../helper/processTagConditions";
import {createPaginationObject} from "../helper/createPaginationObject";
import {cacheJsonResults} from "../db/redis";
import {FETCH_EVENT_ARTIST_OBJECT, PAGE_SIZE} from "../helper/constant";
import {zValidator} from "@hono/zod-validator";
import {
    CreateEventArtistSchema,
    CreateEventSchema,
    PutEventArtistSchema,
    PutEventArtistSchemaTypes
} from "../schema/event.zod";
import {getAuth} from "@hono/clerk-auth";

const EventRoute = new Hono<{ Bindings: BACKEND_BINDING}>()
    .get("/:eventId/artist", async (c) => {
        const { page, search, tag, sort, searchtable } = c.req.query();
        const { eventId } = c.req.param();
        const db = initDB();
        const table = processTableName(sort.split(",")[0]);
        const redis = initRedis();
        const sortBy = sort.split(",")[1] === "asc" ? asc : desc;
        const searchTable = processTableName(searchtable);
        const tagConditions = processTagConditions(tag);
        const redisKey = `get_eventArtist${eventId}_${page}_${search}_${tag}_${sort}_${searchtable}`;
        const redisData = await redis.json.get(redisKey, {}, "$");
        if (redisData) {
            console.log("redis cache hit");
            return c.json(redisData);
        }
        let query = db
            .select(FETCH_EVENT_ARTIST_OBJECT)
            .from(s.eventDm)
            .leftJoin(s.authorMain, eq(s.authorMain.uuid, s.eventDm.artistId))
            .leftJoin(s.authorTag, eq(s.authorTag.authorId, s.authorMain.uuid))
            .leftJoin(s.tag, eq(s.authorTag.tagId, s.tag.tag))
            .groupBy(
                s.eventDm.boothName,
                s.authorMain.uuid,
                s.eventDm.locationDay01,
                s.eventDm.locationDay02,
                s.eventDm.locationDay03,
                s.eventDm.dm
            )
            .$dynamic();
        const countQuery = db
            .select({ totalCount: count(s.eventDm.artistId) })
            .from(s.eventDm)
            .leftJoin(s.authorMain, eq(s.authorMain.uuid, s.eventDm.artistId))
            .$dynamic();
        const CountQuery = BuildQuery(countQuery)
            .withFilterEventId(Number(eventId))
            .Build();
        const SelectQuery = BuildQuery(query)
            .withPagination(Number(page), PAGE_SIZE)
            .withFilterEventId(Number(eventId))
            .withOrderBy(sortBy, table)
            .Build();
        if (tag?.length > 0) {
            SelectQuery.withAndFilter(tagConditions);
            CountQuery.withAndFilter(tagConditions);
        }
        if (search) {
            SelectQuery.withIlikeSearchByTable(search, searchTable);
            CountQuery.withIlikeSearchByTable(search, searchTable);
        }

        // TODO: Need to change front end to use(,) to split
        const data = await SelectQuery.query;
        const [counts] = await CountQuery.query;
        const returnObj = createPaginationObject(
            data,
            Number(page),
            PAGE_SIZE,
            counts.totalCount
        );
        console.log("Setting redis cache");
        await cacheJsonResults(redis, redisKey, returnObj);
        return c.json(returnObj);
    }).post("/artist", zValidator("json", CreateEventArtistSchema), async (c) => {
        // infer as PutEventArtistSchemaTypes to ignore type error mean while getting automatic type from zod
        const auth = getAuth(c);
        if (auth?.userId != c.env.ADMIN_USER_ID && c.env.DEV_ENV == "production") {
            return c.json(
                { message: "You are not authorized to create artist" },
                401
            );
        }
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
        const auth = getAuth(c);
        if (auth?.userId != c.env.ADMIN_USER_ID && c.env.DEV_ENV == "production") {
            return c.json(
                { message: "You are not authorized to create artist" },
                401
            );
        }
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
    }).delete(
        "/:eventId/artist/:artistId",
        async (c) => {
            const auth = getAuth(c);
            if (auth?.userId != c.env.ADMIN_USER_ID && c.env.DEV_ENV == "production") {
                return c.json(
                    { message: "You are not authorized to create artist" },
                    401
                );
            }
            const { artistId, eventId } = c.req.param();
            console.log(artistId, eventId);
            const db = initDB();
            const returnResponse = await db
                .delete(s.eventDm)
                .where(
                    and(
                        eq(s.eventDm.artistId, Number(artistId)),
                        eq(s.eventDm.eventId, Number(eventId))
                    )
                )
                .returning();
            return c.json(returnResponse, 200);
        }
    ).put(
        "/artist",
        zValidator("json", PutEventArtistSchema),
        async (c) => {
            const auth = getAuth(c);
            if (auth?.userId != c.env.ADMIN_USER_ID && c.env.DEV_ENV == "production") {
                return c.json(
                    { message: "You are not authorized to create artist" },
                    401
                );
            }
            const body: PutEventArtistSchemaTypes = await c.req.json();
            const db = initDB();
            const returnResponse = await db
                .update(s.eventDm)
                .set(body)
                .where(eq(s.eventDm.uuid, Number(body.uuid)))
                .returning();
            return c.json(returnResponse, 204);
        }
    )




export default EventRoute;
