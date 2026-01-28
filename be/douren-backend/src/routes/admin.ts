import { Hono } from "hono";
import { authProcedure, router } from "@/lib/trpc";
import { NewArtistDao } from "@/Dao/Artist";
import { HonoEnv } from "@/index";
import { getUserRole, isAdmin } from "@/lib/authorization";
import { artistInputParams } from "@pkg/type";

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
});
