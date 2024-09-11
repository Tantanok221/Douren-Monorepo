import { Hono } from "hono";
import { PutArtistSchema, PutArtistSchemaTypes } from "../../schema/artist.zod";
import { initDB, s } from "@pkg/database/db";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { ENV_VARIABLE } from "../../helper/constant";
import { getAuth } from "@hono/clerk-auth";

const PutArtistRoutes = new Hono<{ Bindings: ENV_VARIABLE }>().put(
  "/:artistId",
  zValidator("json", PutArtistSchema),
  async (c) => {
    const auth = getAuth(c);
    if (auth?.userId != c.env.ADMIN_USER_ID && c.env.DEV_ENV == "production") {
      return c.json(
        { message: "You are not authorized to create artist" },
        401
      );
    }
    const body: PutArtistSchemaTypes = await c.req.json();
    const { artistId } = c.req.param();
    const db = initDB();
    body.uuid = Number(artistId);
    const returnResponse = await db
      .update(s.authorMain)
      .set(body)
      .where(eq(s.authorMain.uuid, Number(artistId)))
      .returning();
    return c.json(returnResponse, 204);
  }
);

export default PutArtistRoutes;
