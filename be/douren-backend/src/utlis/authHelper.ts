import { Context } from "hono";

export function verifyUser(c: Context): boolean {
	const auth = c.req.header("Authorization")?.split(" ")[1];
	console.log(auth, c.env.basic_auth_token,c.env.CLOUDFLARE_IMAGE_AUTH_TOKEN )
	if (c.env.DEV_ENV === "dev") return true;
	if (c.env.basic_auth_token === auth) return true;
	if (c.env.CLOUDFLARE_IMAGE_AUTH_TOKEN === auth) return true;
	return false;
}
