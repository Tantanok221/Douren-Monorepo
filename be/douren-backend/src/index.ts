import { Env, Hono } from "hono";
import { logger } from "hono/logger";
import { initDB } from "@pkg/database/db";
import { trimTrailingSlash } from "hono/trailing-slash";
import ArtistRoute, { trpcArtistRoute } from "./routes/artist";
import EventRoute, { trpcEventRoute } from "./routes/event";
import { router } from "./trpc";
import { trpcServer } from "@hono/trpc-server";
import { BACKEND_BINDING } from "@pkg/env/constant";
import { syncAuthorTag } from "./helper/migrate";
import { cors } from "hono/cors";
import { TagRoute, trpcTagRoute } from "./routes/tag";
import imageRoute from "./routes/image";
import { cache } from "hono/cache";
import { verifyUser } from "@/utlis/authHelper";

export type HonoVariables = {
	db: ReturnType<typeof initDB>;
};

export type HonoEnv = { Bindings: BACKEND_BINDING; Variables: HonoVariables };

const app = new Hono<HonoEnv>();
app.use("*", logger());
app.use("*", trimTrailingSlash());
app.use("*", cors());
app.use("*", async (c, next) => {
	c.set("db", initDB(c.env.DATABASE_URL));
	await next();
});
app.get(
	"*",
	cache({
		cacheName: (c) => c.req.path,
		cacheControl: "max-age=3600",
	}),
);
app.on(["POST", "PUT", "DELETE"], "/*", async (c, next) => {
	const verified = verifyUser(c);
	if (!verified)
		return c.json(
			{ message: "You are not authorized to perform this actions" },
			401,
		);
	await next();
});
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
		createContext: (_opts, c) => {
			console.log("init context");
			return {
				db: initDB(c.env.DATABASE_URL),
				honoContext: c,
			};
		},
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
		_event: ScheduledEvent,
		env: BACKEND_BINDING,
		ctx: ExecutionContext,
	) {
		const delayedProcessing = async () => {
			const db = initDB(env.DATABASE_URL);
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
