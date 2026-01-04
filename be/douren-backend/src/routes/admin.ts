import { Hono } from "hono";
import { authProcedure, router } from "@/trpc";
import { NewArtistDao } from "@/Dao/Artist";
import { HonoEnv } from "@/index";

export const trpcAdminRoute = router({
	getMyArtists: authProcedure.query(async (opts) => {
		const ArtistDao = NewArtistDao(opts.ctx.db);
		const userId = opts.ctx.user.id;
		return await ArtistDao.FetchByUserId(userId);
	}),
});

