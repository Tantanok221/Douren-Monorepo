import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const masterInviteUsageInsertSchema = createInsertSchema(s.masterInviteUsage);
export const masterInviteUsageSelectSchema = createSelectSchema(s.masterInviteUsage);

export type masterInviteUsageInsertSchema = z.infer<typeof masterInviteUsageInsertSchema>;
export type masterInviteUsageSelectSchema = z.infer<typeof masterInviteUsageSelectSchema>;
