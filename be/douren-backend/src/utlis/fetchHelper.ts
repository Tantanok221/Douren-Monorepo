import {cacheJsonResults, initRedis} from "@pkg/redis/redis";
import {processArtistEventParams} from "./paramHelper";
import {GetArtistQuery, GetEventArtistQuery} from "./queryHelper";
import {createPaginationObject} from "../helper/createPaginationObject";
import {PAGE_SIZE} from "../helper/constant";
import {artistSchemaType, eventArtistSchemaType} from "@pkg/type";


export async function ArtistFetchFunction(page: string, search: string, sort: string, searchtable:string, tag: string){
    const redis = initRedis();
    const ArtistParam = processArtistEventParams(sort, searchtable, tag)
    const redisKey = `get_artist_${page}_${search}_${tag}_${sort}_${searchtable}`;
    const redisData = await redis.json.get(redisKey, {}, "$");
    if (redisData) {
        console.log("redis cache hit");
        return redisData as artistSchemaType;
    }
    const { SelectQuery,CountQuery} = GetArtistQuery(search,page,ArtistParam)
    // TODO: Need to change front end to use, to split
    const [data, [counts]] = await Promise.all([
        SelectQuery.query,
        CountQuery.query,
    ]);
    const returnObj = createPaginationObject(
        data,
        Number(page),
        PAGE_SIZE,
        counts.totalCount
    ) as object;
    console.log("Setting redis cache");
    await cacheJsonResults(redis, redisKey, returnObj);
    return returnObj as artistSchemaType
}

export async function EventArtistFetchFunction(page:string,search:string,sort:string,searchtable:string,tag:string,eventId:string){
    const redis = initRedis();
    const redisKey = `get_eventArtist${eventId}_${page}_${search}_${tag}_${sort}_${searchtable}`;
    const redisData = await redis.json.get(redisKey, {}, "$");
    if (redisData) {
        console.log("redis cache hit");
        return redisData as eventArtistSchemaType;
    }
    const artistEventParams = processArtistEventParams(sort, searchtable, tag)
    const {SelectQuery, CountQuery} = GetEventArtistQuery(eventId, search, page, artistEventParams)
    // TODO: Need to change front end to use(,) to split
    const data = await SelectQuery.query;
    const [counts] = await CountQuery.query;
    const returnObj = createPaginationObject(
        data,
        Number(page),
        PAGE_SIZE,
        counts.totalCount,
    ) as {};
    console.log("Setting redis cache");
    await cacheJsonResults(redis, redisKey, returnObj);
    return returnObj as eventArtistSchemaType
}