import { s } from "@pkg/database/db";

// Mapping of table name strings to database columns
const TABLE_NAME_MAP: Record<string, ReturnType<typeof s.authorMain.author>> = {
	"Author_Main(Author)": s.authorMain.author,
	"Author_Main.Author": s.authorMain.author,
	Booth_name: s.eventDm.boothName,
	Location_Day01: s.eventDm.locationDay01,
	Location_Day02: s.eventDm.locationDay02,
	Location_Day03: s.eventDm.locationDay03,
};

export function processTableName(table: string) {
	// sort = "table_name,asc"
	// The front is the table name and then the sort order
	return TABLE_NAME_MAP[table] ?? s.authorMain.author;
}
