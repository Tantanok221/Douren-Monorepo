import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const ownerInsertSchema = createInsertSchema(s.owner);
export const ownerSelectSchema = createSelectSchema(s.owner);

export type zodOwnerInsertSchema = z.infer<typeof ownerInsertSchema>;
export type zodOwnerSelectSchema = z.infer<typeof ownerSelectSchema>;
