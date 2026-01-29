import { describe, expect, it, vi } from "vitest";

import { validateInviteCode } from "../invite";

type Db = Parameters<typeof validateInviteCode>[0];

type SelectMocks = {
	select: ReturnType<typeof vi.fn>;
	from: ReturnType<typeof vi.fn>;
	where: ReturnType<typeof vi.fn>;
	limit: ReturnType<typeof vi.fn>;
};

type InsertMocks = {
	insert: ReturnType<typeof vi.fn>;
	values: ReturnType<typeof vi.fn>;
	onConflictDoNothing: ReturnType<typeof vi.fn>;
	returning: ReturnType<typeof vi.fn>;
};

const createSelectDb = (rows: Array<{ id: string }>): { db: Db; mocks: SelectMocks } => {
	const limit = vi.fn().mockResolvedValue(rows);
	const where = vi.fn().mockReturnValue({ limit });
	const from = vi.fn().mockReturnValue({ where });
	const select = vi.fn().mockReturnValue({ from });

	return {
		db: { select } as unknown as Db,
		mocks: { select, from, where, limit },
	};
};

const createInsertDb = (
	rows: Array<{ id: string }>,
): { db: Db; mocks: InsertMocks } => {
	const returning = vi.fn().mockResolvedValue(rows);
	const onConflictDoNothing = vi.fn().mockReturnValue({ returning });
	const values = vi.fn().mockReturnValue({ onConflictDoNothing });
	const insert = vi.fn().mockReturnValue({ values });

	return {
		db: { insert } as unknown as Db,
		mocks: { insert, values, onConflictDoNothing, returning },
	};
};

describe("validateInviteCode master invite usage", () => {
	const masterCode = "MASTER-1234";

	it("allows master invite once in prod when not yet used", async () => {
		const { db, mocks } = createSelectDb([]);

		const result = await validateInviteCode(db, masterCode, masterCode, {
			isProduction: true,
			consumeMasterCode: false,
		});

		expect(result).toEqual({
			isValid: true,
			inviterId: null,
			isMasterCode: true,
		});
		expect(mocks.select).toHaveBeenCalledOnce();
	});

	it("rejects master invite in prod when already used", async () => {
		const { db, mocks } = createSelectDb([{ id: "used" }]);

		const result = await validateInviteCode(db, masterCode, masterCode, {
			isProduction: true,
			consumeMasterCode: false,
		});

		expect(result).toEqual({
			isValid: false,
			inviterId: null,
			isMasterCode: true,
		});
		expect(mocks.select).toHaveBeenCalledOnce();
	});

	it("consumes master invite in prod before user creation", async () => {
		const { db, mocks } = createInsertDb([{ id: "created" }]);

		const result = await validateInviteCode(db, masterCode, masterCode, {
			isProduction: true,
			consumeMasterCode: true,
		});

		expect(result).toEqual({
			isValid: true,
			inviterId: null,
			isMasterCode: true,
		});
		expect(mocks.insert).toHaveBeenCalledOnce();
	});

	it("rejects master invite in prod when consume conflicts", async () => {
		const { db, mocks } = createInsertDb([]);

		const result = await validateInviteCode(db, masterCode, masterCode, {
			isProduction: true,
			consumeMasterCode: true,
		});

		expect(result).toEqual({
			isValid: false,
			inviterId: null,
			isMasterCode: true,
		});
		expect(mocks.insert).toHaveBeenCalledOnce();
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
