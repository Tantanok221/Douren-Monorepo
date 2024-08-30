import { Hono } from "hono";
import { initDB } from "@repo/database/initdb";
import * as s from "@repo/database/schema";
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
  let SelectQuery = new SelectDatabaseQueryBuilder(query)
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

class SelectDatabaseQueryBuilder<T extends PgSelect> {
  query: T;
  constructor(query: T) {
    this.query = query;
  }
  withFilterEventId(eventId: number) {
    this.query = this.query.where(eq(s.eventDm.eventId, eventId));
    return this
  }
  withOrderBy(sortBy: typeof asc | typeof desc, table: AnyColumn | SQLWrapper) {
    this.query = this.query.orderBy(sortBy(table));
    return this
  }
  withPagination(page: number, size: number = PAGE_SIZE) {
    this.query = this.query.limit(size).offset((page - 1) * size);
    return this
  }
  withIlikeSearchByTable(search: string, table: Column) {
    this.query = this.query.where(and(ilike(table, search)));
    return this
  }
  Build(){
    return new SelectDatabaseQueryBuilder(this.query);
  }
}

function processTableName(table: string) {
  // sort = "table_name,asc"
  // The front is the table name and then the sort order
  if (table === "Author_Main(Author)" || table === "Author_Main.Author") {
    return s.authorMain.author;
  }
  if (table === "Booth_name") {
    return s.eventDm.boothName;
  }
  if (table === "Location_Day01") {
    return s.eventDm.locationDay01;
  }
  if (table === "Location_Day02") {
    return s.eventDm.locationDay02;
  } else {
    return s.eventDm.locationDay03;
  }
}

export default eventRoute;
