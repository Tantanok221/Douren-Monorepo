import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const authorMainRelationsInsertSchema = createInsertSchema(s.authorMainRelations);
export const authorMainRelationsSelectSchema = createSelectSchema(s.authorMainRelations);

export type zodAuthorMainRelationsInsertSchema = z.infer<typeof authorMainRelationsInsertSchema>;
export type zodAuthorMainRelationsSelectSchema = z.infer<typeof authorMainRelationsSelectSchema>;
