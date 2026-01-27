import { initDB, s } from "@pkg/database/db";
import { asc, count, countDistinct, desc, eq } from "drizzle-orm";
import { BuildQuery } from "@pkg/database/helper";
import { FETCH_ARTIST_OBJECT, FETCH_EVENT_ARTIST_OBJECT } from "@pkg/type";
import { PAGE_SIZE } from "@/helper/constant";
import { processTableName } from "@/helper/processTableName";
import { processTagConditions } from "@/helper/processTagConditions";
import { ArtistFetchParams, EventArtistFetchParams } from "@/utlis/fetchHelper";
import { DerivedFetchParams } from "@/utlis/paramHelper";

abstract class IQueryBuilder<T extends ArtistFetchParams> {
	public fetchParams: T;
	public derivedFetchParams: DerivedFetchParams;
	public db: ReturnType<typeof initDB>;

	abstract BuildQuery(): { SelectQuery: unknown; CountQuery: unknown };

	constructor(params: T, db: ReturnType<typeof initDB>) {
		const table = processTableName(params.sort.split(",")[0]);
		const sortBy = params.sort.split(",")[1] === "asc" ? asc : desc;
		const searchTable = processTableName(params.searchTable);
		const tagConditions = processTagConditions(params.tag);
		this.derivedFetchParams = {
			table,
			sortBy,
			searchTable,
			tagConditions,
		};
		this.fetchParams = params;
		this.db = db;
	}
}

class ArtistQueryBuilder extends IQueryBuilder<ArtistFetchParams> {
	BuildQuery() {
		const query = this.db
			.select(FETCH_ARTIST_OBJECT)
			.from(s.authorMain)
			.leftJoin(s.authorTag, eq(s.authorTag.authorId, s.authorMain.uuid))
			.leftJoin(s.tag, eq(s.authorTag.tagId, s.tag.tag))
			.groupBy(s.authorMain.uuid)
			.$dynamic();
		const countQuery = this.db
			.select({ totalCount: countDistinct(s.authorMain.uuid) })
			.from(s.authorMain)
			.leftJoin(s.authorTag, eq(s.authorTag.authorId, s.authorMain.uuid))
			.leftJoin(s.tag, eq(s.authorTag.tagId, s.tag.tag))
			.$dynamic();
		const CountQuery = BuildQuery(countQuery).withTableIsNot(
			s.authorMain.author,
			"",
		);
		const SelectQuery = BuildQuery(query)
			.withOrderBy(
				this.derivedFetchParams.sortBy,
				this.derivedFetchParams.table,
			)
			.withPagination(Number(this.fetchParams.page), PAGE_SIZE)
			.withTableIsNot(s.authorMain.author, "")
			.Build();
		if (this.fetchParams.tag) {
			SelectQuery.withAndFilter(this.derivedFetchParams.tagConditions);
			CountQuery.withAndFilter(this.derivedFetchParams.tagConditions);
		}
		if (this.fetchParams.search) {
			SelectQuery.withIlikeSearchByTable(
				this.fetchParams.search,
				this.derivedFetchParams.searchTable,
			);
			CountQuery.withIlikeSearchByTable(
				this.fetchParams.search,
				this.derivedFetchParams.searchTable,
			);
		}
		return {
			SelectQuery,
			CountQuery,
		};
	}
}

class EventArtistQueryBuilder extends IQueryBuilder<EventArtistFetchParams> {
	BuildQuery() {
		const query = this.db
			.select(FETCH_EVENT_ARTIST_OBJECT)
			.from(s.eventDm)
			.leftJoin(s.authorMain, eq(s.authorMain.uuid, s.eventDm.artistId))
			.leftJoin(s.authorTag, eq(s.authorTag.authorId, s.authorMain.uuid))
			.leftJoin(s.tag, eq(s.authorTag.tagId, s.tag.tag))
			.leftJoin(s.event, eq(s.eventDm.eventId, s.event.id))
			.groupBy(
				s.eventDm.boothName,
				s.authorMain.uuid,
				s.eventDm.locationDay01,
				s.eventDm.locationDay02,
				s.eventDm.locationDay03,
				s.eventDm.dm,
			)
			.$dynamic();
		const countQuery = this.db
			.select({ totalCount: countDistinct(s.eventDm.artistId) })
			.from(s.eventDm)
			.leftJoin(s.event, eq(s.eventDm.eventId, s.event.id))
			.leftJoin(s.authorMain, eq(s.authorMain.uuid, s.eventDm.artistId))
			.leftJoin(s.authorTag, eq(s.authorTag.authorId, s.authorMain.uuid))
			.leftJoin(s.tag, eq(s.authorTag.tagId, s.tag.tag))
			.$dynamic();
		const CountQuery = BuildQuery(countQuery)
			.withFilterEventName(this.fetchParams.eventName)
			.Build();
		const SelectQuery = BuildQuery(query)
			.withPagination(Number(this.fetchParams.page), PAGE_SIZE)
			.withFilterEventName(this.fetchParams.eventName)
			.withOrderBy(
				this.derivedFetchParams.sortBy,
				this.derivedFetchParams.table,
			)
			.Build();
		if (this.fetchParams.tag) {
			SelectQuery.withAndFilter(this.derivedFetchParams.tagConditions);
			CountQuery.withAndFilter(this.derivedFetchParams.tagConditions);
		}
		if (this.fetchParams.search) {
			SelectQuery.withIlikeSearchByTable(
				this.fetchParams.search,
				this.derivedFetchParams.searchTable,
			);
			CountQuery.withIlikeSearchByTable(
				this.fetchParams.search,
				this.derivedFetchParams.searchTable,
			);
		}
		return { SelectQuery, CountQuery };
	}
}

export function NewArtistQueryBuilder(
	params: ArtistFetchParams,
	db: ReturnType<typeof initDB>,
): ArtistQueryBuilder {
	return new ArtistQueryBuilder(params, db);
}

export function NewEventArtistQueryBuilder(
	params: EventArtistFetchParams,
	db: ReturnType<typeof initDB>,
) {
	return new EventArtistQueryBuilder(params, db);
}
