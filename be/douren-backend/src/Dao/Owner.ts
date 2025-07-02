import { initDB, s } from "@pkg/database/db";
import { BaseDao } from "../Dao";

class OwnerDao implements BaseDao {
	db: ReturnType<typeof initDB>;
	constructor(db: ReturnType<typeof initDB>) {
		this.db = db;
	}

	async Fetch() {
		const data = await this.db.select().from(s.owner);
		return data;
	}
}

export const NewOwnerDao = (db: ReturnType<typeof initDB>) => new OwnerDao(db);
