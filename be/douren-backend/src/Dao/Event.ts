import { BaseDao } from "@/Dao/index";
import { desc, eq } from "drizzle-orm";
import { CreateEventSchemaTypes } from "@/schema/event.zod";
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

	async Create(body: CreateEventSchemaTypes) {
		return await this.db
			.insert(s.event)
			.values(body)
			.onConflictDoNothing({ target: s.event.id })
			.returning();
	}

	async Update() {}

	async Delete() {}
}

export function NewEventDao(db: ReturnType<typeof initDB>): EventDao {
	return new EventDao(db);
}
