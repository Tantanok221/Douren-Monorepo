import { initDB } from "@pkg/database/db";
import { BaseDao } from "../Dao";
import { cacheJsonResults, initRedis } from "@pkg/redis/redis";

interface ProductArtist {
	artistId: string;
}

class ProductArtistDao implements BaseDao {
	db: ReturnType<typeof initDB>;
	redis;
	constructor(db: ReturnType<typeof initDB>, redis: ReturnType<typeof initRedis>) {
		this.db = db
		this.redis = redis;
	}

	async Fetch(params: ProductArtist) {
		const redisKey = `get_product_artist_${params.artistId}`;
		const redisData: unknown[] | null = await this.redis.json.get(
			redisKey,
			{},
			"$",
		);
		if (redisData && redisData?.length > 0) {
			console.log("redis cache hit");
			return redisData[0];
		}
		const returnObj = this.db.select();
		await cacheJsonResults(this.redis, redisKey, returnObj);
		return returnObj;
	}
}

export function NewProductArtistDao(db: ReturnType<typeof initDB>, redis: ReturnType<typeof initRedis>): ProductArtistDao {
	return new ProductArtistDao(db,redis);
}
