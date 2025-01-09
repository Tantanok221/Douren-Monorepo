import { initDB, s } from "@pkg/database/db";
import { BaseDao } from "../Dao";
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
	constructor(db: ReturnType<typeof initDB>) {
		this.db = db;
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

export function NewEventArtistDao(
	db: ReturnType<typeof initDB>,
): EventArtistDao {
	return new EventArtistDao(db);
}
