import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const authorProductRelationsInsertSchema = createInsertSchema(s.authorProductRelations);
export const authorProductRelationsSelectSchema = createSelectSchema(s.authorProductRelations);

export type zodAuthorProductRelationsInsertSchema = z.infer<typeof authorProductRelationsInsertSchema>;
export type zodAuthorProductRelationsSelectSchema = z.infer<typeof authorProductRelationsSelectSchema>;
