import { initDB, s } from "@pkg/database/db";
import { BaseDao } from "../Dao";
import { cacheJsonResults, initRedis } from "@pkg/redis/redis";
import { eventArtistSchemaType, eventInputParamsType } from "@pkg/type";
import { createPaginationObject } from "@/helper/createPaginationObject";
import { PAGE_SIZE } from "@/helper/constant";
import { NewEventArtistQueryBuilder } from "@/QueryBuilder";
import { desc, eq } from "drizzle-orm";
import {
	CreateEventArtistSchemaTypes,
	PutEventArtistSchemaTypes,
} from "@/schema/event.zod";

class EventArtistDao implements BaseDao {
	db: ReturnType<typeof initDB>;
	redis;
	url;
	constructor(url: string) {
		this.db = initDB(url);
		this.url = url;
		this.redis = initRedis();
	}

	async Fetch(params: eventInputParamsType) {
		const redisKey = `get_event_artist_${params.eventName}_${params.page}_${params.search}_${params.tag}_${params.sort}_${params.searchTable}`;
		const redisData: eventArtistSchemaType[] | null = await this.redis.json.get(
			redisKey,
			{},
			"$",
		);
		if (redisData && redisData?.length > 0) {
			console.log("redis cache hit");
			return redisData[0];
		}
		const QueryBuilder = NewEventArtistQueryBuilder({ ...params }, this.url);
		try {
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
			return returnObj as eventArtistSchemaType;
		} catch (err) {
			console.log(err);
		}
	}

	async Create(body: CreateEventArtistSchemaTypes) {
		const [counts] = await this.db
			.select({ count: s.eventDm.uuid })
			.from(s.eventDm)
			.orderBy(desc(s.eventDm.uuid))
			.limit(1);
		if (!body.uuid) {
			body.uuid = counts.count + 1;
		}
		// infer as PutEventArtistSchemaTypes to ignore type error meanwhile getting automatic type from zod
		return this.db
			.insert(s.eventDm)
			.values(body as PutEventArtistSchemaTypes)
			.onConflictDoNothing({ target: s.eventDm.uuid })
			.returning();
	}

	async Update(body: PutEventArtistSchemaTypes) {
		return this.db
			.update(s.eventDm)
			.set(body)
			.where(eq(s.eventDm.uuid, Number(body.uuid)))
			.returning();
	}

	async Delete() {}
}

export function NewEventArtistDao(url: string): EventArtistDao {
	return new EventArtistDao(url);
}
