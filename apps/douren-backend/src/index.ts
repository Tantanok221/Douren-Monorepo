import { Env, Hono } from "hono";
import eventRoute from "./routes/events";
import { logger } from "hono/logger";
import artistRoute from "./routes/artist";
import { initDB, up } from "@repo/database/db";

type Bindings = {
  DATABASE_URL: string;
};
const app = new Hono<{ Bindings: Bindings }>();
app.route("/event", eventRoute);
app.route("/artist", artistRoute);
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