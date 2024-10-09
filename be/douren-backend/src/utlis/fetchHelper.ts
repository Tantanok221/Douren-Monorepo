import {cacheJsonResults, initRedis} from "@pkg/redis/redis";
import {createPaginationObject} from "../helper/createPaginationObject";
import {PAGE_SIZE} from "../helper/constant";
import {artistSchemaType, eventArtistSchemaType} from "@pkg/type";

export interface ArtistFetchParams {
    searchTable: string
    page: string
    search ?: string
    sort : string
    tag ?: string
}

export interface EventArtistFetchParams extends ArtistFetchParams {
    eventId: string
}


// export async function EventArtistFetchFunction({page,search,searchTable,sort,tag,eventId}: EventArtistFetchParams){
//     const redis = initRedis();
//     const redisKey = `get_eventArtist${eventId}_${page}_${search}_${tag}_${sort}_${searchTable}`;
//     console.log(redisKey)
//     const redisData: eventArtistSchemaType[] |null = await redis.json.get(redisKey, {}, "$");
//     if (redisData && redisData?.length > 0) {
//         console.log("redis cache hit");
//         return redisData[0]
//     }
//     const artistEventParams = processArtistEventParams(sort, searchTable, tag)
//     const {SelectQuery, CountQuery} = GetEventArtistQuery(eventId, search, page, artistEventParams)
//     const data = await SelectQuery.query;
//     const [counts] = await CountQuery.query;
//     const returnObj = createPaginationObject(
//         data,
//         Number(page),
//         PAGE_SIZE,
//         counts.totalCount,
//     ) as {};
//     console.log("Setting redis cache");
//     await cacheJsonResults(redis, redisKey, returnObj);
//     return returnObj as eventArtistSchemaType
// }