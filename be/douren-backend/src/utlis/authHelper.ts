import type { Context } from "hono";

type AuthEnv = {
	DEV_ENV?: unknown;
	basic_auth_token?: unknown;
	CLOUDFLARE_IMAGE_AUTH_TOKEN?: unknown;
};

function asNonEmptyString(value: unknown): string | undefined {
	if (typeof value !== "string") return undefined;
	if (value.length === 0) return undefined;
	return value;
}

function getBearerToken(ctx: Context): string | undefined {
	const header = asNonEmptyString(ctx.req.header("Authorization"));
	if (!header) return undefined;

	const match = /^Bearer ([^\s]+)$/.exec(header);
	if (!match) return undefined;

	return match[1];
}

export function verifyUser(ctx: Context): boolean {
	const env = ctx.env as AuthEnv;
	if (env.DEV_ENV === "dev") return true;

	const token = getBearerToken(ctx);
	if (!token) return false;

	const basicAuthToken = asNonEmptyString(env.basic_auth_token);
	if (basicAuthToken && token === basicAuthToken) return true;

	const cloudflareImageAuthToken = asNonEmptyString(env.CLOUDFLARE_IMAGE_AUTH_TOKEN);
	if (cloudflareImageAuthToken && token === cloudflareImageAuthToken) return true;

	return false;
}

export function verifyAdminUser(ctx: Context): boolean {
	const env = ctx.env as AuthEnv;
	if (env.DEV_ENV === "dev") return true;

	const token = getBearerToken(ctx);
	if (!token) return false;

	const basicAuthToken = asNonEmptyString(env.basic_auth_token);
	if (!basicAuthToken) return false;

	return token === basicAuthToken;
}

export function verifyImageUser(ctx: Context): boolean {
	const env = ctx.env as AuthEnv;
	if (env.DEV_ENV === "dev") return true;

	const token = getBearerToken(ctx);
	if (!token) return false;

	const cloudflareImageAuthToken = asNonEmptyString(env.CLOUDFLARE_IMAGE_AUTH_TOKEN);
	if (!cloudflareImageAuthToken) return false;

	return token === cloudflareImageAuthToken;
}
