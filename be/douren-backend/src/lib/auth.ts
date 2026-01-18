import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import * as schema from "@pkg/database/db";
import { ENV_BINDING } from "@pkg/env/constant"; // Ensure the schema is imported

export const auth = (env: ENV_BINDING) => {
	const sql = neon(env.DATABASE_URL);
	const db = drizzle(sql);

	return betterAuth({
		database: drizzleAdapter(db, { provider: "pg", schema: schema.s }),
		baseURL: env.BETTER_AUTH_URL,
		secret: env.BETTER_AUTH_SECRET,
		emailAndPassword: {
			enabled: true,
		},
		trustedOrigins: [env.CMS_FRONTEND_URL],
		session: {
			expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
			updateAge: 60 * 60 * 24, // Update session every 24 hours
			cookieCache: {
				enabled: true,
				maxAge: 60 * 5, // Cache for 5 minutes
			},
		},
	});
};

export type Auth = ReturnType<typeof auth>;
export type AuthSession = Auth["$Infer"]["Session"]["session"];
