import { Env, Hono } from "hono";
import { logger } from "hono/logger";
import { initDB } from "@pkg/database/db";
import { trimTrailingSlash } from "hono/trailing-slash";
import ArtistRoute, {trpcArtistRoute} from "./routes/artist";
import EventRoute, {trpcEventRoute} from "./routes/event";
import {router} from "./trpc";
import { trpcServer } from '@hono/trpc-server'
import {BACKEND_BINDING} from "@pkg/env/constant";
import {syncAuthorTag} from "./helper/migrate";
const app = new Hono<{ Bindings: BACKEND_BINDING }>();
app.use("*", logger());
app.use("*", trimTrailingSlash());

const appRouter = router({
  artist: trpcArtistRoute,
  eventArtist: trpcEventRoute
})
export type AppRouter = typeof appRouter;

app.use(
    '/trpc/*',
    trpcServer({
      router: appRouter,
    })
)
app.route("/event", EventRoute)
    .route("/artist", ArtistRoute)
export { app }

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
      await syncAuthorTag(db);
      console.log("CRONJOB EXECUTED");
    };
    ctx.waitUntil(delayedProcessing());
  },
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx);
  },
  /** this part manages regular REST */
};
