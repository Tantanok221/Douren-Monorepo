import { Hono } from "hono";
import { ENV_VARIABLE } from "../../helper/constant";
import { zValidator } from "@hono/zod-validator";
import {
  CreateEventArtistSchema,
  CreateEventSchema,
  PutEventArtistSchemaTypes,
} from "../../schema/event.zod";
import { initDB, s } from "@pkg/database/db";
import { desc } from "drizzle-orm";
import { getAuth } from "@hono/clerk-auth";

const PostEventRoute = new Hono<{ Bindings: ENV_VARIABLE }>();
PostEventRoute.post(
  "/artist",
  zValidator("json", CreateEventArtistSchema),
  async (c) => {
    // infer as PutEventArtistSchemaTypes to ignore type error mean while getting automatic type from zod
    const auth = getAuth(c);
    if (auth?.userId != c.env.ADMIN_USER_ID && c.env.DEV_ENV == "production") {
      return c.json(
        { message: "You are not authorized to create artist" },
        401
      );
    }
    const body: PutEventArtistSchemaTypes = await c.req.json();
    const db = initDB();
    const [counts] = await db
      .select({ count: s.eventDm.uuid })
      .from(s.eventDm)
      .orderBy(desc(s.eventDm.uuid))
      .limit(1);
    if (!body.uuid) {
      body.uuid = counts.count + 1;
    }
    const returnResponse = await db
      .insert(s.eventDm)
      .values(body)
      .onConflictDoNothing({ target: s.eventDm.uuid })
      .returning();
    return c.json(returnResponse, 201);
  }
);

PostEventRoute.post("/", zValidator("json", CreateEventSchema), async (c) => {
  const auth = getAuth(c);
  if (auth?.userId != c.env.ADMIN_USER_ID && c.env.DEV_ENV == "production") {
    return c.json({ message: "You are not authorized to create artist" }, 401);
  }
  const body = await c.req.json();
  const db = initDB();
  const [counts] = await db
    .select({ count: s.event.id })
    .from(s.event)
    .orderBy(desc(s.event.id))
    .limit(1);
  if (!body.id) {
    body.id = counts.count + 1;
  }
  const returnResponse = await db
    .insert(s.event)
    .values(body)
    .onConflictDoNothing({ target: s.event.id })
    .returning();
  return c.json(returnResponse, 201);
});

export default PostEventRoute;
