import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { s } from "../db/index.js";

export const authorMainInsertSchema = createInsertSchema(s.authorMain);
export const authorMainSelectSchema = createSelectSchema(s.authorMain);

export type authorMainInsertSchema = z.infer<typeof authorMainInsertSchema>;
export type authorMainSelectSchema = z.infer<typeof authorMainSelectSchema>;
