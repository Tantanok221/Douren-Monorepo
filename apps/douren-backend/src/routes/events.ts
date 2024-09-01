import { Hono } from "hono";
import { BuildQuery } from "@repo/database/helper";
import { asc, count, desc, eq } from "drizzle-orm";
import { logger } from "hono/logger";
import { processTableName } from "../helper/processTableName";
import {
  FETCH_EVENT_ARTIST_OBJECT,
  PAGE_SIZE,
} from "../helper/constant";
import { initDB, s } from "@repo/database/db";
import { sql, SQLWrapper, ilike } from "drizzle-orm";
import { authorMain } from "../../../../packages/database/src/db/schema";
type Bindings = {
  DATABASE_URL: string;
};
const eventRoute = new Hono<{ Bindings: Bindings }>();
eventRoute.use(logger());

eventRoute.get("/", (c) => {
  console.log("GET /");
  return c.text("Hello, World!");
});

eventRoute.get("/:eventId/artist", async (c) => {
  const { page, search, tag, sort, searchtable } = c.req.query();
  const { eventId } = c.req.param();
  const db = initDB(c.env.DATABASE_URL!);
  const table = processTableName(sort.split(",")[0]);
  const sortBy = sort.split(",")[1] === "asc" ? asc : desc;
  const searchTable = processTableName(searchtable);

  let tagConditions: SQLWrapper[] = [];
  if (tag?.length > 0) {
    tag.split(",").forEach((tag) => {
      tagConditions.push(ilike(s.authorMain.tags, `%${tag}%`));
    });
  }
  let query = db
    .select(FETCH_EVENT_ARTIST_OBJECT)
    .from(s.eventDm)
    .leftJoin(s.authorMain, eq(s.authorMain.uuid, s.eventDm.artistId))
    .leftJoin(s.authorTag, eq(s.authorTag.authorId, s.authorMain.uuid))
    .leftJoin(s.tag, eq(s.authorTag.tagId, s.tag.tag))
    .groupBy(
      s.eventDm.boothName,
      authorMain.uuid,
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
  const totalPage = Math.ceil(counts.totalCount / PAGE_SIZE);
  const returnObj = {
    data,
    totalCount: counts.totalCount,
    totalPage,
    nextPageAvailable: Number(page) < totalPage,
    previousPageAvailable: Number(page) > 1,
    pageSize: PAGE_SIZE,
  };
  console.log(data.length);
  return c.json(returnObj);
});

export default eventRoute;
