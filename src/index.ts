import { Hono } from "hono";
import { initDB } from "./db";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { CloudflareImageResponse } from "./types/cloudflareReponse";
import { authorMain } from "./db/schema";
import { eq, sql } from "drizzle-orm";
import { bigint } from "drizzle-orm/pg-core";
type Bindings = {
  DATABASE_URL: string;
  CLOUDFLARE_IMAGE_ENDPOINT: string;
  CLOUDFLARE_IMAGE_TOKEN: string;
};

const app = new Hono<{
  Bindings: Bindings;
}>();

app.use("*", cors());
app.use("*", logger());

app.get("/", (c) => {
  return c.text("Pong");
});

app.get("/test", async (c) => {
  const db = initDB(c.env.DATABASE_URL);
  const data = await db.query.authorMain.findMany();
  return c.json({ data: data });
});

app.post("/artist/:id", async (c) => {
  const db = initDB(c.env.DATABASE_URL);
  const { id } = c.req.param();
  let data: CloudflareImageResponse;
  try {
    const formData = await c.req.formData();
    const image = formData.get("image") as File | null;

    if (!image) {
      return c.json({ error: "No image file provided" }, 400);
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", image);

    const response = await fetch(c.env.CLOUDFLARE_IMAGE_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${c.env.CLOUDFLARE_IMAGE_TOKEN}`,
      },
      body: uploadFormData,
    });

    data = (await response.json()) as CloudflareImageResponse;
    const imageLink = data["result"]["variants"][0];
    const updateImageUserID = await db
      .update(authorMain)
      .set({ photo: imageLink })
      .where(eq(authorMain.uuid, sql`CAST(${id} AS BIGINT)`))
      .returning({ data: authorMain });
    if (updateImageUserID.length === 0)
      return c.json({ error: "Artist ID Not Found" }, 414);
    return c.json({ updateImageUserID: updateImageUserID }, 200);
  } catch (e) {
    return c.json(
      { error: "Something went wrong on the clouflare process" },
      400
    );
  }
});
export default app;
