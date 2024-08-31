import { Hono } from "hono";
import { logger } from "hono/logger";
import { processTableName } from "../helper/processTableName";
import { asc, desc, eq } from "drizzle-orm";
import { initDB, s } from "@repo/database/db";
import { BuildQuery } from "@repo/database/helper";
import { PAGE_SIZE } from "../helper/constant";

type Bindings = {
  DATABASE_URL: string;
};
const artistRoute = new Hono<{ Bindings: Bindings }>();
artistRoute.use(logger());

artistRoute.get("/:eventId/artist", async (c) => {
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


export default artistRoute;