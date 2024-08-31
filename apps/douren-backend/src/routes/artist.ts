import { Hono } from "hono";
import { logger } from "hono/logger";
import { processTableName } from "../helper/processTableName";
import {
  asc,
  desc,
  eq,
  sql,
  SQLWrapper,
  ilike,
} from "drizzle-orm";
import { initDB, s } from "@repo/database/db";
import { BuildQuery } from "@repo/database/helper";
import { PAGE_SIZE } from "../helper/constant";

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
  if(tag?.length > 0){
    tag.split(",").forEach((tag) =>{
      conditions.push(ilike(s.authorMain.tags,`%${tag}%`))
    })
  }
  let query = db
    .select({
      authorId: s.authorMain.uuid,
      authorName: s.authorMain.author,
      authorDescription: s.authorMain.introduction,
      authorTwitter: s.authorMain.twitterLink,
      authorYoutube: s.authorMain.youtubeLink,
      authorFacebook: s.authorMain.facebookLink,
      authorInstagram: s.authorMain.instagramLink,
      authorPixiv: s.authorMain.pixivLink,
      authorPlurk: s.authorMain.plurkLink,
      authorBaha: s.authorMain.bahaLink,
      authorTwitch: s.authorMain.twitchLink,
      authorMyacg: s.authorMain.myacgLink,
      authorStore: s.authorMain.storeLink,
      authorOfficial: s.authorMain.officialLink,
      authorPhoto: s.authorMain.photo,
      tags: sql`jsonb_agg(
                jsonb_build_object(
                  'tagName', ${s.tag.tag},
                  'tagCount', ${s.tag.count}
                )
              )`.as("tags"),
    })
    .from(s.authorMain)
    .leftJoin(s.authorTag, eq(s.authorTag.authorId, s.authorMain.uuid))
    .leftJoin(s.tag, eq(s.authorTag.tagId, s.tag.tag))

    .groupBy(s.authorMain.uuid)
    .$dynamic();
  let SelectQuery = BuildQuery(query)
    .withOrderBy(sortBy, table)
    .withPagination(Number(page), PAGE_SIZE)
    .withTableIsNot(s.authorMain.author, "")
    .Build();
  if (tag?.length > 0) {
    SelectQuery.withAndFilter(conditions);
  }
  if (search) {
    SelectQuery.withIlikeSearchByTable(search, searchTable);
  }

  // TODO: Need to change front end to use, to split
  const data = await SelectQuery.query;
  return c.json(data);
});

export default artistRoute;
