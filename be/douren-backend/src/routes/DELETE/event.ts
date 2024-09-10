import { Hono } from "hono";
import { ENV_VARIABLE } from "../../helper/constant";
import { initDB, s } from "@pkg/database/db";
import { eq, and } from "drizzle-orm";
import { getAuth } from "@hono/clerk-auth";

const DeleteEventRoute = new Hono<{ Bindings: ENV_VARIABLE }>();

DeleteEventRoute.delete("/:eventId/artist/:artistId", async (c) => {
  const auth = getAuth(c);
  if (auth?.userId != c.env.ADMIN_USER_ID && c.env.DEV_ENV == "production") {
    return c.json({ message: "You are not authorized to create artist" }, 401);
  }
  const { artistId, eventId } = c.req.param();
  console.log(artistId, eventId);
  const db = initDB();
  const returnResponse = await db
    .delete(s.eventDm)
    .where(
      and(
        eq(s.eventDm.artistId, Number(artistId)),
        eq(s.eventDm.eventId, Number(eventId))
      )
    )
    .returning();
  return c.json(returnResponse, 200);
});

export default DeleteEventRoute;
