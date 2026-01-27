import { initDB, s } from "@pkg/database/db";
import { count, sql } from "drizzle-orm";

export async function fetchTag(db: ReturnType<typeof initDB>) {
	// Calculate tag counts from author_tag junction table
	const tagCounts = db
		.select({
			tag: s.tag.tag,
			index: s.tag.index,
			count: sql<number>`CAST(COUNT(${s.authorTag.authorId}) AS INTEGER)`.as('count')
		})
		.from(s.tag)
		.leftJoin(s.authorTag, sql`${s.authorTag.tagId} = ${s.tag.tag}`)
		.groupBy(s.tag.tag, s.tag.index)
		.orderBy(s.tag.index);
	
	return tagCounts;
}
