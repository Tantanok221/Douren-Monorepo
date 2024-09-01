import { Hono } from "hono";
import { logger } from "hono/logger";
import { processTableName } from "../../helper/processTableName";
import { asc, desc, eq, count } from "drizzle-orm";
import { initDB, s } from "@repo/database/db";
import { BuildQuery } from "@repo/database/helper";
import {
  ENV_VARIABLE,
  FETCH_ARTIST_OBJECT,
  PAGE_SIZE,
} from "../../helper/constant";
import { createPaginationObject } from "../../helper/createPaginationObject";
import { processTagConditions } from "../../helper/processTagConditions";

const GETArtistRoutes = new Hono<{ Bindings: ENV_VARIABLE }>();
GETArtistRoutes.use(logger());

GETArtistRoutes.get("/", async (c) => {
  const { page, search, tag, sort, searchtable } = c.req.query();
  const db = initDB(c.env.DATABASE_URL!);
  const table = processTableName(sort.split(",")[0]);
  const sortBy = sort.split(",")[1] === "asc" ? asc : desc;
  const searchTable = processTableName(searchtable);
  const tagConditions = processTagConditions(tag);
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
  const data = await SelectQuery.query;
  const [counts] = await CountQuery.query;
  const returnObj = createPaginationObject(
    data,
    Number(page),
    PAGE_SIZE,
    counts.totalCount
  );
  return c.json(returnObj);
});

export default GETArtistRoutes;
