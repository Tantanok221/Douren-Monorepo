import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const userRoleInsertSchema = createInsertSchema(s.userRole);
export const userRoleSelectSchema = createSelectSchema(s.userRole);

export type userRoleInsertSchema = z.infer<typeof userRoleInsertSchema>;
export type userRoleSelectSchema = z.infer<typeof userRoleSelectSchema>;
