import { describe, expect, it, vi, afterEach } from "vitest";
import { TRPCError } from "@trpc/server";

import { s } from "@pkg/database/db";
import type { HonoVariables } from "@/index";
import * as authorization from "@/lib/authorization";

type DbMock = Pick<HonoVariables["db"], "select">;

type DbMockOptions = {
	roleName: string | null;
	artistUserId: string | null;
};

const createDbMock = ({ roleName, artistUserId }: DbMockOptions): DbMock => {
	return {
		select: vi.fn(() => ({
			from: vi.fn((table: unknown) => ({
				where: vi.fn(() => ({
					limit: vi.fn(async () => {
						if (table === s.userRole) {
							return roleName ? [{ name: roleName }] : [];
						}
						if (table === s.authorMain) {
							return [{ userId: artistUserId }];
						}
						return [];
					}),
				})),
			})),
		})),
	};
};

describe("authorization guards", () => {
	afterEach(() => {
		vi.restoreAllMocks();
		authorization.clearAllRoleCaches();
	});

	it("assertCanEditArtist throws FORBIDDEN when unauthorized", async () => {
		const db = createDbMock({
			roleName: "user",
			artistUserId: "someone-else",
		}) as HonoVariables["db"];

		await expect(
			authorization.assertCanEditArtist(db, "user-1", 123),
		).rejects.toBeInstanceOf(TRPCError);
		await expect(
			authorization.assertCanEditArtist(db, "user-1", 123),
		).rejects.toThrow(authorization.ARTIST_FORBIDDEN_MESSAGES.edit);
	});

	it("assertCanDeleteArtist throws FORBIDDEN when unauthorized", async () => {
		const db = createDbMock({
			roleName: "user",
			artistUserId: "someone-else",
		}) as HonoVariables["db"];

		await expect(
			authorization.assertCanDeleteArtist(db, "user-1", 456),
		).rejects.toBeInstanceOf(TRPCError);
		await expect(
			authorization.assertCanDeleteArtist(db, "user-1", 456),
		).rejects.toThrow(authorization.ARTIST_FORBIDDEN_MESSAGES.delete);
	});

	it("assertCanEditArtist does not throw when authorized", async () => {
		const db = createDbMock({
			roleName: "admin",
			artistUserId: "someone-else",
		}) as HonoVariables["db"];

		await expect(
			authorization.assertCanEditArtist(db, "user-1", 789),
		).resolves.toBeUndefined();
	});
});
