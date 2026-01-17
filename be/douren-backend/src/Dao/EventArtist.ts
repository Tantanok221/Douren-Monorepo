import { initDB, s } from "@pkg/database/db";
import { BaseDao } from "../Dao";
import { eventArtistSchemaType, eventInputParamsType } from "@pkg/type";
import { createPaginationObject } from "@/helper/createPaginationObject";
import { PAGE_SIZE } from "@/helper/constant";
import { NewEventArtistQueryBuilder } from "@/QueryBuilder";
import { eq } from "drizzle-orm";
import {
	CreateEventArtistSchemaTypes,
	PutEventArtistSchemaTypes,
} from "@/schema/event.zod";

class EventArtistDao implements BaseDao {
	db: ReturnType<typeof initDB>;
	constructor(db: ReturnType<typeof initDB>) {
		this.db = db;
	}

	private static assertDefined<T>(value: T): asserts value is NonNullable<T> {
		if (value === null || value === undefined) {
			throw new Error("Expected value to be defined");
		}
	}

	async Fetch(params: eventInputParamsType) {
		const QueryBuilder = NewEventArtistQueryBuilder({ ...params }, this.db);
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
		return returnObj as eventArtistSchemaType;
	}

	async Create(
		body: CreateEventArtistSchemaTypes,
	): Promise<Array<typeof s.eventDm.$inferSelect>> {
		// infer as PutEventArtistSchemaTypes to ignore type error meanwhile getting automatic type from zod
		return this.db
			.insert(s.eventDm)
			.values(body as PutEventArtistSchemaTypes)
			.onConflictDoNothing({ target: s.eventDm.uuid })
			.returning();
	}

	async Update(
		eventArtistId: string,
		body: PutEventArtistSchemaTypes,
	): Promise<Array<typeof s.eventDm.$inferSelect>> {
		EventArtistDao.assertDefined(body);
		return this.db
			.update(s.eventDm)
			.set(body)
			.where(eq(s.eventDm.uuid, Number(eventArtistId)))
			.returning();
	}

	async FetchById(artistId: string) {
		const [data] = await this.db
			.select()
			.from(s.eventDm)
			.where(eq(s.eventDm.artistId, Number(artistId)));
		return data;
	}

	async Delete() {}
}

export function NewEventArtistDao(
	db: ReturnType<typeof initDB>,
): EventArtistDao {
	return new EventArtistDao(db);
}
