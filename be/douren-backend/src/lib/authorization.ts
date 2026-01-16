import { eq } from "drizzle-orm";
import { s } from "@pkg/database/db";
import type { HonoVariables } from "@/index";

type DrizzleDB = HonoVariables["db"];

/**
 * Fetches the role name for a given user
 * @returns "user" (default) or "admin"
 */
export async function getUserRole(
	db: DrizzleDB,
	userId: string,
): Promise<string> {
	const [role] = await db
		.select({ name: s.userRole.name })
		.from(s.userRole)
		.where(eq(s.userRole.userId, userId))
		.limit(1);

	return role?.name || "user";
}

/**
 * Checks if a user has admin role
 */
export async function isAdmin(
	db: DrizzleDB,
	userId: string,
): Promise<boolean> {
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

	// Wait for both queries to complete
	const [role, artistResult] = await Promise.all([rolePromise, artistPromise]);

	// Admins can edit all artists
	if (role === "admin") return true;

	// Check if artist exists
	const [artist] = artistResult;
	if (!artist) return false;

	// Allow if artist belongs to user
	// Deny if artist.userId is null (legacy artists - admin only)
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
