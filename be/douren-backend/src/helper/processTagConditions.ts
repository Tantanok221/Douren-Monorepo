import { s } from "@pkg/database/db";
import { eq, inArray, SQLWrapper } from "drizzle-orm";

export function processTagConditions(tag?: string) {
	const tagConditions: SQLWrapper[] = [];
	if (tag && tag.length > 0) {
		const tags = tag.split(",").map(t => t.trim()).filter(t => t.length > 0);
		for (const element of tags) {
			// Filter using the author_tag junction table
			tagConditions.push(eq(s.tag.tag, element));
		}
	}
	return tagConditions;
}
