import { and, AnyColumn, asc, Column, desc, eq, ilike, isNotNull, not, SQL, SQLWrapper } from "drizzle-orm";
import { PgSelect } from "drizzle-orm/pg-core";
import { s } from "./db/index.js";

export interface ISelectDatabaseQueryBuilder<T>  {
  query: T
}

export function BuildQuery<T extends PgSelect>(query: T){
  return new SelectDatabaseQueryBuilder(query);
}

// Drizzle's `.where()` replaces any previous condition, so filters are
// accumulated and re-applied together as a single AND.
export class SelectDatabaseQueryBuilder<T extends PgSelect> implements ISelectDatabaseQueryBuilder<T>{
  query: T;
  private conditions: SQL[];
  constructor(query: T, conditions: SQL[] = []) {
    this.query = query;
    this.conditions = conditions;
  }
  private withCondition(condition: SQL | undefined) {
    if (!condition) return this;
    this.conditions.push(condition);
    this.query = this.query.where(and(...this.conditions));
    return this
  }
  withFilterEventName(eventName: string) {
    return this.withCondition(eq(s.event.name, eventName));
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
    return this.withCondition(ilike(table, "%"+search+"%"));
  }
  withTableIsNotNull(table: Column){
    return this.withCondition(isNotNull(table));
  }
  withTableIsNot(table:Column, value: number|string){
    return this.withCondition(not(eq(table, value)));
  }
  withAndFilter( filter: (SQLWrapper|undefined)[] ){
    return this.withCondition(and(... filter));
  }
  withFilter( filter: SQL ){
    return this.withCondition(filter);
  }
  Build(){
    return new SelectDatabaseQueryBuilder(this.query, [...this.conditions]);
  }
}
