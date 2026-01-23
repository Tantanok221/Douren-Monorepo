import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth, APIError } from "better-auth";
import { eq } from "drizzle-orm";
import * as schema from "@pkg/database/db";
import type { ENV_BINDING } from "@pkg/env/constant";
import { createEmailService } from "./email";
import {
	validateInviteCode,
	createUserInviteSettings,
	recordInviteUsage,
} from "./invite";

export const auth = (env: ENV_BINDING) => {
	const sql = neon(env.DATABASE_URL);
	const db = drizzle(sql, { schema: schema.s });
	const emailService = createEmailService(env);

	return betterAuth({
		database: drizzleAdapter(db, { provider: "pg", schema: schema.s }),
		baseURL: env.BETTER_AUTH_URL,
		secret: env.BETTER_AUTH_SECRET,
		user: {
			additionalFields: {},
		},
		databaseHooks: {
			user: {
				create: {
					before: async (user, ctx) => {
						try {
							const [existingUser] = await db
								.select({ id: schema.s.user.id })
								.from(schema.s.user)
								.where(eq(schema.s.user.email, user.email))
								.limit(1);

							if (existingUser) {
								throw new APIError("CONFLICT", {
									message: "使用者已存在",
								});
							}

							// Try to get inviteCode from request if possible
							// @ts-ignore
							const inviteCode =
								(user.inviteCode as string) || ctx?.body?.inviteCode;

							if (!inviteCode) {
								throw new APIError("BAD_REQUEST", {
									message: "DEBUG: No invite code received",
								});
							}

							const validation = await validateInviteCode(
								db,
								inviteCode,
								env.MASTER_INVITE_CODE,
							);

							if (!validation.isValid) {
								throw new APIError("BAD_REQUEST", {
									message: `邀請碼無效或已過期 (${inviteCode})`,
								});
							}

							// Pass validation result to 'after' hook using context if possible,
							// or fallback to attaching to user but we suspect user object is recreated.
							// We'll use a WeakMap or similar if we could, but here we'll try attaching to ctx.
							// @ts-ignore
							ctx.inviteValidation = validation;
							// @ts-ignore
							ctx.originalInviteCode = inviteCode;

							// Don't save inviteCode to the user table
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							const { inviteCode: _, ...userData } = user;
							return { data: userData };
						} catch (e) {
							if (e instanceof APIError) throw e;
							console.error("Error in before hook:", e);
							throw new APIError("INTERNAL_SERVER_ERROR", {
								message: "Internal server error during validation",
							});
						}
					},
					after: async (user, ctx) => {
						try {
							// @ts-ignore
							const validation = ctx.inviteValidation as {
								isValid: boolean;
								inviterId: string | null;
								isMasterCode: boolean;
							};
							// @ts-ignore
							const inviteCode = ctx.originalInviteCode as string;

							if (validation && inviteCode) {
								// 1. Create invite settings for the new user
								await createUserInviteSettings(db, user.id);

								// 2. Record usage if not master code
								if (!validation.isMasterCode && validation.inviterId) {
									await recordInviteUsage(
										db,
										validation.inviterId,
										user.id,
										inviteCode,
									);
								}

								// 3. Assign admin role if master code
								if (validation.isMasterCode) {
									await db.insert(schema.s.userRole).values({
										id: crypto.randomUUID(),
										userId: user.id,
										name: "admin",
									});
								}
							}
						} catch (e) {
							console.error("Error in after hook:", e);
							// Don't throw here to avoid failing the whole signup if just post-processing fails
							// But maybe we want to know?
						}
					},
				},
			},
		},
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
		},
		trustedOrigins: [env.CMS_FRONTEND_URL].filter(Boolean) as string[],
		advanced: {
			useSecureCookies: env.DEV_ENV !== "true",
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
			},
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
