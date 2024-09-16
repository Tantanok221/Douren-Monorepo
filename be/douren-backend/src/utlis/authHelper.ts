import {getAuth} from "@hono/clerk-auth";
import {Context} from "hono";

export function verifyUser(c: Context):boolean{
    const auth = getAuth(c);
    if (auth?.userId !== c.env.userId && c.env.DEV_ENV === "production") {
    return false
    }
    return true

}