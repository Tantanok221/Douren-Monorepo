import { initDB } from "@pkg/database/db";

export interface BaseDao {
	db: ReturnType<typeof initDB>;
}
