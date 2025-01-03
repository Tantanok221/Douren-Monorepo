import { BaseDao } from "@/Dao/index";
import { desc, eq } from "drizzle-orm";
import { CreateEventSchemaTypes } from "@/schema/event.zod";
import { initDB, s } from "@pkg/database/db";
import { initRedis } from "@pkg/redis/redis";

class EventDao implements BaseDao {
	db: ReturnType<typeof initDB>;
	redis;
	url: string;
	constructor(url: string) {
		this.db = initDB(url);
		this.redis = initRedis();
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
		const [counts] = await this.db
			.select({ count: s.event.id })
			.from(s.event)
			.orderBy(desc(s.event.id))
			.limit(1);
		if (!body.id) {
			body.id = counts.count + 1;
		}
		return await this.db
			.insert(s.event)
			.values(body)
			.onConflictDoNothing({ target: s.event.id })
			.returning();
	}

	async Update() {}

	async Delete() {}
}

export function NewEventDao(url: string): EventDao {
	return new EventDao(url);
}
