import { Hono } from "hono";
import { ENV_VARIABLE } from "../../helper/constant";
import { zValidator } from "@hono/zod-validator";
import {
  CreateEventArtistSchema,
  CreateEventSchema,
  PutEventArtistSchemaTypes,
} from "../../schema/event.zod";
import { initDB, s } from "@repo/database/db";
import { desc } from "drizzle-orm";
import { trimTrailingSlash } from "hono/trailing-slash";
import { logger } from "hono/logger";

const PostEventRoute = new Hono<{ Bindings: ENV_VARIABLE }>();
PostEventRoute.use(logger())
PostEventRoute.use(trimTrailingSlash());
PostEventRoute.post(
  "/artist",
  zValidator("json", CreateEventArtistSchema),
  async (c) => {
    // infer as PutEventArtistSchemaTypes to ignore type error mean while getting automatic type from zod
    const body: PutEventArtistSchemaTypes = await c.req.json();
    const db = initDB(c.env.DATABASE_URL!);
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

PostEventRoute.post(
  "/",
  zValidator("json", CreateEventSchema),
  async (c) => {
    const body = await c.req.json();
    const db = initDB(c.env.DATABASE_URL!);
    const [counts] = await db
      .select({ count: s.event.id })
      .from(s.event)
      .orderBy(desc(s.event.id))
      .limit(1);
    if(!body.id){
      body.id = counts.count + 1;
    }
    const returnResponse = await db
      .insert(s.event)
      .values(body)
      .onConflictDoNothing({ target: s.event.id })
      .returning();
      return c.json(returnResponse, 201);
  }
);

export default PostEventRoute;
