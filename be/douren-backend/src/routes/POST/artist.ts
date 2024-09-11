import { Hono } from "hono";
import { ENV_VARIABLE } from "../../helper/constant";
import { validator } from "hono/validator";
import {
  CreateArtistSchema,
  CreateArtistSchemaTypes,
} from "../../schema/artist.zod";
import { zValidator } from "@hono/zod-validator";
import { initDB, s } from "@pkg/database/db";
import { count, desc, eq } from "drizzle-orm";
import { getAuth } from "@hono/clerk-auth";
const PostArtistRoutes = new Hono<{ Bindings: ENV_VARIABLE }>()
.post(
  "/",
  zValidator("json", CreateArtistSchema),
  async (c) => {
    const auth = getAuth(c);
    if (auth?.userId != c.env.ADMIN_USER_ID && c.env.DEV_ENV == "production") {
      return c.json(
        { message: "You are not authorized to create artist" },
        401
      );
    }

    const body: CreateArtistSchemaTypes = await c.req.json();
    const db = initDB();
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
      .onConflictDoNothing({ target: s.authorMain.uuid })
      .returning();
    return c.json(returnResponse, 200);
  }
);

export default PostArtistRoutes;
