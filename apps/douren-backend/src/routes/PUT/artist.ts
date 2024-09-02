import { Hono } from "hono";
import {  PutArtistSchema, PutArtistSchemaTypes } from "../../schema/artist.zod";
import { initDB, s } from "@repo/database/db";
import { eq } from 'drizzle-orm';
import { zValidator } from "@hono/zod-validator";
import { ENV_VARIABLE } from "../../helper/constant";
import { trimTrailingSlash } from "hono/trailing-slash";
import { logger } from "hono/logger";


const PutArtistRoutes = new Hono<{ Bindings: ENV_VARIABLE }>();
PutArtistRoutes.use(logger())
PutArtistRoutes.use(trimTrailingSlash())


PutArtistRoutes.put(
  "/:artistId",
  zValidator("json", PutArtistSchema),
  async (c) => {
    const body: PutArtistSchemaTypes = await c.req.json();
    const {artistId} = c.req.param();
    const db = initDB(c.env.DATABASE_URL!);
    body.uuid = Number(artistId);
    const returnResponse = await db
      .update(s.authorMain)
      .set(body)
      .where(eq(s.authorMain.uuid, Number(artistId)))
      .returning();
    return c.json(returnResponse,204);
  }
);

export default PutArtistRoutes;