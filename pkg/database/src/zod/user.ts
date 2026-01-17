import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const userInsertSchema = createInsertSchema(s.user);
export const userSelectSchema = createSelectSchema(s.user);

export type userInsertSchema = z.infer<typeof userInsertSchema>;
export type userSelectSchema = z.infer<typeof userSelectSchema>;
