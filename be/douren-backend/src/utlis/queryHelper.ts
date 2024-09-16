import {FETCH_EVENT_ARTIST_OBJECT, PAGE_SIZE} from "../helper/constant";
import {initDB, s} from "@pkg/database/db";
import {AnyColumn, asc, count, desc, eq, SQLWrapper} from "drizzle-orm";
import {BuildQuery} from "@pkg/database/helper";

export function GetEventArtistQuery(eventId:string,page:string,sortBy: typeof asc|typeof desc,table:AnyColumn | SQLWrapper){
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
        .select({ totalCount: count(s.eventDm.artistId) })
        .from(s.eventDm)
        .leftJoin(s.authorMain, eq(s.authorMain.uuid, s.eventDm.artistId))
        .$dynamic();
    const CountQuery = BuildQuery(countQuery)
        .withFilterEventId(Number(eventId))
        .Build();
    const SelectQuery = BuildQuery(query)
        .withPagination(Number(page), PAGE_SIZE)
        .withFilterEventId(Number(eventId))
        .withOrderBy(sortBy, table)
        .Build();
    return {SelectQuery,CountQuery}
}