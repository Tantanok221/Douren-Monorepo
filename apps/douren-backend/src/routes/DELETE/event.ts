import { Hono } from "hono";
import { logger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";
import { ENV_VARIABLE } from "../../helper/constant";
import { initDB, s } from "@repo/database/db";
import { eq, and } from 'drizzle-orm';

const DeleteEventRoute = new Hono<{ Bindings: ENV_VARIABLE }>();
DeleteEventRoute.use(logger());
DeleteEventRoute.use(trimTrailingSlash());

DeleteEventRoute.delete("/:eventId/artist/:artistId", async (c) => {
  const { artistId,eventId } = c.req.param();
  console.log(artistId,eventId)
  const db = initDB(c.env.DATABASE_URL!);
  const returnResponse = await db
    .delete(s.eventDm)
    .where(and(eq(s.eventDm.artistId, Number(artistId)), eq(s.eventDm.eventId, Number(eventId))))
    .returning();
  return c.json(returnResponse, 200);
})

export default DeleteEventRoute