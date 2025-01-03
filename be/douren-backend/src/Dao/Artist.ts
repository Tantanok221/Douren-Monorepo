import { initDB, s } from "@pkg/database/db";
import { ArtistFetchParams } from "@/utlis/fetchHelper";
import { BaseDao } from "../Dao";
import { CreateArtistSchemaTypes } from "@/schema/artist.zod";
import { cacheJsonResults, initRedis } from "@pkg/redis/redis";
import { artistSchemaType } from "@pkg/type";
import { createPaginationObject } from "@/helper/createPaginationObject";
import { PAGE_SIZE } from "@/helper/constant";
import { NewArtistQueryBuilder } from "@/QueryBuilder";
import { desc, eq } from "drizzle-orm";
import { zodSchemaType } from "@pkg/database/zod";

class ArtistDao implements BaseDao {
	db: ReturnType<typeof initDB>;
	redis;
	url;
	constructor(url: string) {
		this.db = initDB(url);
		this.redis = initRedis();
		this.url = url;
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
		const QueryBuilder = NewArtistQueryBuilder(params, this.url);
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
	async Create(body: CreateArtistSchemaTypes) {
		const [counts] = await this.db
			.select({ count: s.authorMain.uuid })
			.from(s.authorMain)
			.orderBy(desc(s.authorMain.uuid))
			.limit(1);
		if (!body.uuid) {
			body.uuid = counts.count + 1;
		}
		return await this.db
			.insert(s.authorMain)
			.values(body)
			.onConflictDoNothing({ target: s.authorMain.uuid })
			.returning();
	}

	async Update(
		artistId: string,
		body: zodSchemaType["authorMain"]["InsertSchema"],
	) {
		body.uuid = Number(artistId);
		return await this.db
			.update(s.authorMain)
			.set(body)
			.where(eq(s.authorMain.uuid, Number(artistId)))
			.returning();
	}

	async Delete(artistId: string) {
		return await this.db
			.delete(s.authorMain)
			.where(eq(s.authorMain.uuid, Number(artistId)))
			.returning();
	}
}

export function NewArtistDao(url: string): ArtistDao {
	return new ArtistDao(url);
}
