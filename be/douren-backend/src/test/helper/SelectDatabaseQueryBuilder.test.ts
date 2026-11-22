import { describe, expect, it } from "vitest";
import { inArray, eq, ilike } from "drizzle-orm";
import { initDB, s } from "@pkg/database/db";
import { BuildQuery } from "@pkg/database/helper";

const db = initDB("postgres://user:password@localhost:5432/douren");

const baseQuery = () =>
	db
		.select({ id: s.eventDm.uuid })
		.from(s.eventDm)
		.leftJoin(s.event, eq(s.eventDm.eventId, s.event.id))
		.$dynamic();

describe("SelectDatabaseQueryBuilder", () => {
	it("keeps the event filter when more filters are added", () => {
		const { sql, params } = BuildQuery(baseQuery())
			.withFilterEventName("FF45")
			.Build()
			.withFilter(inArray(s.eventDm.artistId, [1, 2]))
			.withIlikeSearchByTable("Hoshi", s.eventDm.boothName).query.toSQL();

		expect(sql).toContain('"event"."name" = $1');
		expect(sql).toContain('"event_dm"."artist_id" in ($2, $3)');
		expect(sql).toContain('"event_dm"."booth_name" ilike $4');
		expect(params).toEqual(["FF45", 1, 2, "%Hoshi%"]);
	});

	it("does not share conditions between built queries", () => {
		const builder = BuildQuery(baseQuery()).withFilterEventName("FF45");
		const built = builder.Build();
		built.withFilter(ilike(s.eventDm.boothName, "%A%"));
		builder.withFilter(inArray(s.eventDm.artistId, [3]));

		const { params } = builder.query.toSQL();
		expect(params).toEqual(["FF45", 3]);
	});
});
