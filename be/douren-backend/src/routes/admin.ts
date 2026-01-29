import { and, eq, ilike, or, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { authProcedure, adminProcedure, router } from "@/lib/trpc";
import { NewArtistDao } from "@/Dao/Artist";
import { getUserRole, isAdmin, clearUserRoleCache } from "@/lib/authorization";
import { artistInputParams } from "@pkg/type";
import { s } from "@pkg/database/db";
import { z } from "zod";

export const trpcAdminRoute = router({
	getMyArtists: authProcedure.query(async (opts) => {
		const ArtistDao = NewArtistDao(opts.ctx.db);
		const userId = opts.ctx.user.id;
		return await ArtistDao.FetchByUserId(userId);
	}),
	getMyArtistsPaginated: authProcedure
		.input(artistInputParams)
		.query(async (opts) => {
			const ArtistDao = NewArtistDao(opts.ctx.db);
			const userId = opts.ctx.user.id;
			return await ArtistDao.FetchByUserIdWithPagination(userId, opts.input);
		}),
	getMyRole: authProcedure.query(async (opts) => {
		const role = await getUserRole(opts.ctx.db, opts.ctx.user.id);
		const isUserAdmin = await isAdmin(opts.ctx.db, opts.ctx.user.id);
		return { role, isAdmin: isUserAdmin };
	}),
	getUsers: adminProcedure
		.input(z.object({ search: z.string().optional() }))
		.query(async (opts) => {
			const search = opts.input.search?.trim();
				const query = opts.ctx.db
					.select({
						id: s.user.id,
						name: s.user.name,
						email: s.user.email,
						emailVerified: s.user.emailVerified,
					createdAt: s.user.createdAt,
					role: sql<string>`COALESCE(${s.userRole.name}, 'user')`.as(
						"role",
					),
				})
					.from(s.user)
					.leftJoin(s.userRole, eq(s.userRole.userId, s.user.id))
					.$dynamic();

				const conditions = [eq(s.user.emailVerified, true)];

				if (search) {
					const searchCondition = or(
						ilike(s.user.name, `%${search}%`),
						ilike(s.user.email, `%${search}%`),
					);

					if (searchCondition) {
						conditions.push(searchCondition);
					}
				}

				query.where(and(...conditions));

			return await query.orderBy(desc(s.user.createdAt));
		}),
	updateUserRole: adminProcedure
		.input(
			z.object({
				userId: z.string(),
				role: z.enum(["admin", "user"]),
			}),
		)
		.mutation(async (opts) => {
			const { userId, role } = opts.input;

			if (userId === opts.ctx.user.id) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "不能變更自己的角色",
				});
			}

			const [existingUser] = await opts.ctx.db
				.select({ id: s.user.id })
				.from(s.user)
				.where(eq(s.user.id, userId))
				.limit(1);

			if (!existingUser) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "使用者不存在",
				});
			}

			await opts.ctx.db
				.delete(s.userRole)
				.where(eq(s.userRole.userId, userId));

			if (role === "admin") {
				await opts.ctx.db.insert(s.userRole).values({
					id: crypto.randomUUID(),
					userId,
					name: "admin",
				});
			}

			clearUserRoleCache(userId);

			return { userId, role };
		}),
});
