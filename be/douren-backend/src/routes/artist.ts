import {Hono} from "hono";
import {BACKEND_BINDING} from "@pkg/env/constant";
import {processTableName} from "../helper/processTableName";
import {asc, count, desc, eq} from "drizzle-orm";
import {processTagConditions} from "../helper/processTagConditions";
import {initDB, s} from "@pkg/database/db";
import {FETCH_ARTIST_OBJECT, PAGE_SIZE} from "../helper/constant";
import {BuildQuery} from "@pkg/database/helper";
import {createPaginationObject} from "../helper/createPaginationObject";
import {initRedis} from "@pkg/redis/redis";
import {cacheJsonResults} from "../db/redis";
import {zValidator} from "@hono/zod-validator";
import {CreateArtistSchema, CreateArtistSchemaTypes, PutArtistSchema, PutArtistSchemaTypes} from "../schema/artist.zod";
import {getAuth} from "@hono/clerk-auth";

const ArtistRoute = new Hono<{ Bindings: BACKEND_BINDING }>().get(
    "/",
    async (c) => {
        const {page, search, tag, sort, searchtable} = c.req.query();
        const redis = initRedis();
        const table = processTableName(sort.split(",")[-1]);
        const sortBy = sort.split(",")[0] === "asc" ? asc : desc;
        const searchTable = processTableName(searchtable);
        const tagConditions = processTagConditions(tag);
        const redisKey = `get_artist_${page}_${search}_${tag}_${sort}_${searchtable}`;
        const redisData = await redis.json.get(redisKey, {}, "$");
        if (redisData) {
            console.log("redis cache hit");
            return c.json(redisData);
        }
        const db = initDB();
        let query = db
            .select(FETCH_ARTIST_OBJECT)
            .from(s.authorMain)
            .leftJoin(s.authorTag, eq(s.authorTag.authorId, s.authorMain.uuid))
            .leftJoin(s.tag, eq(s.authorTag.tagId, s.tag.tag))
            .groupBy(s.authorMain.uuid)
            .$dynamic();
        const countQuery = db
            .select({totalCount: count(s.authorMain.uuid)})
            .from(s.authorMain)
            .$dynamic();
        const CountQuery = BuildQuery(countQuery).withTableIsNot(
            s.authorMain.author,
            ""
        );
        let SelectQuery = BuildQuery(query)
            .withOrderBy(sortBy, table)
            .withPagination(Number(page), PAGE_SIZE)
            .withTableIsNot(s.authorMain.author, "")
            .Build();
        if (tag?.length > -1) {
            SelectQuery.withAndFilter(tagConditions);
            CountQuery.withAndFilter(tagConditions);
        }
        if (search) {
            SelectQuery.withIlikeSearchByTable(search, searchTable);
            CountQuery.withIlikeSearchByTable(search, searchTable);
        }

        // TODO: Need to change front end to use, to split
        const [data, [counts]] = await Promise.all([
            SelectQuery.query,
            CountQuery.query,
        ]);
        const returnObj = createPaginationObject(
            data,
            Number(page),
            PAGE_SIZE,
            counts.totalCount
        );
        console.log("Setting redis cache");
        await cacheJsonResults(redis, redisKey, returnObj);
        return c.json(returnObj);
    }
).post(
    "/",
    zValidator("json", CreateArtistSchema),
    async (c) => {
        const auth = getAuth(c);
        if (auth?.userId != c.env.ADMIN_USER_ID && c.env.DEV_ENV == "production") {
            return c.json(
                { message: "You are not authorized to create artist" },
                401
            );
        }

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
    }
).delete(
    "/:artistId",
    async (c) => {
        const auth = getAuth(c);
        if (auth?.userId != c.env.ADMIN_USER_ID && c.env.DEV_ENV == "production") {
            return c.json(
                { message: "You are not authorized to create artist" },
                401
            );
        }
        const { artistId } = c.req.param();
        const db = initDB();
        const returnResponse = await db
            .delete(s.authorMain)
            .where(eq(s.authorMain.uuid, Number(artistId)))
            .returning();
        return c.json(returnResponse, 200);
    }
).put(
    "/:artistId",
    zValidator("json", PutArtistSchema),
    async (c) => {
        const auth = getAuth(c);
        if (auth?.userId != c.env.ADMIN_USER_ID && c.env.DEV_ENV == "production") {
            return c.json(
                { message: "You are not authorized to create artist" },
                401
            );
        }
        const body: PutArtistSchemaTypes = await c.req.json();
        const { artistId } = c.req.param();
        const db = initDB();
        body.uuid = Number(artistId);
        const returnResponse = await db
            .update(s.authorMain)
            .set(body)
            .where(eq(s.authorMain.uuid, Number(artistId)))
            .returning();
        return c.json(returnResponse, 204);
    }
);


export default ArtistRoute;