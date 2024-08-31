import { and, AnyColumn, asc, Column, desc, eq, ilike, SQLWrapper } from "drizzle-orm";
import { PgSelect } from "drizzle-orm/pg-core";
import { s } from "./db/index.js";

export function BuildQuery<T extends PgSelect>(query: T){
  return new SelectDatabaseQueryBuilder(query);
}

class SelectDatabaseQueryBuilder<T extends PgSelect> {
  query: T;
  constructor(query: T) {
    this.query = query;
  }
  withFilterEventId(eventId: number) {
    this.query = this.query.where(eq(s.eventDm.eventId, eventId));
    return this
  }
  withOrderBy(sortBy: typeof asc | typeof desc, table: AnyColumn | SQLWrapper) {
    this.query = this.query.orderBy(sortBy(table));
    return this
  }
  withPagination(page: number, size: number ) {
    this.query = this.query.limit(size).offset((page - 1) * size);
    return this
  }
  withIlikeSearchByTable(search: string, table: Column) {
    this.query = this.query.where(and(ilike(table, search)));
    return this
  }
  Build(){
    return new SelectDatabaseQueryBuilder(this.query);
  }
}
