import { sql } from 'drizzle-orm'; // Adjust the import path as needed
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { authorMain, authorTag, tag } from './schema.js';
import { initDB } from './initdb.js';

export async function up(db: ReturnType<typeof initDB>) {
  // Step 1: Populate the tag table with unique tags
  await db.execute(sql`
    INSERT INTO ${tag} (tag, count, index)
    SELECT DISTINCT
      unnest(string_to_array(${authorMain.tags}, ',')) AS tag,
      0 AS count,
      ROW_NUMBER() OVER () AS index
    FROM ${authorMain}
    WHERE ${authorMain.tags} IS NOT NULL AND ${authorMain.tags} != ''
    ON CONFLICT (tag) DO NOTHING;
  `);

  // Step 2: Update the count in the tag table
  await db.execute(sql`
    UPDATE ${tag}
    SET count = subquery.tag_count
    FROM (
      SELECT unnest(string_to_array(${authorMain.tags}, ',')) AS tag, COUNT(*) AS tag_count
      FROM ${authorMain}
      WHERE ${authorMain.tags} IS NOT NULL AND ${authorMain.tags} != ''
      GROUP BY tag
    ) AS subquery
    WHERE ${tag.tag} = subquery.tag;
  `);

  // Step 3: Populate the author_tag junction table
  await db.execute(sql`
    INSERT INTO ${authorTag} (author_id, tag_name)
    SELECT ${authorMain.uuid}, unnest(string_to_array(${authorMain.tags}, ',')) AS tag_name
    FROM ${authorMain}
    WHERE ${authorMain.tags} IS NOT NULL AND ${authorMain.tags} != ''
    ON CONFLICT DO NOTHING;
  `);
}

export async function down(db:PostgresJsDatabase) {
  // Clear the author_tag junction table
  await db.execute(sql`TRUNCATE TABLE ${authorTag};`);

  // Clear the tag table
  await db.execute(sql`TRUNCATE TABLE ${tag};`);
}