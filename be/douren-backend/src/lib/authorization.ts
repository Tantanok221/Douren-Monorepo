import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { s } from "@pkg/database/db";
import type { HonoVariables } from "@/index";
import { LRUCache } from "lru-cache";

type DrizzleDB = HonoVariables["db"];

// LRU cache for user roles (Vercel Rule 3.1)
// Cache persists across requests in Cloudflare Workers' Fluid Compute
const roleCache = new LRUCache<string, string>({
	max: 1000,
	ttl: 5 * 60 * 1000, // 5 minutes
});

/**
 * Fetches the role name for a given user
 * @returns "user" (default) or "admin"
 */
export async function getUserRole(
	db: DrizzleDB,
	userId: string,
): Promise<string> {
	const cached = roleCache.get(userId);
	if (cached) return cached;

	const [role] = await db
		.select({ name: s.userRole.name })
		.from(s.userRole)
		.where(eq(s.userRole.userId, userId))
		.limit(1);

	const result = role?.name || "user";
	roleCache.set(userId, result);
	return result;
}

/**
 * Checks if a user has admin role
 */
export async function isAdmin(db: DrizzleDB, userId: string): Promise<boolean> {
	const role = await getUserRole(db, userId);
	return role === "admin";
}

/**
 * Checks if a user can edit an artist
 * Rules:
 * - Admins can edit all artists
 * - Users can only edit artists they own (artist.userId === userId)
 * - Legacy artists (userId = null) can only be edited by admins
 */
export async function canEditArtist(
	db: DrizzleDB,
	userId: string,
	artistId: number,
): Promise<boolean> {
	// Start both queries in parallel to avoid waterfall (Vercel Rule 1.3)
	const rolePromise = getUserRole(db, userId);
	const artistPromise = db
		.select({ userId: s.authorMain.userId })
		.from(s.authorMain)
		.where(eq(s.authorMain.uuid, artistId))
		.limit(1);

	const [role, artistResult] = await Promise.all([rolePromise, artistPromise]);

	if (role === "admin") return true;

	const [artist] = artistResult;
	if (!artist) return false;

	return artist.userId === userId;
}

/**
 * Checks if a user can delete an artist
 * Same rules as canEditArtist
 */
export async function canDeleteArtist(
	db: DrizzleDB,
	userId: string,
	artistId: number,
): Promise<boolean> {
	return canEditArtist(db, userId, artistId);
}

export const ARTIST_FORBIDDEN_MESSAGES = {
	edit: "You don't have permission to edit this artist",
	delete: "You don't have permission to delete this artist",
} as const;

export async function assertCanEditArtist(
	db: DrizzleDB,
	userId: string,
	artistId: number,
): Promise<void> {
	const authorized = await canEditArtist(db, userId, artistId);
	if (!authorized) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: ARTIST_FORBIDDEN_MESSAGES.edit,
		});
	}
}

export async function assertCanDeleteArtist(
	db: DrizzleDB,
	userId: string,
	artistId: number,
): Promise<void> {
	const authorized = await canDeleteArtist(db, userId, artistId);
	if (!authorized) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: ARTIST_FORBIDDEN_MESSAGES.delete,
		});
	}
}


/**
 * Clears the role cache for a specific user
 * Call this when user roles are updated
 */
export function clearUserRoleCache(userId: string): void {
	roleCache.delete(userId);
}

/**
 * Clears the entire role cache
 * Call this for bulk role updates or maintenance
 */
export function clearAllRoleCaches(): void {
	roleCache.clear();
}
