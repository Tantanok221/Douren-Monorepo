import { Context, Hono } from "hono";
import { initDB } from "./db";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { authorMain, authorProduct, event, eventDm } from "./db/schema";
import { eq, sql } from "drizzle-orm";
import { postCloudflareImage } from "./utils/cloudflare";
type Bindings = {
  DATABASE_URL: string;
  CLOUDFLARE_IMAGE_ENDPOINT: string;
  CLOUDFLARE_IMAGE_TOKEN: string;
  AUTH_TOKEN: string;
};

const app = new Hono<{
  Bindings: Bindings;
}>();

app.use("*", cors());
app.use("*", logger());
app.use("*",async (c,next) => {
  const token = c.req.header("Authorization")
  if(token != c.env.AUTH_TOKEN){
    await next()
  }
  return c.json("Invalid Authorization Token",403)
})
app.get("/", (c) => {
  return c.text("Pong");
});

app.get("/test", async (c) => {
  const db = initDB(c.env.DATABASE_URL);
  const data = await db.query.authorMain.findMany();
  return c.json({ data: data });
});



app.post("/productImage/:artistId/:imageId", async (c) => {
  const db = initDB(c.env.DATABASE_URL);
  let returnResponse;
  const { artistId,imageId } = c.req.param();
  const formData = await c.req.formData();
  const image = formData.get("image") as File | null;
  if (!image) {
    return c.json({ error: "No image file provided" }, 400);
  }
  const data = await postCloudflareImage(c, image);
  const imageLink = data["result"]["variants"][0];
  const exist = await db.query.authorProduct.findMany({
    where: eq(authorProduct.id, Number(imageId)),
  });
  console.log(exist)
  if (exist.length != 0 && exist[0].preview){
    returnResponse = await db
      .update(authorProduct)
      .set({ preview: [imageLink, exist[0].preview].join("\n")  })
      .returning({insertedId: authorProduct.id});
  } else {
    returnResponse = await db
      .insert(authorProduct)
      .values({
        artistId: Number(artistId),
        preview: imageLink,
        thumbnail: imageLink
      })
      .returning({insertedId: authorProduct.id});
  }
  return c.json({ returnResponse }, 200);
});

app.post("/productThumbnail/:artistId/:title", async (c) => {
  const db = initDB(c.env.DATABASE_URL);
  let returnResponse;
  const { artistId,title } = c.req.param();
  const formData = await c.req.formData();
  const image = formData.get("image") as File | null;
  if (!image) {
    return c.json({ error: "No image file provided" }, 400);
  }
  const data = await postCloudflareImage(c, image);
  const imageLink = data["result"]["variants"][0];
  const exist = await db.query.authorProduct.findMany({
    where: eq(authorProduct.artistId, Number(artistId)),
  });
  console.log(exist)
  if (exist.length != 0) {
    returnResponse = await db
      .update(authorProduct)
      .set({ thumbnail: imageLink })
      .returning({insertedId: authorProduct.id});
  } else {
    returnResponse = await db
      .insert(authorProduct)
      .values({
        artistId: Number(artistId),
        thumbnail: imageLink,
        title
      })
      .returning({insertedId: authorProduct.id});
  }
  return c.json({ returnResponse }, 200);
});

app.post("/dm/:artistId/:eventName", async (c) => {
  const db = initDB(c.env.DATABASE_URL);
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
    where: eq(eventDm.artistId, Number(artistId)),
  });
  console.log(exist)
  if (exist.length != 0) {
    returnResponse = await db
      .update(eventDm)
      .set({ dm: imageLink, eventId: id })
      .returning({insertedId: eventDm.uuid});
  } else {
    returnResponse = await db
      .insert(eventDm)
      .values({
        eventId: Number(id),
        artistId: Number(artistId),
        dm: imageLink,
      })
      .returning({insertedId: eventDm.uuid});
  }
  return c.json({ returnResponse }, 200);
});

app.patch("/artist/:id", async (c) => {
  const db = initDB(c.env.DATABASE_URL);
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
      .update(authorMain)
      .set({ photo: imageLink })
      .where(eq(authorMain.uuid, sql`CAST(${id} AS BIGINT)`))
      .returning({ data: authorMain });
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
