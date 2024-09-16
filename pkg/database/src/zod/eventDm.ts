import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const eventDmInsertSchema = createInsertSchema(s.eventDm);
export const eventDmSelectSchema = createSelectSchema(s.eventDm);

export type eventDmInsertSchema = z.infer<typeof eventDmInsertSchema>;
export type eventDmSelectSchema = z.infer<typeof eventDmSelectSchema>;
