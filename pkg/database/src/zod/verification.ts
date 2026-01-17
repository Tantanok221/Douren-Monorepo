import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const verificationInsertSchema = createInsertSchema(s.verification);
export const verificationSelectSchema = createSelectSchema(s.verification);

export type verificationInsertSchema = z.infer<typeof verificationInsertSchema>;
export type verificationSelectSchema = z.infer<typeof verificationSelectSchema>;
