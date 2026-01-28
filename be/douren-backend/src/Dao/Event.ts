import { BaseDao } from "@/Dao/index";
import { desc, eq, ne } from "drizzle-orm";
import {
	CreateEventSchemaTypes,
	UpdateEventSchemaTypes,
} from "@/schema/event.zod";
import { initDB, s } from "@pkg/database/db";

class EventDao implements BaseDao {
	db: ReturnType<typeof initDB>;
	constructor(db: ReturnType<typeof initDB>) {
		this.db = db;
	}

	async FetchAll() {
		return this.db.select().from(s.event).orderBy(desc(s.event.id));
	}

	async FetchByEventName(eventName: string) {
		const [data] = await this.db
			.select()
			.from(s.event)
			.where(eq(s.event.name, eventName));
		return data;
	}

	async FetchById(id: number) {
		const [data] = await this.db
			.select()
			.from(s.event)
			.where(eq(s.event.id, id));
		return data;
	}

	async GetDefault() {
		const [data] = await this.db
			.select()
			.from(s.event)
			.where(eq(s.event.isDefault, true))
			.limit(1);
		return data ?? null;
	}

	async Create(body: CreateEventSchemaTypes) {
		return await this.db.insert(s.event).values(body).returning();
	}

	async Update(id: number, data: UpdateEventSchemaTypes) {
		return await this.db
			.update(s.event)
			.set(data)
			.where(eq(s.event.id, id))
			.returning();
	}

	async Delete(id: number) {
		return await this.db.delete(s.event).where(eq(s.event.id, id)).returning();
	}

	async SetDefault(id: number) {
		// First, unset all other defaults
		await this.db
			.update(s.event)
			.set({ isDefault: false })
			.where(ne(s.event.id, id));

		// Then set the specified event as default
		return await this.db
			.update(s.event)
			.set({ isDefault: true })
			.where(eq(s.event.id, id))
			.returning();
	}
}

export function NewEventDao(db: ReturnType<typeof initDB>): EventDao {
	return new EventDao(db);
}
