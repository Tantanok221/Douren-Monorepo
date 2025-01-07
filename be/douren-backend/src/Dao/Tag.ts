import { cacheJsonResults, initRedis } from "@pkg/redis/redis";
import { initDB, s } from "@pkg/database/db";
import { InnerTagSchema } from "@pkg/type";

const tagKey = "Douren_Tag";

export async function fetchTag(
	db: ReturnType<typeof initDB>,
	redis: ReturnType<typeof initRedis>,
) {
	const redisData = (await redis.json.get(tagKey, {}, "$")) as
		| InnerTagSchema[]
		| null;
	if (redisData && redisData?.length > 0) {
		return redisData[0];
	}
	const data = await db.select().from(s.tag);
	await cacheJsonResults(redis, tagKey, data);
	return data;
}
