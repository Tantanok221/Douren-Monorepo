import { adminProcedure, publicProcedure, router } from "@/lib/trpc";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { createTag, fetchTag, renameTag } from "@/Dao/Tag";
import { HonoEnv } from "@/index";
import { s } from "@pkg/database/db";
import { zodSchema } from "@pkg/database/zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

const tagNameSchema = z.string().trim().min(1).max(50);

export const trpcTagRoute = router({
	getTag: publicProcedure.query(async (opts) => {
		const data = await fetchTag(opts.ctx.db);
		if (!data) throw new Error("Fetch Tag Had Failed");
		return data;
	}),
	createTag: adminProcedure
		.input(
			z.object({
				tag: tagNameSchema,
			}),
		)
		.mutation(async (opts) => {
			const { tag } = opts.input;
			const [existing] = await opts.ctx.db
				.select()
				.from(s.tag)
				.where(eq(s.tag.tag, tag));

			if (existing) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "Tag already exists",
				});
			}

			return await createTag(opts.ctx.db, tag);
		}),
	renameTag: adminProcedure
		.input(
			z.object({
				currentTag: tagNameSchema,
				nextTag: tagNameSchema,
			}),
		)
		.mutation(async (opts) => {
			const { currentTag, nextTag } = opts.input;

			if (currentTag === nextTag) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "New tag name must be different",
				});
			}

			const [existing] = await opts.ctx.db
				.select()
				.from(s.tag)
				.where(eq(s.tag.tag, currentTag));
			if (!existing) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Tag not found",
				});
			}

			const [conflict] = await opts.ctx.db
				.select()
				.from(s.tag)
				.where(eq(s.tag.tag, nextTag));
			if (conflict) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "Tag already exists",
				});
			}

			const result = await renameTag(opts.ctx.db, currentTag, nextTag);
			if (!result) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Tag not found",
				});
			}

			return result;
		}),
});

const getTagRoute = createRoute({
	method: "get",
	path: "/",
	tags: ["Tag"],
	responses: {
		200: {
			description: "List tags",
			content: {
				"application/json": { schema: z.array(zodSchema.tag.SelectSchema) },
			},
		},
	},
});

export const TagRoute = new OpenAPIHono<HonoEnv>().openapi(
	getTagRoute,
	async (c) => {
		const data = await fetchTag(c.var.db);
		return c.json(data);
	},
);
