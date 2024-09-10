import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const eventDmRelationsInsertSchema = createInsertSchema(s.eventDmRelations);
export const eventDmRelationsSelectSchema = createSelectSchema(s.eventDmRelations);

export type zodEventDmRelationsInsertSchema = z.infer<typeof eventDmRelationsInsertSchema>;
export type zodEventDmRelationsSelectSchema = z.infer<typeof eventDmRelationsSelectSchema>;
