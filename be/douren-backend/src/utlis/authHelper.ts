import { Context } from "hono";

export function verifyUser(c: Context): boolean {
	if (c.env.DEV_ENV === "dev") return true;
	return false;
}
