import { Env, Hono } from "hono";
import { logger } from "hono/logger";
import { initDB, up } from "@pkg/database/db";
import { ENV_VARIABLE } from "./helper/constant";
import { clerkMiddleware } from "@hono/clerk-auth";
import { trimTrailingSlash } from "hono/trailing-slash";
import ArtistRoute from "./routes/artist";
import EventRoute from "./routes/event";

const app = new Hono<{ Bindings: ENV_VARIABLE }>();
app.use("*", clerkMiddleware());
app.use("*", logger());
app.use("*", trimTrailingSlash());
const routes = app
  .route("/event", EventRoute)
  .route("/artist", ArtistRoute)
export type DourenBackend = typeof routes;

export default {
  /** this part manages cronjobs */
  scheduled(
    event: ScheduledEvent,
    env: {
      DATABASE_URL?: any;
    },
    ctx: ExecutionContext
  ) {
    const delayedProcessing = async () => {
      const db = initDB();
      await up(db);
      console.log("CRONJOB EXECUTED");
    };
    ctx.waitUntil(delayedProcessing());
  },
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx);
  },
  /** this part manages regular REST */
};
