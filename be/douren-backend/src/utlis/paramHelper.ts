import {processTableName} from "../helper/processTableName";
import {AnyColumn, asc, desc, SQLWrapper} from "drizzle-orm";
import {processTagConditions} from "../helper/processTagConditions";


export interface DerivedFetchParams {
    table: AnyColumn | SQLWrapper,
    sortBy: typeof asc | typeof desc,
    searchTable: AnyColumn
    tagConditions:  SQLWrapper[]
}