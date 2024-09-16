import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const tagInsertSchema = createInsertSchema(s.tag);
export const tagSelectSchema = createSelectSchema(s.tag);

export type tagInsertSchema = z.infer<typeof tagInsertSchema>;
export type tagSelectSchema = z.infer<typeof tagSelectSchema>;
