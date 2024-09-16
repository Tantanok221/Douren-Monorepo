import {FETCH_EVENT_ARTIST_OBJECT, PAGE_SIZE} from "../helper/constant";
import {initDB, s} from "@pkg/database/db";
import {count, eq} from "drizzle-orm";
import {BuildQuery} from "@pkg/database/helper";
import {ArtistEventParams} from "./paramHelper";

export function GetEventArtistQuery(eventId: string, search: string, page: string, params: ArtistEventParams) {
    const db = initDB();
    const query = db
        .select(FETCH_EVENT_ARTIST_OBJECT)
        .from(s.eventDm)
        .leftJoin(s.authorMain, eq(s.authorMain.uuid, s.eventDm.artistId))
        .leftJoin(s.authorTag, eq(s.authorTag.authorId, s.authorMain.uuid))
        .leftJoin(s.tag, eq(s.authorTag.tagId, s.tag.tag))
        .groupBy(
            s.eventDm.boothName,
            s.authorMain.uuid,
            s.eventDm.locationDay01,
            s.eventDm.locationDay02,
            s.eventDm.locationDay03,
            s.eventDm.dm,
        )
        .$dynamic();
    const countQuery = db
        .select({totalCount: count(s.eventDm.artistId)})
        .from(s.eventDm)
        .leftJoin(s.authorMain, eq(s.authorMain.uuid, s.eventDm.artistId))
        .$dynamic();
    const CountQuery = BuildQuery(countQuery)
        .withFilterEventId(Number(eventId))
        .Build();
    const SelectQuery = BuildQuery(query)
        .withPagination(Number(page), PAGE_SIZE)
        .withFilterEventId(Number(eventId))
        .withOrderBy(params.sortBy, params.table)
        .Build();
    if (params.tag?.length > 0) {
        SelectQuery.withAndFilter(params.tagConditions);
        CountQuery.withAndFilter(params.tagConditions);
    }
    if (search) {
        SelectQuery.withIlikeSearchByTable(search, params.searchTable);
        CountQuery.withIlikeSearchByTable(search, params.searchTable);
    }
    return {SelectQuery, CountQuery}
}