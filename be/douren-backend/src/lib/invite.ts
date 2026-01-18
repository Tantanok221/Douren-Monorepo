import { eq, sql } from "drizzle-orm";
import { s } from "@pkg/database/db";
import type { HonoVariables } from "@/index";

type DrizzleDB = HonoVariables["db"];

// Characters that are unambiguous (no 0/O, 1/I/L confusion)
const INVITE_CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const INVITE_CODE_LENGTH = 8;
const INVITE_CODE_PREFIX = "DOUREN-";

/**
 * Generates a random invite code in format: DOUREN-XXXXXXXX
 * Uses unambiguous characters to avoid confusion
 */
export function generateInviteCode(): string {
	let code = "";
	for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
		const randomIndex = Math.floor(Math.random() * INVITE_CODE_CHARS.length);
		code += INVITE_CODE_CHARS[randomIndex];
	}
	return `${INVITE_CODE_PREFIX}${code}`;
}

/**
 * Validates an invite code and returns the inviter's user ID if valid
 * Returns null if the code is invalid or has no remaining uses
 */
export async function validateInviteCode(
	db: DrizzleDB,
	inviteCode: string,
	masterInviteCode: string,
): Promise<{
	isValid: boolean;
	inviterId: string | null;
	isMasterCode: boolean;
}> {
	// Check if it's the master invite code
	if (inviteCode === masterInviteCode) {
		return { isValid: true, inviterId: null, isMasterCode: true };
	}

	// Look up the invite code in user_invite_settings
	const [inviteSettings] = await db
		.select({
			userId: s.userInviteSettings.userId,
			maxInvites: s.userInviteSettings.maxInvites,
			isActive: s.userInviteSettings.isActive,
		})
		.from(s.userInviteSettings)
		.where(eq(s.userInviteSettings.inviteCode, inviteCode))
		.limit(1);

	if (!inviteSettings || !inviteSettings.isActive) {
		return { isValid: false, inviterId: null, isMasterCode: false };
	}

	// Count how many times this code has been used
	const [usageCount] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(s.inviteHistory)
		.where(eq(s.inviteHistory.inviterId, inviteSettings.userId));

	const currentUses = usageCount?.count ?? 0;

	if (currentUses >= inviteSettings.maxInvites) {
		return { isValid: false, inviterId: null, isMasterCode: false };
	}

	return {
		isValid: true,
		inviterId: inviteSettings.userId,
		isMasterCode: false,
	};
}

/**
 * Creates invite settings for a new user
 */
export async function createUserInviteSettings(
	db: DrizzleDB,
	userId: string,
): Promise<string> {
	const inviteCode = generateInviteCode();
	const id = crypto.randomUUID();

	await db.insert(s.userInviteSettings).values({
		id,
		userId,
		inviteCode,
		maxInvites: 10,
		isActive: true,
	});

	return inviteCode;
}

/**
 * Records an invite usage in the history
 */
export async function recordInviteUsage(
	db: DrizzleDB,
	inviterId: string,
	invitedUserId: string,
	inviteCodeUsed: string,
): Promise<void> {
	await db.insert(s.inviteHistory).values({
		id: crypto.randomUUID(),
		inviterId,
		invitedUserId,
		inviteCodeUsed,
	});
}

/**
 * Gets the invite settings for a user
 */
export async function getUserInviteSettings(
	db: DrizzleDB,
	userId: string,
): Promise<{
	inviteCode: string;
	maxInvites: number;
	usedInvites: number;
	isActive: boolean;
} | null> {
	const [settings] = await db
		.select({
			inviteCode: s.userInviteSettings.inviteCode,
			maxInvites: s.userInviteSettings.maxInvites,
			isActive: s.userInviteSettings.isActive,
		})
		.from(s.userInviteSettings)
		.where(eq(s.userInviteSettings.userId, userId))
		.limit(1);

	if (!settings) {
		return null;
	}

	// Count used invites
	const [usageCount] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(s.inviteHistory)
		.where(eq(s.inviteHistory.inviterId, userId));

	return {
		inviteCode: settings.inviteCode,
		maxInvites: settings.maxInvites,
		usedInvites: usageCount?.count ?? 0,
		isActive: settings.isActive,
	};
}
