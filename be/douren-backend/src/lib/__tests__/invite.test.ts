import { describe, expect, it, vi } from "vitest";

import { validateInviteCode } from "../invite";

type Db = Parameters<typeof validateInviteCode>[0];

describe("validateInviteCode master invite usage", () => {
	const masterCode = "MASTER-1234";

	it("allows master invite in prod without tracking", async () => {
		const select = vi.fn();
		const insert = vi.fn();
		const db = { select, insert } as unknown as Db;

		const result = await validateInviteCode(db, masterCode, masterCode, {
			isProduction: true,
			consumeMasterCode: false,
		});

		expect(result).toEqual({
			isValid: true,
			inviterId: null,
			isMasterCode: true,
		});
		expect(select).not.toHaveBeenCalled();
		expect(insert).not.toHaveBeenCalled();
	});

	it("allows master invite in prod even when consume is requested", async () => {
		const select = vi.fn();
		const insert = vi.fn();
		const db = { select, insert } as unknown as Db;

		const result = await validateInviteCode(db, masterCode, masterCode, {
			isProduction: true,
			consumeMasterCode: true,
		});

		expect(result).toEqual({
			isValid: true,
			inviterId: null,
			isMasterCode: true,
		});
		expect(select).not.toHaveBeenCalled();
		expect(insert).not.toHaveBeenCalled();
	});

	it("allows master invite in non-prod without tracking", async () => {
		const select = vi.fn();
		const insert = vi.fn();
		const db = { select, insert } as unknown as Db;

		const result = await validateInviteCode(db, masterCode, masterCode, {
			isProduction: false,
			consumeMasterCode: true,
		});

		expect(result).toEqual({
			isValid: true,
			inviterId: null,
			isMasterCode: true,
		});
		expect(select).not.toHaveBeenCalled();
		expect(insert).not.toHaveBeenCalled();
	});
});
