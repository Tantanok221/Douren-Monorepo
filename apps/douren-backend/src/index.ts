import { Hono } from "hono";
import eventRoute from "./routes/events";
import { logger } from "hono/logger";
import artistRoute from "./routes/artist";
import { initDB, up } from "@repo/database/db";

type Bindings = {
  DATABASE_URL: string;
};
const app = new Hono<{ Bindings: Bindings }>();
app.get("/migrate", async (c) => {
  const db = initDB(c.env.DATABASE_URL!);
  await up(db);
  return c.text("Migration complete");
});
app.route("/event", eventRoute);
app.route("/artist", artistRoute);
export default app;
