import { initDB } from "@pkg/database/db";
import {
	ArtistFetchParams,
	EventArtistFetchParams,
} from "../utlis/fetchHelper";
import { BaseDao } from "../Dao";
import { CreateArtistSchemaTypes } from "../schema/artist.zod";
import { cacheJsonResults, initRedis } from "@pkg/redis/redis";
import { artistSchemaType } from "@pkg/type";
import { createPaginationObject } from "../helper/createPaginationObject";
import { PAGE_SIZE } from "../helper/constant";
import { NewQueryBuilder } from "../QueryBuilder";

interface ProductArtist {
	artistId: string;
}

class ProductArtistDao implements BaseDao {
	db: ReturnType<typeof initDB>;
	redis;
	url: string;

	constructor(url: string) {
		this.db = initDB(url);
		this.redis = initRedis();
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

export function NewProductArtistDao(url: string): ProductArtistDao {
	return new ProductArtistDao(url);
}
