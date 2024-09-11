import { Hono } from "hono";
import { ENV_VARIABLE } from "../../helper/constant";
import { zValidator } from "@hono/zod-validator";
import {
  PutEventArtistSchema,
  PutEventArtistSchemaTypes,
} from "../../schema/event.zod";
import { initDB, s } from "@pkg/database/db";
import { eq } from "drizzle-orm";
import { getAuth } from "@hono/clerk-auth";

const PutEventRoute = new Hono<{ Bindings: ENV_VARIABLE }>().put(
  "/artist",
  zValidator("json", PutEventArtistSchema),
  async (c) => {
    const auth = getAuth(c);
    if (auth?.userId != c.env.ADMIN_USER_ID && c.env.DEV_ENV == "production") {
      return c.json(
        { message: "You are not authorized to create artist" },
        401
      );
    }
    const body: PutEventArtistSchemaTypes = await c.req.json();
    const db = initDB();
    const returnResponse = await db
      .update(s.eventDm)
      .set(body)
      .where(eq(s.eventDm.uuid, Number(body.uuid)))
      .returning();
    return c.json(returnResponse, 204);
  }
);

export default PutEventRoute;
