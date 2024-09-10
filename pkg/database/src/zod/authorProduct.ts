import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const authorProductInsertSchema = createInsertSchema(s.authorProduct);
export const authorProductSelectSchema = createSelectSchema(s.authorProduct);

export type zodAuthorProductInsertSchema = z.infer<typeof authorProductInsertSchema>;
export type zodAuthorProductSelectSchema = z.infer<typeof authorProductSelectSchema>;
