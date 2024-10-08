import {processTableName} from "../helper/processTableName";
import {AnyColumn, asc, desc, SQLWrapper} from "drizzle-orm";
import {processTagConditions} from "../helper/processTagConditions";

export function processArtistEventParams(sort: string, searchtable:string,tag?:string): ArtistEventParams{
    const table = processTableName(sort.split(",")[0]);
    const sortBy = sort.split(",")[1] === "asc" ? asc : desc;
    const searchTable = processTableName(searchtable);
    const tagConditions = processTagConditions(tag);
    return {
        table,
        sortBy,
        searchTable,
        tagConditions,
        tag
    }
}

export interface ArtistEventParams{
    table: AnyColumn | SQLWrapper,
    sortBy: typeof asc | typeof desc,
    searchTable: AnyColumn
    tagConditions:  SQLWrapper[]
    tag?: string
}