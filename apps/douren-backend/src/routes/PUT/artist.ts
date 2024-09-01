import { Hono } from "hono";
import { CreateArtistSchema, CreateArtistSchemaTypes } from "../../schema/artist.zod";
import { initDB, s } from "@repo/database/db";
import { eq } from 'drizzle-orm';
import { zValidator } from "@hono/zod-validator";
import { ENV_VARIABLE } from "../../helper/constant";


const PutArtistRoutes = new Hono<{ Bindings: ENV_VARIABLE }>();


PutArtistRoutes.put(
  "/:artistId",
  zValidator("json", CreateArtistSchema),
  async (c) => {
    const body: CreateArtistSchemaTypes = await c.req.json();
    const {artistId} = c.req.param();
    const db = initDB(c.env.DATABASE_URL!);
    body.uuid = Number(artistId);
    const returnResponse = await db
      .update(s.authorMain)
      .set(body)
      .where(eq(s.authorMain.uuid, Number(artistId)))
      .returning();
    return c.json(returnResponse,201);
  }
);

export default PutArtistRoutes;