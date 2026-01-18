import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const inviteHistoryInsertSchema = createInsertSchema(s.inviteHistory);
export const inviteHistorySelectSchema = createSelectSchema(s.inviteHistory);

export type inviteHistoryInsertSchema = z.infer<typeof inviteHistoryInsertSchema>;
export type inviteHistorySelectSchema = z.infer<typeof inviteHistorySelectSchema>;
