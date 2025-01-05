import { and, AnyColumn, asc, Column, desc, eq, ilike, isNotNull, not, SQL, SQLWrapper } from "drizzle-orm";
import { PgSelect } from "drizzle-orm/pg-core";
import { s } from "./db/index.js";

export interface ISelectDatabaseQueryBuilder<T>  {
  query: T
}

export function BuildQuery<T extends PgSelect>(query: T){
  return new SelectDatabaseQueryBuilder(query);
}

export class SelectDatabaseQueryBuilder<T extends PgSelect> implements ISelectDatabaseQueryBuilder<T>{
  query: T;
  constructor(query: T) {
    this.query = query;
  }
  withFilterEventName(eventName: string) {
    this.query = this.query.where(eq(s.event.name, eventName));
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
    this.query = this.query.where(ilike(table, "%"+search+"%"));
    return this
  }
  withTableIsNotNull(table: Column){
    this.query = this.query.where(isNotNull(table))
    return this
  }
  withTableIsNot(table:Column, value: number|string){
    this.query = this.query.where(not(eq(table, value)))
    return this
  }
  withAndFilter( filter: (SQLWrapper|undefined)[] ){
    this.query = this.query.where(and(... filter))
    return this
  }
  withFilter( filter: SQL ){
    this.query = this.query.where(filter)
    return this
  }
  Build(){
    return new SelectDatabaseQueryBuilder(this.query);
  }
}
