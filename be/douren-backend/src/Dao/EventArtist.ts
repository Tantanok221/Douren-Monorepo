import { eq } from "drizzle-orm";
import { z } from "zod";

import { initDB, s } from "@pkg/database/db";
import { zodSchema } from "@pkg/database/zod";
import type { eventArtistSchemaType, eventInputParamsType } from "@pkg/type";

import { BaseDao } from "../Dao";
import { createPaginationObject } from "@/helper/createPaginationObject";
import { PAGE_SIZE } from "@/helper/constant";
import { NewEventArtistQueryBuilder } from "@/QueryBuilder";
import type {
	CreateEventArtistSchemaTypes,
	PutEventArtistSchemaTypes,
} from "@/schema/event.zod";

type EventDmRow = z.infer<typeof zodSchema.eventDm.SelectSchema>;

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

	async Create(body: CreateEventArtistSchemaTypes): Promise<EventDmRow[]> {
		return this.db
			.insert(s.eventDm)
			.values(body as PutEventArtistSchemaTypes)
			.onConflictDoNothing({ target: s.eventDm.uuid })
			.returning();
	}

	async Update(
		eventArtistId: string,
		body: PutEventArtistSchemaTypes,
	): Promise<EventDmRow[]>;
	async Update(
		body: PutEventArtistSchemaTypes & { uuid: number },
	): Promise<EventDmRow[]>;
	async Update(
		eventArtistIdOrBody:
			| string
			| (PutEventArtistSchemaTypes & { uuid: number }),
		body?: PutEventArtistSchemaTypes,
	): Promise<EventDmRow[]> {
		let eventArtistId: string;
		let updateBody:
			| PutEventArtistSchemaTypes
			| (PutEventArtistSchemaTypes & { uuid: number });

		if (typeof eventArtistIdOrBody === "string") {
			if (!body) {
				throw new Error(
					"EventArtistDao.Update requires a body when called with an id",
				);
			}
			eventArtistId = eventArtistIdOrBody;
			updateBody = body;
		} else {
			eventArtistId = String(eventArtistIdOrBody.uuid);
			updateBody = eventArtistIdOrBody;
		}
		return this.db
			.update(s.eventDm)
			.set(updateBody)
			.where(eq(s.eventDm.uuid, Number(eventArtistId)))
			.returning();
	}

	async FetchById(eventArtistId: string) {
		const [data] = await this.db
			.select()
			.from(s.eventDm)
			.where(eq(s.eventDm.uuid, Number(eventArtistId)));
		return data;
	}

	async Delete() {}
}

export function NewEventArtistDao(
	db: ReturnType<typeof initDB>,
): EventArtistDao {
	return new EventArtistDao(db);
}
