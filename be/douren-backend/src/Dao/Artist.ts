import { initDB, s } from "@pkg/database/db";
import { ArtistFetchParams } from "@/utlis/fetchHelper";
import { BaseDao } from "../Dao";
import { CreateArtistSchemaTypes } from "@/schema/artist.zod";
import { artistSchemaType } from "@pkg/type";
import { createPaginationObject } from "@/helper/createPaginationObject";
import { PAGE_SIZE } from "@/helper/constant";
import { NewArtistQueryBuilder } from "@/QueryBuilder";
import { desc, eq } from "drizzle-orm";
import { zodSchemaType } from "@pkg/database/zod";

class ArtistDao implements BaseDao {
	db: ReturnType<typeof initDB>;
	constructor(db: ReturnType<typeof initDB>) {
		this.db = db;
	}

	async Fetch(params: ArtistFetchParams) {
		const QueryBuilder = NewArtistQueryBuilder(params, this.db);
		const { SelectQuery, CountQuery } = QueryBuilder.BuildQuery();
		const [data, [counts]] = await Promise.all([
			SelectQuery.query,
			CountQuery.query,
		]);
		const returnObj = createPaginationObject(
			data,
			Number(params.page),
			PAGE_SIZE,
			counts.totalCount,
		) as object;
		console.log("Setting redis cache");
		return returnObj as artistSchemaType;
	}
	async Create(body: CreateArtistSchemaTypes) {
		const [counts] = await this.db
			.select({ count: s.authorMain.uuid })
			.from(s.authorMain)
			.orderBy(desc(s.authorMain.uuid))
			.limit(1);
		if (!body.uuid) {
			body.uuid = counts.count + 1;
		}
		return await this.db
			.insert(s.authorMain)
			.values(body)
			.onConflictDoNothing({ target: s.authorMain.uuid })
			.returning();
	}

	async Update(
		artistId: string,
		body: zodSchemaType["authorMain"]["InsertSchema"],
	) {
		body.uuid = Number(artistId);
		return await this.db
			.update(s.authorMain)
			.set(body)
			.where(eq(s.authorMain.uuid, Number(artistId)))
			.returning();
	}

	async Delete(artistId: string) {
		return await this.db
			.delete(s.authorMain)
			.where(eq(s.authorMain.uuid, Number(artistId)))
			.returning();
	}
}

export function NewArtistDao(db: ReturnType<typeof initDB>): ArtistDao {
	return new ArtistDao(db);
}
