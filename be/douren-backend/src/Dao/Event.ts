import { BaseDao } from "@/Dao/index";
import { initDB, s } from "@pkg/database/src/db";
import { cacheJsonResults, initRedis } from "@pkg/redis/src";
import { desc, eq } from "drizzle-orm";
import { CreateEventSchemaTypes } from "@/schema/event.zod";

class EventDao implements BaseDao {
	db: ReturnType<typeof initDB>;
	redis;
	constructor() {
		this.db = initDB();
		this.redis = initRedis();
	}

	async Fetch(eventName: string) {
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

export function NewEventDao(): EventDao {
	return new EventDao();
}
