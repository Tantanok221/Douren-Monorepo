import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, publicProcedure, authProcedure } from "@/lib/trpc";
import { validateInviteCode, getUserInviteSettings } from "@/lib/invite";
import { createMemoryRateLimiter } from "@/lib/rate-limit";

const inviteValidationLimiter = createMemoryRateLimiter({
	windowMs: 60_000,
	max: 5,
});

type RateLimitContext = {
	honoContext: {
		req: {
			header: (name: string) => string | undefined;
		};
	};
};

const getClientIp = (ctx: RateLimitContext): string => {
	const forwarded = ctx.honoContext.req.header("x-forwarded-for");
	const forwardedIp = forwarded?.split(",")[0]?.trim();
	return (
		forwardedIp ??
		ctx.honoContext.req.header("cf-connecting-ip") ??
		ctx.honoContext.req.header("x-real-ip") ??
		"unknown"
	);
};

export const trpcInviteRoute = router({
	/**
	 * Validate an invite code (public - used during signup)
	 * Returns whether the code is valid without revealing who owns it
	 */
	validate: publicProcedure
		.input(z.object({ inviteCode: z.string().min(1) }))
		.query(async ({ ctx, input }) => {
			const ip = getClientIp(ctx);
			const limit = inviteValidationLimiter(ip);
			if (!limit.allowed) {
				throw new TRPCError({
					code: "TOO_MANY_REQUESTS",
					message: "請稍後再試",
				});
			}
			const result = await validateInviteCode(
				ctx.db,
				input.inviteCode,
				ctx.honoContext.env.MASTER_INVITE_CODE,
				{
					isProduction: ctx.honoContext.env.DEV_ENV === "prod",
					consumeMasterCode: false,
				},
			);
			return {
				isValid: result.isValid,
			};
		}),

	/**
	 * Get the current user's invite settings
	 */
	getMyInviteSettings: authProcedure.query(async ({ ctx }) => {
		const settings = await getUserInviteSettings(ctx.db, ctx.user.id);
		if (!settings) {
			return null;
		}
		return {
			inviteCode: settings.inviteCode,
			maxInvites: settings.maxInvites,
			usedInvites: settings.usedInvites,
			remainingInvites: settings.maxInvites - settings.usedInvites,
			isActive: settings.isActive,
		};
	}),
});
