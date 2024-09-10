import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const eventInsertSchema = createInsertSchema(s.event);
export const eventSelectSchema = createSelectSchema(s.event);

export type zodEventInsertSchema = z.infer<typeof eventInsertSchema>;
export type zodEventSelectSchema = z.infer<typeof eventSelectSchema>;
