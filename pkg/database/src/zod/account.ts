import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const accountInsertSchema = createInsertSchema(s.account);
export const accountSelectSchema = createSelectSchema(s.account);

export type accountInsertSchema = z.infer<typeof accountInsertSchema>;
export type accountSelectSchema = z.infer<typeof accountSelectSchema>;
