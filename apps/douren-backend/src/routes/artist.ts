import { Hono } from "hono";
import { logger } from "hono/logger";
import { processTableName } from "../helper/processTableName";
import { asc, desc, eq, sql, SQLWrapper, ilike, count } from "drizzle-orm";
import { initDB, s } from "@repo/database/db";
import { BuildQuery } from "@repo/database/helper";
import {  FETCH_ARTIST_OBJECT, PAGE_SIZE } from "../helper/constant";

type Bindings = {
  DATABASE_URL: string;
};
const artistRoute = new Hono<{ Bindings: Bindings }>();
artistRoute.use(logger());

artistRoute.get("/", async (c) => {
  const { page, search, tag, sort, searchtable } = c.req.query();
  const db = initDB(c.env.DATABASE_URL!);
  const table = processTableName(sort.split(",")[0]);
  const sortBy = sort.split(",")[1] === "asc" ? asc : desc;
  const searchTable = processTableName(searchtable);
  let conditions: SQLWrapper[] = [];
  if (tag?.length > 0) {
    tag.split(",").forEach((tag) => {
      conditions.push(ilike(s.authorMain.tags, `%${tag}%`));
    });
  } 
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
    SelectQuery.withAndFilter(conditions);
    CountQuery.withAndFilter(conditions);
  }
  if (search) {
    SelectQuery.withIlikeSearchByTable(search, searchTable);
    CountQuery.withIlikeSearchByTable(search, searchTable);
  }

  // TODO: Need to change front end to use, to split
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
  return c.json(returnObj);
});

export default artistRoute;
