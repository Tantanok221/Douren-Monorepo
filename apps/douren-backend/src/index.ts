import { Env, Hono } from "hono";
import { logger } from "hono/logger";
import GetEventRoutes from "./routes/GET/event";
import GetArtistRoutes from "./routes/GET/artist";
import PostArtistRoutes from "./routes/POST/artist";
import { initDB, up } from "@repo/database/db";
import { ENV_VARIABLE } from "./helper/constant";
import PutArtistRoutes from "./routes/PUT/artist";
import PostEventRoutes from "./routes/POST/event";
import PutEventRoute from "./routes/PUT/event";

const app = new Hono<{ Bindings: ENV_VARIABLE }>();
app.route("/event", GetEventRoutes);
app.route("/event", PostEventRoutes);
app.route("/event", PutEventRoute);
app.route("/artist", GetArtistRoutes);
app.route("/artist", PostArtistRoutes);
app.route("/artist", PutArtistRoutes);
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
      const db = initDB(env.DATABASE_URL!);
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
