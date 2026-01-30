import { initDB, s } from "@pkg/database/db";
import { eq, sql } from "drizzle-orm";

export async function fetchTag(db: ReturnType<typeof initDB>) {
	// Calculate tag counts from author_tag junction table
	const tagCounts = db
		.select({
			tag: s.tag.tag,
			index: s.tag.index,
			count: sql<number>`CAST(COUNT(${s.authorTag.authorId}) AS INTEGER)`.as(
				"count",
			),
		})
		.from(s.tag)
		.leftJoin(s.authorTag, sql`${s.authorTag.tagId} = ${s.tag.tag}`)
		.groupBy(s.tag.tag, s.tag.index)
		.orderBy(s.tag.index);

	return tagCounts;
}

export async function createTag(db: ReturnType<typeof initDB>, tagName: string) {
	const [row] = await db
		.select({
			maxIndex: sql<number | null>`MAX(${s.tag.index})`.as("maxIndex"),
		})
		.from(s.tag);
	const nextIndex = (row?.maxIndex ?? 0) + 1;

	return db
		.insert(s.tag)
		.values({ tag: tagName, count: 0, index: nextIndex })
		.returning();
}

export async function renameTag(
	db: ReturnType<typeof initDB>,
	currentTag: string,
	nextTag: string,
) {
	const [existing] = await db
		.select()
		.from(s.tag)
		.where(eq(s.tag.tag, currentTag));

	if (!existing) return null;

	const [conflict] = await db
		.select()
		.from(s.tag)
		.where(eq(s.tag.tag, nextTag));

	if (conflict) {
		throw new Error("Tag already exists");
	}

	const inserted = await db
		.insert(s.tag)
		.values({
			tag: nextTag,
			count: existing.count ?? 0,
			index: existing.index,
		})
		.returning();

	await db
		.update(s.authorTag)
		.set({ tagId: nextTag })
		.where(eq(s.authorTag.tagId, currentTag));

	await db.delete(s.tag).where(eq(s.tag.tag, currentTag));

	return inserted;
}
