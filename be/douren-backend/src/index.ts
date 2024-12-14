import { Context, Env, Hono } from "hono";
import { logger } from "hono/logger";
import { initDB } from "@pkg/database/db";
import { trimTrailingSlash } from "hono/trailing-slash";
import ArtistRoute, { trpcArtistRoute } from "./routes/artist";
import EventRoute, { trpcEventRoute } from "./routes/event";
import { router } from "./trpc";
import { trpcServer } from "@hono/trpc-server";
import { BACKEND_BINDING } from "@pkg/env/constant";
import { syncAuthorTag } from "./helper/migrate";
import { initRedis } from "@pkg/redis/redis";
import { RedisStore } from "@hono-rate-limiter/redis";
import { rateLimiter } from "hono-rate-limiter";
import { cors } from "hono/cors";
import { TagRoute, trpcTagRoute } from "./routes/tag";
import imageRoute from "@/routes/image";

const redis = initRedis();
const store = new RedisStore({ client: redis });

const limiter = rateLimiter({
	windowMs: 10 * 1000,
	limit: 20, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	keyGenerator: (c: Context) => c.req.header("cf-connecting-ip") ?? "", // Method to generate custom identifiers for clients.
	store, // Redis, MemoryStore, etc. See below.
});

const app = new Hono<{ Bindings: BACKEND_BINDING }>();
app.use("*", logger());
app.use("*", trimTrailingSlash());
app.use("*", limiter);
app.use(cors());

const appRouter = router({
	artist: trpcArtistRoute,
	eventArtist: trpcEventRoute,
	tag: trpcTagRoute,
});

export type AppRouter = typeof appRouter;
app.use(
	"/trpc/*",
	trpcServer({
		router: appRouter,
	}),
);
app
	.route("/event", EventRoute)
	.route("/artist", ArtistRoute)
	.route("/tag", TagRoute)
	.route("/image", imageRoute);
export { app };
export default {
	/** this part manages cronjobs */
	scheduled(
		event: ScheduledEvent,
		env: BACKEND_BINDING,
		ctx: ExecutionContext,
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
