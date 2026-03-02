import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const boothInsertSchema = createInsertSchema(s.booth);
export const boothSelectSchema = createSelectSchema(s.booth);

export type boothInsertSchema = z.infer<typeof boothInsertSchema>;
export type boothSelectSchema = z.infer<typeof boothSelectSchema>;
