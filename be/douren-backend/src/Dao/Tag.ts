import { initDB, s } from "@pkg/database/db";

export async function fetchTag(
	db: ReturnType<typeof initDB>,
) {
	return db.select().from(s.tag);
}
