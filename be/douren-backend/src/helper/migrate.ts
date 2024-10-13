import { sql } from "drizzle-orm"; // Adjust the import path as needed
import { initDB, s } from "@pkg/database/db";

export async function syncAuthorTag(db: ReturnType<typeof initDB>) {
	// Step 1: Populate the tag table with unique tags
	await db.execute(sql`
    INSERT INTO ${s.tag} (tag, count, index)
    SELECT DISTINCT
      TRIM(unnest(string_to_array(REPLACE(${s.authorMain.tags}, ', ', ','), ','))) AS tag,
      0 AS count,
      ROW_NUMBER() OVER () AS index
    FROM ${s.authorMain}
    WHERE ${s.authorMain.tags} IS NOT NULL AND ${s.authorMain.tags} != ''
    ON CONFLICT (tag) DO NOTHING;
  `);

	// Step 2: Update the count in the tag table
	await db.execute(sql`
    UPDATE ${s.tag}
    SET count = COALESCE(subquery.tag_count, 0)
    FROM (
      SELECT TRIM(unnest(string_to_array(REPLACE(${s.authorMain.tags}, ', ', ','), ','))) AS tag, COUNT(*) AS tag_count
      FROM ${s.authorMain}
      WHERE ${s.authorMain.tags} IS NOT NULL AND ${s.authorMain.tags} != ''
      GROUP BY TRIM(unnest(string_to_array(REPLACE(${s.authorMain.tags}, ', ', ','), ',')))
    ) AS subquery
    WHERE ${s.tag.tag} = subquery.tag;
  `);

	// Step 3: Populate the author_tag junction table
	await db.execute(sql`
    INSERT INTO ${s.authorTag} (author_id, tag_name)
    SELECT ${s.authorMain.uuid}, TRIM(unnest(string_to_array(REPLACE(${s.authorMain.tags}, ', ', ','), ','))) AS tag_name
    FROM ${s.authorMain}
    WHERE ${s.authorMain.tags} IS NOT NULL AND ${s.authorMain.tags} != ''
    ON CONFLICT DO NOTHING;
  `);

	// Step 4: Remove tags with count 0
	await db.execute(sql`
    DELETE FROM ${s.tag}
    WHERE count = 0;
  `);

	// Step 5: Reindex the remaining tags
	await db.execute(sql`
    WITH indexed_tags AS (
      SELECT tag, ROW_NUMBER() OVER (ORDER BY count DESC, tag) AS new_index
      FROM ${s.tag}
    )
    UPDATE ${s.tag}
    SET index = indexed_tags.new_index
    FROM indexed_tags
    WHERE ${s.tag.tag} = indexed_tags.tag;
  `);

	// Step 6: Clean up orphaned entries in author_tag
	await db.execute(sql`
    DELETE FROM ${s.authorTag}
    WHERE tag_name NOT IN (SELECT tag FROM ${s.tag});
  `);

	// Step 7: Update s.authorMain.tags to ensure consistent formatting without spaces after commas
	await db.execute(sql`
    UPDATE ${s.authorMain}
    SET tags = (
      SELECT string_agg(TRIM(tag), ',')
      FROM unnest(string_to_array(REPLACE(${s.authorMain.tags}, ', ', ','), ',')) AS tag
    )
    WHERE ${s.authorMain.tags} IS NOT NULL AND ${s.authorMain.tags} != '';
  `);
}

export async function down(db: ReturnType<typeof initDB>) {
	// Clear the author_tag junction table
	await db.execute(sql`TRUNCATE TABLE ${s.authorTag};`);

	// Clear the tag table
	await db.execute(sql`TRUNCATE TABLE ${s.tag};`);
}
