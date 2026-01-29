import { z } from "zod";
import { router, publicProcedure, authProcedure } from "@/lib/trpc";
import { validateInviteCode, getUserInviteSettings } from "@/lib/invite";

export const trpcInviteRoute = router({
	/**
	 * Validate an invite code (public - used during signup)
	 * Returns whether the code is valid without revealing who owns it
	 */
	validate: publicProcedure
		.input(z.object({ inviteCode: z.string().min(1) }))
		.query(async ({ ctx, input }) => {
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
