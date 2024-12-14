import {  Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { desc, eq, sql } from "drizzle-orm";
import { postCloudflareImage } from "./utils/cloudflare";
import { initDB, s } from "@pkg/database/db";
import {BACKEND_BINDING} from "@pkg/env/constant";
import {CloudflareImageResponse} from "./types/cloudflareReponse";

const app = new Hono<{
  Bindings: BACKEND_BINDING ;
}>();

app.use("*", cors());
app.use("*", logger());
app.use("*", async (c, next) => {
  const token = c.req.header("Authorization");
  console.log(c.env.CLOUDFLARE_IMAGE_AUTH_TOKEN)
  if (token === c.env.CLOUDFLARE_IMAGE_AUTH_TOKEN) {
    await next();
  }
  return c.json("Invalid Authorization Token", 403);
});
app.get("/", (c) => {
  return c.text("Pong");
});

app.get("/test", async (c) => {
  const db = initDB();
  const data = await db.query.authorMain.findMany();
  return c.json({ data: data });
});

app.post("/image", async (c) => {
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
  const data = (await response.json()) as CloudflareImageResponse;
  const imageLink = data["result"]["variants"][0];
  return c.json({link: imageLink})
})

app.post("/productImage/:artistId/:imageId", async (c) => {
  const db = initDB();
  let returnResponse;
  const { artistId, imageId } = c.req.param();
  const formData = await c.req.formData();
  const image = formData.get("image") as File | null;
  if (!image) {
    return c.json({ error: "No image file provided" }, 400);
  }
  const data = await postCloudflareImage(c, image);
  const imageLink = data["result"]["variants"][0];
  const exist = await db.query.authorProduct.findMany({
    where: eq(s.authorProduct.id, Number(imageId)),
  });
  console.log(exist);
  if (exist.length != 0 && exist[0].preview) {
    returnResponse = await db
      .update(s.authorProduct)
      .set({ preview: [imageLink, exist[0].preview].join("\n") })
      .returning({ insertedId: s.authorProduct.id });
  } else {
    returnResponse = await db
      .insert(s.authorProduct)
      .values({
        artistId: Number(artistId),
        preview: imageLink,
        thumbnail: imageLink,
      })
      .returning({ insertedId: s.authorProduct.id });
  }
  return c.json({ returnResponse }, 200);
});

app.post("/productThumbnail/:artistId/:title", async (c) => {
  const db = initDB();
  let returnResponse;
  const { artistId, title } = c.req.param();
  const formData = await c.req.formData();
  const image = formData.get("image") as File | null;
  if (!image) {
    return c.json({ error: "No image file provided" }, 400);
  }
  const data = await postCloudflareImage(c, image);
  const imageLink = data["result"]["variants"][0];
  const exist = await db.query.authorProduct.findMany({
    where: eq(s.authorProduct.artistId, Number(artistId)),
  });
  console.log(exist);
  if (exist.length != 0) {
    returnResponse = await db
      .update(s.authorProduct)
      .set({ thumbnail: imageLink })
      .returning({ insertedId: s.authorProduct.id });
  } else {
    returnResponse = await db
      .insert(s.authorProduct)
      .values({
        artistId: Number(artistId),
        thumbnail: imageLink,
        title,
      })
      .returning({ insertedId: s.authorProduct.id });
  }
  return c.json({ returnResponse }, 200);
});

app.post("/dm/:artistId/:eventName", async (c) => {
  const db = initDB()
  let returnResponse;
  const { artistId, eventName } = c.req.param();
  const formData = await c.req.formData();
  const image = formData.get("image") as File | null;
  if (!image) {
    return c.json({ error: "No image file provided" }, 400);
  }
  const EventIdObj = await db.query.event.findFirst({
    where: (event, { ilike }) => ilike(event.name, eventName),
    columns: {
      id: true,
      name: false,
    },
  });
  if (!EventIdObj) return c.json({ error: "Event Name Not Found" }, 414);
  const { id } = EventIdObj;
  const data = await postCloudflareImage(c, image);
  const imageLink = data["result"]["variants"][0];
  const exist = await db.query.eventDm.findMany({
    where: eq(s.eventDm.artistId, Number(artistId)),
  });
  console.log(exist);
  if (exist.length != 0) {
    returnResponse = await db
      .update(s.eventDm)
      .set({ dm: imageLink, eventId: id })
      .returning({ insertedId: s.eventDm.uuid });
  } else {
    const [counts] = await db
      .select({ count: s.eventDm.uuid })
      .from(s.eventDm)
      .orderBy(desc(s.eventDm.uuid))
      .limit(1);

    returnResponse = await db
      .insert(s.eventDm)
      .values({
        uuid: counts.count + 1,
        eventId: Number(id),
        artistId: Number(artistId),
        dm: imageLink,
      })
      .returning({ insertedId: s.eventDm.uuid });
  }
  return c.json({ returnResponse }, 200);
});

app.patch("/artist/:id", async (c) => {
  const db = initDB();
  const { id } = c.req.param();
  try {
    const formData = await c.req.formData();
    const image = formData.get("image") as File | null;
    if (!image) {
      return c.json({ error: "No image file provided" }, 400);
    }

    const data = await postCloudflareImage(c, image);
    const imageLink = data["result"]["variants"][0];
    const updateImageUserID = await db
      .update(s.authorMain)
      .set({ photo: imageLink })
      .where(eq(s.authorMain.uuid, sql`CAST(${id} AS BIGINT)`))
      .returning({ data: s.authorMain });
    if (updateImageUserID.length === 0)
      return c.json({ error: "Artist ID Not Found" }, 414);
    return c.json({ updateImageUserID: updateImageUserID }, 200);
  } catch (e) {
    return c.json(
      { error: "Something went wrong on the cloudflare uploading process" },
      400
    );
  }
});
export default app;
