import { s } from "@pkg/database/db";
import { ilike, SQLWrapper } from "drizzle-orm";

export function processTagConditions(tag?: string) {
	const tagConditions: SQLWrapper[] = [];
	if (tag && tag.length > 0) {
		for (const element of tag.split(",")) {
			tagConditions.push(ilike(s.authorMain.tags, `%${element}%`));
		}
	}
	return tagConditions;
}
