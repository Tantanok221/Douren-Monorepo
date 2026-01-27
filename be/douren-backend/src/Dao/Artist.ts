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
		return returnObj as artistSchemaType;
	}
	async Create(body: CreateArtistSchemaTypes) {
		const result = await this.db
			.insert(s.authorMain)
			.values(body)
			.onConflictDoNothing({ target: s.authorMain.uuid })
			.returning();

		// Sync tags to author_tag junction table if tags were provided
		if (body.tags && result.length > 0) {
			await this.syncTagsToJunctionTable(result[0].uuid, body.tags);
		}

		return result;
	}

	async Update(
		artistId: string,
		body: zodSchemaType["authorMain"]["InsertSchema"],
	) {
		// Update artist main data
		const result = await this.db
			.update(s.authorMain)
			.set({ ...body, uuid: Number(artistId) })
			.where(eq(s.authorMain.uuid, Number(artistId)))
			.returning();

		// Sync tags to author_tag junction table if tags were provided
		if (body.tags) {
			await this.syncTagsToJunctionTable(Number(artistId), body.tags);
		}

		return result;
	}

	private async syncTagsToJunctionTable(artistId: number, tagsCSV: string) {
		// Parse CSV tags
		const tagNames = tagsCSV
			.split(",")
			.map(t => t.trim())
			.filter(t => t.length > 0);

		// Delete existing tag associations for this artist
		await this.db
			.delete(s.authorTag)
			.where(eq(s.authorTag.authorId, artistId));

		// Insert new tag associations (only for tags that exist in tag table)
		if (tagNames.length > 0) {
			const values = tagNames.map(tagName => ({
				authorId: artistId,
				tagId: tagName,
			}));

			await this.db
				.insert(s.authorTag)
				.values(values)
				.onConflictDoNothing(); // Ignore if tag doesn't exist in tag table
		}
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

	async FetchByUserId(userId: string) {
		const data = await this.db
			.select()
			.from(s.authorMain)
			.where(eq(s.authorMain.userId, userId));
		return data;
	}

	async FetchByUserIdWithPagination(userId: string, params: ArtistFetchParams) {
		const QueryBuilder = NewArtistQueryBuilder(params, this.db);
		const { SelectQuery, CountQuery } = QueryBuilder.BuildQuery();

		// Add userId filter to both queries
		SelectQuery.query = SelectQuery.query.where(
			eq(s.authorMain.userId, userId),
		);
		CountQuery.query = CountQuery.query.where(eq(s.authorMain.userId, userId));

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
		return returnObj as artistSchemaType;
	}
}

export function NewArtistDao(db: ReturnType<typeof initDB>): ArtistDao {
	return new ArtistDao(db);
}
