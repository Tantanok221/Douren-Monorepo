import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { initDB, s } from "@pkg/database/db";
import { zodSchema } from "@pkg/database/zod";

import { BaseDao } from "./index";

type BoothRow = z.infer<typeof zodSchema.booth.SelectSchema>;

class BoothDao implements BaseDao {
	db: ReturnType<typeof initDB>;
	constructor(db: ReturnType<typeof initDB>) {
		this.db = db;
	}

	async FetchByEventId(eventId: number): Promise<BoothRow[]> {
		return this.db
			.select()
			.from(s.booth)
			.where(eq(s.booth.eventId, eventId))
			.orderBy(desc(s.booth.id));
	}

	async FetchById(id: number): Promise<BoothRow | undefined> {
		const [booth] = await this.db
			.select()
			.from(s.booth)
			.where(eq(s.booth.id, id));
		return booth;
	}

	async Create(
		body: z.infer<typeof zodSchema.booth.InsertSchema>,
	): Promise<BoothRow[]> {
		return this.db.insert(s.booth).values(body).returning();
	}

	async UpsertByEventAndName(
		body: z.infer<typeof zodSchema.booth.InsertSchema>,
	): Promise<BoothRow[]> {
		const [existing] = await this.db
			.select()
			.from(s.booth)
			.where(
				and(eq(s.booth.eventId, body.eventId), eq(s.booth.name, body.name)),
			);

		if (existing) {
			return this.db
				.update(s.booth)
				.set({
					locationDay01: body.locationDay01,
					locationDay02: body.locationDay02,
					locationDay03: body.locationDay03,
				})
				.where(eq(s.booth.id, existing.id))
				.returning();
		}

		return this.Create(body);
	}

	async Update(
		id: number,
		body: Partial<z.infer<typeof zodSchema.booth.InsertSchema>>,
	): Promise<BoothRow[]> {
		return this.db
			.update(s.booth)
			.set(body)
			.where(eq(s.booth.id, id))
			.returning();
	}

	async Delete(id: number): Promise<BoothRow[]> {
		return this.db.delete(s.booth).where(eq(s.booth.id, id)).returning();
	}
}

export function NewBoothDao(db: ReturnType<typeof initDB>): BoothDao {
	return new BoothDao(db);
}
