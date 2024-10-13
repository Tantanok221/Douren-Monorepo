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

class ArtistDao implements BaseDao {
	db: ReturnType<typeof initDB>;
	redis;
	constructor() {
		this.db = initDB();
		this.redis = initRedis();
	}

	async Fetch(params: ArtistFetchParams) {
		const redisKey = `get_artist_${params.page}_${params.search}_${params.tag}_${params.sort}_${params.searchTable}`;
		const redisData: artistSchemaType[] | null = await this.redis.json.get(
			redisKey,
			{},
			"$",
		);
		if (redisData && redisData?.length > 0) {
			console.log("redis cache hit");
			return redisData[0];
		}
		const QueryBuilder = NewQueryBuilder(params);
		const { SelectQuery, CountQuery } = QueryBuilder.BuildQuery();
		const [data, [counts]] = await Promise.all([
			SelectQuery.query,
			CountQuery.query,
		]);
		const returnObj = createPaginationObject(
			data,
			Number(params.page),
			PAGE_SIZE,
			counts.totalCount,
		) as object;
		console.log("Setting redis cache");
		await cacheJsonResults(this.redis, redisKey, returnObj);
		return returnObj as artistSchemaType;
	}
	async Create(schema: CreateArtistSchemaTypes) {}

	async Update() {}

	async Delete() {}
}

export function NewArtistDao(): ArtistDao {
	return new ArtistDao();
}
