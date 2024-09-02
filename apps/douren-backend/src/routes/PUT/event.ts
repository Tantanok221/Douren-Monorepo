import { Hono } from "hono";
import { ENV_VARIABLE } from "../../helper/constant";
import { zValidator } from "@hono/zod-validator";
import {
  PutEventArtistSchema,
  PutEventArtistSchemaTypes,
} from "../../schema/event.zod";
import { initDB, s } from "@repo/database/db";
import {  eq } from "drizzle-orm";
import { trimTrailingSlash } from "hono/trailing-slash";
import { logger } from "hono/logger";

const PutEventRoute = new Hono<{ Bindings: ENV_VARIABLE }>();
PutEventRoute.use(logger())
PutEventRoute.use(trimTrailingSlash())


PutEventRoute.put(
  "/artist",
  zValidator("json", PutEventArtistSchema),
  async (c) => {
    const body: PutEventArtistSchemaTypes = await c.req.json();
    const db = initDB(c.env.DATABASE_URL!);
    const returnResponse = await db
      .update(s.eventDm)
      .set(body)
      .where(eq(s.eventDm.uuid,Number(body.uuid)))
      .returning();
    return c.json(returnResponse, 204);
  }
);

export default PutEventRoute;
