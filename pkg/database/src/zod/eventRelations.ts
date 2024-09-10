import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const eventRelationsInsertSchema = createInsertSchema(s.eventRelations);
export const eventRelationsSelectSchema = createSelectSchema(s.eventRelations);

export type zodEventRelationsInsertSchema = z.infer<typeof eventRelationsInsertSchema>;
export type zodEventRelationsSelectSchema = z.infer<typeof eventRelationsSelectSchema>;
