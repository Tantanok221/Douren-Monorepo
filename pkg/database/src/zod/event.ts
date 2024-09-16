import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const eventInsertSchema = createInsertSchema(s.event);
export const eventSelectSchema = createSelectSchema(s.event);

export type eventInsertSchema = z.infer<typeof eventInsertSchema>;
export type eventSelectSchema = z.infer<typeof eventSelectSchema>;
