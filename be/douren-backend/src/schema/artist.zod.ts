import { s } from "@pkg/database/db";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const CreateArtistSchema = createInsertSchema(s.authorMain, {
	uuid: (schema) => schema.uuid.optional(),
});
export type CreateArtistSchemaTypes = z.infer<typeof CreateArtistSchema>;
