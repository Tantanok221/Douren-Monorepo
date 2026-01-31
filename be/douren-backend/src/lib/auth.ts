import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth, APIError } from "better-auth";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import * as schema from "@pkg/database/db";
import type { ENV_BINDING } from "@pkg/env/constant";
import { createEmailService } from "./email";
import {
	validateInviteCode,
	createUserInviteSettings,
	recordInviteUsage,
	normalizeInviteCode,
} from "./invite";

type InviteValidation = {
	isValid: boolean;
	inviterId: string | null;
	isMasterCode: boolean;
};

type InviteContext = {
	body?: {
		inviteCode?: string;
		invite_code?: string;
	};
	inviteValidation?: InviteValidation;
	originalInviteCode?: string;
};

const getInviteCodeFromContext = (ctx: unknown): string | null => {
	if (!ctx || typeof ctx !== "object") return null;
	const context = ctx as InviteContext;
	if (typeof context.originalInviteCode === "string") {
		return normalizeInviteCode(context.originalInviteCode);
	}
	const body = context.body;
	if (!body || typeof body !== "object") return null;
	if (typeof body.inviteCode === "string") {
		return normalizeInviteCode(body.inviteCode);
	}
	if (typeof body.invite_code === "string") {
		return normalizeInviteCode(body.invite_code);
	}
	return null;
};

const getInviteValidationFromContext = (
	ctx: unknown,
): InviteValidation | null => {
	if (!ctx || typeof ctx !== "object") return null;
	const context = ctx as InviteContext;
	return context.inviteValidation ?? null;
};

const setInviteContext = (
	ctx: unknown,
	inviteCode: string,
	validation: InviteValidation,
): void => {
	if (!ctx || typeof ctx !== "object") return;
	const context = ctx as InviteContext;
	context.inviteValidation = validation;
	context.originalInviteCode = inviteCode;
};

const getMasterInviteCode = (env: ENV_BINDING): string =>
	env.MASTER_INVITE_CODE ?? "";

export const getCmsResetPasswordUrl = (
	env: ENV_BINDING,
	token: string,
	fallbackUrl: string,
): string => {
	const isLocalDev = env.DEV_ENV === "dev";
	const cmsBaseUrl =
		env.CMS_FRONTEND_URL ?? (isLocalDev ? "http://localhost:5174" : "");
	if (!cmsBaseUrl) return fallbackUrl;
	const trimmedBaseUrl = cmsBaseUrl.replace(/\/+$/, "");
	return `${trimmedBaseUrl}/reset-password?token=${encodeURIComponent(token)}`;
};

type AuthCookieSameSite = "none" | "lax" | "strict" | "None" | "Lax" | "Strict";

type AuthCookieConfig = {
	useSecureCookies: boolean;
	sameSite: AuthCookieSameSite;
	secure: boolean;
};

export const getAuthCookieConfig = (env: ENV_BINDING): AuthCookieConfig => {
	const isProduction = env.DEV_ENV === "prod";
	return {
		useSecureCookies: isProduction,
		sameSite: isProduction ? "none" : "lax",
		secure: isProduction,
	};
};

export const auth = (env: ENV_BINDING) => {
	const sql = neon(env.DATABASE_URL);
	const db = drizzle(sql, { schema: schema.s });
	const emailService = createEmailService(env);
	const isProduction = env.DEV_ENV === "prod";
	const cookieConfig = getAuthCookieConfig(env);

	const logSignupTiming = (label: string, start: number) => {
		const elapsedMs = Math.round(performance.now() - start);
		console.log(`[auth-signup] ${label} ${elapsedMs}ms`);
	};
	const logPasswordTiming = (label: string, start: number) => {
		const elapsedMs = Math.round(performance.now() - start);
		console.log(`[auth-password] ${label} ${elapsedMs}ms`);
	};

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
						const beforeStart = performance.now();
						console.log("[auth-signup] before.start");
						try {
							const existingUserStart = performance.now();
							const [existingUser] = await db
								.select({ id: schema.s.user.id })
								.from(schema.s.user)
								.where(eq(schema.s.user.email, user.email))
								.limit(1);
							logSignupTiming("before.existingUser", existingUserStart);

							if (existingUser) {
								throw new APIError("CONFLICT", {
									message: "使用者已存在",
								});
							}

							const inviteCodeFromUser = (user as { inviteCode?: unknown })
								.inviteCode;
							const inviteCode =
								typeof inviteCodeFromUser === "string"
									? normalizeInviteCode(inviteCodeFromUser)
									: getInviteCodeFromContext(ctx);

							if (!inviteCode) {
								throw new APIError("BAD_REQUEST", {
									message: "DEBUG: No invite code received",
								});
							}

							const masterInviteCode = getMasterInviteCode(env);
							const inviteValidationStart = performance.now();
							const validation = await validateInviteCode(
								db,
								inviteCode,
								masterInviteCode,
								{ isProduction, consumeMasterCode: true },
							);
							logSignupTiming("before.validateInvite", inviteValidationStart);

							if (!validation.isValid) {
								throw new APIError("BAD_REQUEST", {
									message: `邀請碼無效或已過期 (${inviteCode})`,
								});
							}

							// Pass validation result to 'after' hook using context if possible,
							// or fallback to attaching to user but we suspect user object is recreated.
							// We'll use a WeakMap or similar if we could, but here we'll try attaching to ctx.
							setInviteContext(ctx, inviteCode, validation);

							// Don't save inviteCode to the user table
							const userWithInvite = user as typeof user & {
								inviteCode?: unknown;
							};
							const { inviteCode: inviteCodeToOmit, ...userData } =
								userWithInvite;
							void inviteCodeToOmit;
							logSignupTiming("before.done", beforeStart);
							return { data: userData };
						} catch (e) {
							logSignupTiming("before.error", beforeStart);
							if (e instanceof APIError) throw e;
							console.error("Error in before hook:", e);
							throw new APIError("INTERNAL_SERVER_ERROR", {
								message: "Internal server error during validation",
							});
						}
					},
					after: async (user, ctx) => {
						const afterStart = performance.now();
						console.log("[auth-signup] after.start");
						try {
							const inviteLookupStart = performance.now();
							const inviteCode = getInviteCodeFromContext(ctx);
							let validation = getInviteValidationFromContext(ctx);
							logSignupTiming("after.getInviteContext", inviteLookupStart);

							if (!inviteCode) {
								logSignupTiming("after.done.noInvite", afterStart);
								return;
							}
							const masterInviteCode = getMasterInviteCode(env);
							if (!validation) {
								const inviteValidationStart = performance.now();
								validation = await validateInviteCode(
									db,
									inviteCode,
									masterInviteCode,
									{ isProduction, consumeMasterCode: false },
								);
								logSignupTiming("after.validateInvite", inviteValidationStart);
							}

							if (validation?.isValid) {
								// 1. Create invite settings for the new user
								const createInviteStart = performance.now();
								await createUserInviteSettings(db, user.id);
								logSignupTiming(
									"after.createInviteSettings",
									createInviteStart,
								);

								// 2. Record usage if not master code
								if (!validation.isMasterCode && validation.inviterId) {
									const recordUsageStart = performance.now();
									await recordInviteUsage(
										db,
										validation.inviterId,
										user.id,
										inviteCode,
									);
									logSignupTiming("after.recordInviteUsage", recordUsageStart);
								}

								// 3. Assign admin role if master code
								if (validation.isMasterCode) {
									const assignRoleStart = performance.now();
									await db.insert(schema.s.userRole).values({
										id: crypto.randomUUID(),
										userId: user.id,
										name: "admin",
									});
									logSignupTiming("after.assignAdminRole", assignRoleStart);
								}
							}
							logSignupTiming("after.done", afterStart);
						} catch (e) {
							logSignupTiming("after.error", afterStart);
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
			password: {
				hash: async (password: string) => {
					const hashStart = performance.now();
					console.log("[auth-password] hash.start");
					const result = await hashPassword(password);
					logPasswordTiming("hash.done", hashStart);
					return result;
				},
				verify: async ({
					password,
					hash,
				}: {
					password: string;
					hash: string;
				}) => {
					const verifyStart = performance.now();
					console.log("[auth-password] verify.start");
					const result = await verifyPassword({ password, hash });
					logPasswordTiming("verify.done", verifyStart);
					return result;
				},
			},
			async sendResetPassword({ user, url, token }) {
				const resetUrl = getCmsResetPasswordUrl(env, token, url);
				await emailService.sendPasswordResetEmail(user.email, resetUrl);
			},
		},
		emailVerification: {
			sendVerificationEmail: async ({ user, url }) => {
				await emailService.sendVerificationEmail(user.email, url);
			},
			sendOnSignUp: true,
			autoSignInAfterVerification: true,
		},
		trustedOrigins: (() => {
			const origins = [env.CMS_FRONTEND_URL].filter(Boolean) as string[];
			if (env.DEV_ENV === "dev") {
				origins.push("http://localhost:5174");
			}
			return origins;
		})(),
		advanced: {
			useSecureCookies: cookieConfig.useSecureCookies,
			defaultCookieAttributes: {
				sameSite: cookieConfig.sameSite,
				secure: cookieConfig.secure,
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
