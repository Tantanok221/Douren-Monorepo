import { Context } from "hono";

export function verifyUser(c: Context): boolean {
	const auth = c.req.header("Authorization")?.split(" ")[1];
	if (c.env.DEV_ENV === "dev") return true;
	if (c.env.basic_auth_token === c.req.header("Authorization")) return true;
	return false;
}
