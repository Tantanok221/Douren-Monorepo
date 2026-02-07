import { s } from "@pkg/database/db";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const CreateEventArtistSchema = createInsertSchema(s.eventDm);

export const PutEventArtistSchema = createInsertSchema(s.eventDm);
export const CreateEventSchema = z.object({
	name: z.string(),
	isDefault: z.boolean().optional().default(false),
});
export type CreateEventSchemaTypes = z.infer<typeof CreateEventSchema>;

export const CreateBoothSchema = createInsertSchema(s.booth, {
	name: (schema) => schema.min(1, "Booth name is required"),
});
export type CreateBoothSchemaTypes = z.infer<typeof CreateBoothSchema>;

export const UpdateBoothSchema = createInsertSchema(s.booth).partial();
export type UpdateBoothSchemaTypes = z.infer<typeof UpdateBoothSchema>;

export const DeleteBoothSchema = z.object({
	id: z.number().int().positive(),
});

export const GetBoothByEventSchema = z.object({
	eventId: z.number().int().positive(),
});

export type CreateEventArtistSchemaTypes = z.infer<
	typeof CreateEventArtistSchema
>;
export type PutEventArtistSchemaTypes = z.infer<typeof PutEventArtistSchema>;

export const GetEventArtistByIdSchema = z.object({
	id: z.string(),
});

export const UpdateEventArtistSchema = z.object({
	id: z.string(),
	data: CreateEventArtistSchema,
});

// Event admin schemas
export const UpdateEventSchema = z.object({
	name: z.string().optional(),
	isDefault: z.boolean().optional(),
});
export type UpdateEventSchemaTypes = z.infer<typeof UpdateEventSchema>;

export const DeleteEventSchema = z.object({
	id: z.number(),
});

export const SetDefaultEventSchema = z.object({
	id: z.number(),
});
