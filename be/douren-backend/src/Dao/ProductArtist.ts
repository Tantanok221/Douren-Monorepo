import { initDB } from "@pkg/database/db";
import { BaseDao } from "../Dao";
import { initRedis } from "@pkg/redis/redis";

interface ProductArtist {
	artistId: string;
}

class ProductArtistDao implements BaseDao {
	db: ReturnType<typeof initDB>;
	redis;
	constructor(
		db: ReturnType<typeof initDB>,
		redis: ReturnType<typeof initRedis>,
	) {
		this.db = db;
		this.redis = redis;
	}

	async Fetch(params: ProductArtist) {
		const returnObj = this.db.select();
		return returnObj;
	}
}

export function NewProductArtistDao(
	db: ReturnType<typeof initDB>,
	redis: ReturnType<typeof initRedis>,
): ProductArtistDao {
	return new ProductArtistDao(db, redis);
}
