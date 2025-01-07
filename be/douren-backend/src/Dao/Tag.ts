import { initRedis } from "@pkg/redis/redis";
import { initDB, s } from "@pkg/database/db";


export async function fetchTag(
	db: ReturnType<typeof initDB>,
	redis: ReturnType<typeof initRedis>,
) {
	return db.select().from(s.tag);
}
