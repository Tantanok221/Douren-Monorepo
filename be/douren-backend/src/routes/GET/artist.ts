import { Hono } from "hono";
import { logger } from "hono/logger";
import { processTableName } from "../../helper/processTableName";
import { asc, desc, eq, count } from "drizzle-orm";
import { initDB, s } from "@pkg/database/db";
import { BuildQuery } from "@pkg/database/helper";
import {
  ENV_VARIABLE,
  FETCH_ARTIST_OBJECT,
  PAGE_SIZE,
} from "../../helper/constant";
import { createPaginationObject } from "../../helper/createPaginationObject";
import { processTagConditions } from "../../helper/processTagConditions";
import { trimTrailingSlash } from "hono/trailing-slash";
import { cacheJsonResults, initRedis } from "../../db/redis";

const GetArtistRoute = new Hono<{ Bindings: ENV_VARIABLE }>().get(
  "/",
  async (c) => {
    const { page, search, tag, sort, searchtable } = c.req.query();
    const redis = initRedis(c.env.REDIS_TOKEN);
    const table = processTableName(sort.split(",")[0]);
    const sortBy = sort.split(",")[1] === "asc" ? asc : desc;
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
      .select({ totalCount: count(s.authorMain.uuid) })
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
    if (tag?.length > 0) {
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
);

export default GetArtistRoute;
