import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const authorTagInsertSchema = createInsertSchema(s.authorTag);
export const authorTagSelectSchema = createSelectSchema(s.authorTag);

export type authorTagInsertSchema = z.infer<typeof authorTagInsertSchema>;
export type authorTagSelectSchema = z.infer<typeof authorTagSelectSchema>;
