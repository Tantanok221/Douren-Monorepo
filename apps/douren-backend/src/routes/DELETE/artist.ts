import { Hono } from "hono";
import { logger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";
import { ENV_VARIABLE } from "../../helper/constant";
import { initDB, s } from "@repo/database/db";
import { eq } from "drizzle-orm";

const DeleteArtistRoute = new Hono<{ Bindings: ENV_VARIABLE }>();
DeleteArtistRoute.use(logger());
DeleteArtistRoute.use(trimTrailingSlash());

DeleteArtistRoute.delete("/:artistId", async (c) => {
  const { artistId } = c.req.param();
  const db = initDB(c.env.DATABASE_URL!);
  const returnResponse = await db
    .delete(s.authorMain)
    .where(eq(s.authorMain.uuid, Number(artistId)))
    .returning();
  return c.json(returnResponse, 200);
})

export default DeleteArtistRoute