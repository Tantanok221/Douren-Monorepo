import { Context, Env, Hono } from "hono";
import { logger } from "hono/logger";
import { initDB } from "@pkg/database/db";
import { trimTrailingSlash } from "hono/trailing-slash";
import ArtistRoute, { trpcArtistRoute } from "./routes/artist";
import EventRoute, { trpcEventRoute } from "./routes/event";
import OwnerRoute, { trpcOwnerRoute } from "./routes/owner";
import { trpcAdminRoute } from "./routes/admin";
import { router } from "./lib/trpc";
import { trpcServer } from "@hono/trpc-server";
import { ENV_BINDING } from "@pkg/env/constant";
import { syncAuthorTag } from "./helper/migrate";
import { cors } from "hono/cors";
import { TagRoute, trpcTagRoute } from "./routes/tag";
import imageRoute from "./routes/image";
import { cache } from "hono/cache";
import { auth, type Auth, AuthSession } from "@/lib/auth";

export type HonoVariables = {
	db: ReturnType<typeof initDB>;
	user: Auth["$Infer"]["Session"]["user"] | null;
	session: AuthSession | null;
};

export type HonoEnv = { Bindings: ENV_BINDING; Variables: HonoVariables };

const app = new Hono<HonoEnv>();
app.use("*", logger());
app.use("*", trimTrailingSlash());
app.use(
	"*",
	cors({
		origin: (origin) => origin || "*",
		credentials: true,
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	}),
);
app.use("*", async (c, next) => {
	c.set("db", initDB(c.env.DATABASE_URL));
	await next();
});

app.on(["POST", "GET"], "/api/auth/*", (c) => auth(c.env).handler(c.req.raw));

app.use("*", async (c, next) => {
	const session = await auth(c.env).api.getSession({
		headers: c.req.raw.headers,
	});
	if (!session) {
		c.set("user", null);
		c.set("session", null);
		await next();
		return;
	}
	c.set("user", session.user);
	c.set("session", session.session);
	await next();
});

// app.get(
// 	"*",
// 	cache({
// 		cacheName: (c) => c.req.path,
// 		cacheControl: "max-age=3600",
// 	}),
// );
/**
 * Session-based authentication middleware for REST routes
 * Requires a valid better-auth session
 */
const sessionAuthMiddleware = async (
	c: Context<HonoEnv>,
	next: () => Promise<void>,
) => {
	const user = c.get("user");
	if (!user) {
		return c.json(
			{ message: "You must be logged in to access this resource" },
			401,
		);
	}
	await next();
};

// Apply session-based auth to all protected routes
app.on(["POST", "PUT", "DELETE"], "/artist/*", sessionAuthMiddleware);
app.on(["POST", "PUT", "DELETE"], "/event/*", sessionAuthMiddleware);
app.on(["POST", "PUT", "DELETE"], "/tag/*", sessionAuthMiddleware);
app.on(["POST", "PUT", "DELETE"], "/admin/*", sessionAuthMiddleware);
app.on(["POST"], "/image/*", sessionAuthMiddleware);
const appRouter = router({
	artist: trpcArtistRoute,
	eventArtist: trpcEventRoute,
	tag: trpcTagRoute,
	owner: trpcOwnerRoute,
	admin: trpcAdminRoute,
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
				user: c.get("user"),
				session: c.get("session"),
			};
		},
	}),
);
app
	.route("/event", EventRoute)
	.route("/artist", ArtistRoute)
	.route("/tag", TagRoute)
	.route("/owner", OwnerRoute)
	.route("/image", imageRoute)
export { app };
export default {
	/** this part manages cronjobs */
	scheduled(_event: ScheduledEvent, env: ENV_BINDING, ctx: ExecutionContext) {
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
