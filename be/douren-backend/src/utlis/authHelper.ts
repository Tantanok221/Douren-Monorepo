import { Context } from "hono";

export function verifyUser(c: Context): boolean {
	// Always allow in development environment
	if (c.env.DEV_ENV === "dev") return true;

	// Extract and validate authorization header
	const authHeader = c.req.header("Authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return false;
	}

	const token = authHeader.split(" ")[1];
	if (!token) {
		return false;
	}

	// Check against basic auth token
	if (c.env.basic_auth_token && c.env.basic_auth_token === token) {
		return true;
	}

	// Check against Cloudflare image auth token
	if (
		c.env.CLOUDFLARE_IMAGE_AUTH_TOKEN &&
		c.env.CLOUDFLARE_IMAGE_AUTH_TOKEN === token
	) {
		return true;
	}

	return false;
}

export function verifyAdminUser(c: Context): boolean {
	// Always allow in development environment
	if (c.env.DEV_ENV === "dev") return true;

	// Extract and validate authorization header
	const authHeader = c.req.header("Authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return false;
	}

	const token = authHeader.split(" ")[1];
	if (!token) {
		return false;
	}

	// Check against basic auth token only
	return c.env.basic_auth_token && c.env.basic_auth_token === token;
}

export function verifyImageUser(c: Context): boolean {
	// Always allow in development environment
	if (c.env.DEV_ENV === "dev") return true;

	// Extract and validate authorization header
	const authHeader = c.req.header("Authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return false;
	}

	const token = authHeader.split(" ")[1];
	if (!token) {
		return false;
	}

	// Check against Cloudflare image auth token only
	return (
		c.env.CLOUDFLARE_IMAGE_AUTH_TOKEN &&
		c.env.CLOUDFLARE_IMAGE_AUTH_TOKEN === token
	);
}
