import { Hono } from "hono";
import { ENV_VARIABLE } from "../../helper/constant";
import { validator } from "hono/validator";
import {
  CreateArtistSchema,
  CreateArtistSchemaTypes,
} from "../../schema/artist.zod";
import { zValidator } from "@hono/zod-validator";
import { initDB, s } from "@repo/database/db";
import { count, desc, eq } from 'drizzle-orm';

const PostArtistRoutes = new Hono<{ Bindings: ENV_VARIABLE }>();

PostArtistRoutes.post(
  "/",
  zValidator("json", CreateArtistSchema),
  async (c) => {
    const body: CreateArtistSchemaTypes = await c.req.json();
    const db = initDB(c.env.DATABASE_URL!);
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
      .returning();
    return c.json(returnResponse,200);
  }
);


export default PostArtistRoutes;
