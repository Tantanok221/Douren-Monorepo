import {  initRedis } from "@pkg/redis/redis";
import { initDB, s } from "@pkg/database/db";

const tagKey = "Douren_Tag";

export async function fetchTag(
	db: ReturnType<typeof initDB>,
	redis: ReturnType<typeof initRedis>,
) {
	const data = await db.select().from(s.tag);
	return data;
}
