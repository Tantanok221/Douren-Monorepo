import { AnyColumn, asc, desc, SQLWrapper } from "drizzle-orm";

export interface DerivedFetchParams {
	table: AnyColumn | SQLWrapper;
	sortBy: typeof asc | typeof desc;
	searchTable: AnyColumn;
	tagConditions: SQLWrapper[];
}
