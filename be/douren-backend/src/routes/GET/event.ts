import { Hono } from "hono";
import { BuildQuery } from "@pkg/database/helper";
import { asc, count, desc, eq } from "drizzle-orm";
import { logger } from "hono/logger";
import { processTableName } from "../../helper/processTableName";
import {
  ENV_VARIABLE,
  FETCH_EVENT_ARTIST_OBJECT,
  PAGE_SIZE,
} from "../../helper/constant";
import { initDB, s } from "@pkg/database/db";
import { createPaginationObject } from "../../helper/createPaginationObject";
import { processTagConditions } from "../../helper/processTagConditions";
import { trimTrailingSlash } from "hono/trailing-slash";
import { cacheJsonResults, initRedis } from "../../db/redis";

const GetEventRoute = new Hono<{ Bindings: ENV_VARIABLE }>()
.get("/:eventId/artist", async (c) => {
  const { page, search, tag, sort, searchtable } = c.req.query();
  const { eventId } = c.req.param();
  const db = initDB();
  const table = processTableName(sort.split(",")[0]);
  const redis = initRedis(c.env.REDIS_TOKEN);
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
});

export default GetEventRoute;
