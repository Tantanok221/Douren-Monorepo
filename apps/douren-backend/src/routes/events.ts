import { Hono } from "hono";
import { initDB } from "@repo/database/initdb";
import * as s from "@repo/database/schema";
import { BuildQuery } from "@repo/database/helper";
import {
  and,
  AnyColumn,
  asc,
  Column,
  desc,
  eq,
  ilike,
  SQL,
  SQLWrapper,
} from "drizzle-orm";
import { PgSelect, PgSelectBase } from "drizzle-orm/pg-core";
import { logger } from "hono/logger";
import { processTableName } from "../helper/processTableName";
type Bindings = {
  DATABASE_URL: string;
};
const eventRoute = new Hono<{ Bindings: Bindings }>();
eventRoute.use(logger());

eventRoute.get("/", (c) => {
  console.log("GET /");
  return c.text("Hello, World!");
});

const PAGE_SIZE = 40;
eventRoute.get("/:eventId/artist", async (c) => {
  const { page, search, tag, sort, searchtable } = c.req.query();
  const { eventId } = c.req.param();
  const db = initDB(c.env.DATABASE_URL!);
  const table = processTableName(sort.split(",")[0]);
  const sortBy = sort.split(",")[1] === "asc" ? asc : desc;
  const searchTable = processTableName(searchtable);
  console.log("search",search,searchTable)
  let query = db
    .select()
    .from(s.eventDm)
    .leftJoin(s.authorMain, eq(s.authorMain.uuid, s.eventDm.artistId))
    .$dynamic();
  let SelectQuery = BuildQuery(query)
  .withFilterEventId(Number(eventId))
  .withOrderBy(sortBy, table)
  .withPagination(Number(page), PAGE_SIZE)
  .Build();
  if (search) {
    SelectQuery.withIlikeSearchByTable(search, searchTable);
  }

  // TODO: Need to change front end to use, to split
  const data = await SelectQuery.query;
  return c.json(data);
});




export default eventRoute;
