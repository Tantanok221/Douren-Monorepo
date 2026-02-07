import { beforeEach, describe, expect, it, vi } from "vitest";

import { NewBoothDao } from "@/Dao/Booth";

vi.mock("@pkg/database/db", () => ({
	initDB: vi.fn(),
	s: {
		booth: {
			id: "id",
			eventId: "eventId",
			name: "name",
			locationDay01: "locationDay01",
			locationDay02: "locationDay02",
			locationDay03: "locationDay03",
		},
	},
}));

describe("Booth DAO", () => {
	let mockDb: {
		select: ReturnType<typeof vi.fn>;
		insert: ReturnType<typeof vi.fn>;
		update: ReturnType<typeof vi.fn>;
		delete: ReturnType<typeof vi.fn>;
	};
	let boothDao: ReturnType<typeof NewBoothDao>;

	beforeEach(() => {
		const returning = vi.fn().mockResolvedValue([{ id: 1, eventId: 1, name: "A01" }]);
		mockDb = {
			select: vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue({
						orderBy: vi.fn().mockResolvedValue([{ id: 1, eventId: 1, name: "A01" }]),
					}),
				}),
			}),
			insert: vi.fn().mockReturnValue({
				values: vi.fn().mockReturnValue({ returning }),
			}),
			update: vi.fn().mockReturnValue({
				set: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue({ returning }),
				}),
			}),
			delete: vi.fn().mockReturnValue({
				where: vi.fn().mockReturnValue({ returning }),
			}),
		};
		boothDao = NewBoothDao(mockDb as never);
	});

	it("creates booth", async () => {
		const result = await boothDao.Create({
			eventId: 1,
			name: "A01",
			locationDay01: "A01",
		});
		expect(mockDb.insert).toHaveBeenCalledOnce();
		expect(result).toEqual([{ id: 1, eventId: 1, name: "A01" }]);
	});

	it("updates booth", async () => {
		const result = await boothDao.Update(1, { name: "A02" });
		expect(mockDb.update).toHaveBeenCalledOnce();
		expect(result).toEqual([{ id: 1, eventId: 1, name: "A01" }]);
	});

	it("fetches booth by event id", async () => {
		const result = await boothDao.FetchByEventId(1);
		expect(mockDb.select).toHaveBeenCalledOnce();
		expect(result).toEqual([{ id: 1, eventId: 1, name: "A01" }]);
	});

	it("deletes booth", async () => {
		const result = await boothDao.Delete(1);
		expect(mockDb.delete).toHaveBeenCalledOnce();
		expect(result).toEqual([{ id: 1, eventId: 1, name: "A01" }]);
	});
});
