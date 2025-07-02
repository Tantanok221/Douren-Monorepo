import { initDB, s } from "@pkg/database/db";
import { ArtistFetchParams } from "@/utlis/fetchHelper";
import { BaseDao } from "../Dao";
import { CreateArtistSchemaTypes } from "@/schema/artist.zod";
import { artistSchemaType } from "@pkg/type";
import { createPaginationObject } from "@/helper/createPaginationObject";
import { PAGE_SIZE } from "@/helper/constant";
import { NewArtistQueryBuilder } from "@/QueryBuilder";
import { eq } from "drizzle-orm";
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
		const data = await this.db
			.insert(s.authorMain)
			.values(body)
			.onConflictDoNothing({ target: s.authorMain.uuid })
			.returning();
		return data;
	}

	async Update(
		artistId: string,
		body: zodSchemaType["authorMain"]["InsertSchema"],
	) {
		return await this.db
			.update(s.authorMain)
			.set(body)
			.where(eq(s.authorMain.uuid, Number(artistId)))
			.returning();
	}

	async FetchById(artistId: string) {
		const [data] = await this.db
			.select()
			.from(s.authorMain)
			.where(eq(s.authorMain.uuid, Number(artistId)));
		return data;
	}

	async FetchArtistPageDetails(artistId: string) {
		const data = await this.db.query.authorMain.findFirst({
			where: eq(s.authorMain.uuid, Number(artistId)),
			with: {
				products: {
					columns: {
						title: true,
						thumbnail: true,
						preview: true,
					},
				},
				events: {
					columns: {
						dm: true,
						boothName: true,
						locationDay01: true,
						locationDay02: true,
						locationDay03: true,
					},
					with: {
						event: {
							columns: {
								name: true,
							},
						},
					},
				},
			},
		});
		return data;
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
