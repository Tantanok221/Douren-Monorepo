import { Hono } from "hono";
import { ENV_VARIABLE } from "../../helper/constant";
import { initDB, s } from "@pkg/database/db";
import { eq } from "drizzle-orm";
import { getAuth } from "@hono/clerk-auth";

const DeleteArtistRoute = new Hono<{ Bindings: ENV_VARIABLE }>().delete(
  "/:artistId",
  async (c) => {
    const auth = getAuth(c);
    if (auth?.userId != c.env.ADMIN_USER_ID && c.env.DEV_ENV == "production") {
      return c.json(
        { message: "You are not authorized to create artist" },
        401
      );
    }
    const { artistId } = c.req.param();
    const db = initDB();
    const returnResponse = await db
      .delete(s.authorMain)
      .where(eq(s.authorMain.uuid, Number(artistId)))
      .returning();
    return c.json(returnResponse, 200);
  }
);

export default DeleteArtistRoute;
