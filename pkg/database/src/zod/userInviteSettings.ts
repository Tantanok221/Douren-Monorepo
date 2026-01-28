import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const userInviteSettingsInsertSchema = createInsertSchema(s.userInviteSettings);
export const userInviteSettingsSelectSchema = createSelectSchema(s.userInviteSettings);

export type userInviteSettingsInsertSchema = z.infer<typeof userInviteSettingsInsertSchema>;
export type userInviteSettingsSelectSchema = z.infer<typeof userInviteSettingsSelectSchema>;
