import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const sessionInsertSchema = createInsertSchema(s.session);
export const sessionSelectSchema = createSelectSchema(s.session);

export type sessionInsertSchema = z.infer<typeof sessionInsertSchema>;
export type sessionSelectSchema = z.infer<typeof sessionSelectSchema>;
