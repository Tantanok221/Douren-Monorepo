import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import * as schema from "@pkg/database/db";
import type { ENV_BINDING } from "@pkg/env/constant";
import { createEmailService } from "./email";

export const auth = (env: ENV_BINDING) => {
	const sql = neon(env.DATABASE_URL);
	const db = drizzle(sql);
	const emailService = createEmailService(env);

	return betterAuth({
		database: drizzleAdapter(db, { provider: "pg", schema: schema.s }),
		baseURL: env.BETTER_AUTH_URL,
		secret: env.BETTER_AUTH_SECRET,
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: true,
			async sendResetPassword({ user, url }) {
				await emailService.sendPasswordResetEmail(user.email, url);
			},
		},
		emailVerification: {
			sendVerificationEmail: async ({ user, url }) => {
				await emailService.sendVerificationEmail(user.email, url);
			},
			sendOnSignUp: true,
			autoSignInAfterVerification: true,
			callbackURL: env.CMS_FRONTEND_URL,
		},
		trustedOrigins: [env.CMS_FRONTEND_URL, env.MAIN_FRONTEND_URL].filter(
			Boolean,
		) as string[],
		advanced: {
			useSecureCookies: env.DEV_ENV !== "true",
		},
		rateLimit: {
			enabled: true,
			window: 60, // 60 second window
			max: 100, // 100 requests per window for general endpoints
			customRules: {
				"/sign-in/*": { window: 60, max: 10 }, // Stricter for login
				"/sign-up/*": { window: 60, max: 5 }, // Stricter for signup
			},
		},
	});
};

export type Auth = ReturnType<typeof auth>;
export type AuthSession = Auth["$Infer"]["Session"]["session"];
