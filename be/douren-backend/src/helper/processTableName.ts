import { s } from "@pkg/database/db";

export function processTableName(table: string) {
  // sort = "table_name,asc"
  // The front is the table name and then the sort order
  if (table === "Author_Main(Author)" || table === "Author_Main.Author") {
    return s.authorMain.author;
  }
  if (table === "Booth_name") {
    return s.eventDm.boothName;
  }
  if (table === "Location_Day01") {
    return s.eventDm.locationDay01;
  }
  if (table === "Location_Day02") {
    return s.eventDm.locationDay02;
  } else {
    return s.eventDm.locationDay03;
  }
}
