import { Hono } from "hono";
import { logger } from "hono/logger";

type Bindings = {
  DATABASE_URL: string;
};
const artistRoute = new Hono<{ Bindings: Bindings }>();
artistRoute.use(logger());

export default artistRoute;
