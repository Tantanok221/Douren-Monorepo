import { initDB } from "@pkg/database/db";
import { BaseDao } from "../Dao";

interface ProductArtist {
	artistId: string;
}

class ProductArtistDao implements BaseDao {
	db: ReturnType<typeof initDB>;
	constructor(
		db: ReturnType<typeof initDB>,
	) {
		this.db = db;
	}

	async Fetch(params: ProductArtist) {
		const returnObj = this.db.select();
		return returnObj;
	}
}

export function NewProductArtistDao(
	db: ReturnType<typeof initDB>,
): ProductArtistDao {
	return new ProductArtistDao(db);
}
