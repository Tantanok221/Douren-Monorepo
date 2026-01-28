# Tag Migration Guide

This directory contains scripts to migrate tag data from the CSV `tags` column in `author_main` table to the proper `author_tag` junction table.

## Background

Previously, tags were stored as CSV text in the `author_main.tags` column (e.g., `"二創,原創,插畫"`). The application now uses a proper many-to-many relationship through the `author_tag` junction table for better querying and filtering.

## Files

- **`migrate-tags-to-junction-table.sql`** - Main migration SQL script
- **`preview-tag-migration.sql`** - Preview what the migration will do (safe to run)
- **`run-tag-migration.sh`** - Shell script wrapper for easy execution
- **`TAG_MIGRATION_README.md`** - This file

## Migration Steps

### Step 1: Preview the Migration (Recommended)

Before running the actual migration, preview what will happen:

```bash
# Using Infisical
npm run dev:db < scripts/preview-tag-migration.sql

# Or directly with psql
psql $DATABASE_URL -f scripts/preview-tag-migration.sql
```

This will show:
- Sample artists with their current CSV tags
- Which tags will be migrated
- Warning if any tags in the CSV don't exist in the `tag` table
- Summary statistics

### Step 2: Run the Migration

**Option A: Using the shell script (Recommended)**

```bash
./scripts/run-tag-migration.sh
```

**Option B: Run SQL directly**

```bash
# Using Infisical
npm run dev:db < scripts/migrate-tags-to-junction-table.sql

# Or directly with psql
psql $DATABASE_URL -f scripts/migrate-tags-to-junction-table.sql
```

### Step 3: Verify the Migration

After migration, verify that tags are displaying correctly:

1. **Check the database:**
   ```sql
   SELECT COUNT(*) FROM author_tag;
   
   -- Sample check
   SELECT 
       am.author,
       array_agg(at.tag_name ORDER BY at.tag_name) as tags
   FROM author_main am
   JOIN author_tag at ON am.id = at.author_id
   GROUP BY am.author
   LIMIT 10;
   ```

2. **Test the application:**
   - Start the dev server: `npm run dev`
   - Visit the CMS and check if artist cards show tags
   - Test the tag filter functionality

3. **Test the API endpoint:**
   ```bash
   curl "http://localhost:2000/trpc/artist.getArtist?input=%7B%22search%22%3A%22%22%2C%22searchTable%22%3A%22Author_Main.Author%22%2C%22page%22%3A%221%22%2C%22sort%22%3A%22Author_Main(Author)%2Casc%22%7D"
   ```

## How the Migration Works

The SQL script:

1. **Splits CSV tags**: Uses PostgreSQL's `string_to_array()` and `LATERAL unnest()` to split comma-separated tags
2. **Trims whitespace**: Ensures clean tag names with `TRIM()`
3. **Validates tags**: Only inserts tags that exist in the `tag` table
4. **Handles duplicates**: Uses `ON CONFLICT DO NOTHING` to prevent duplicate entries
5. **Reports statistics**: Shows how many artists and associations were migrated

## Important Notes

### Before Migration
- ✅ Backup your database
- ✅ Run the preview script to see what will be migrated
- ✅ Ensure all tags in CSV format exist in the `tag` table

### After Migration
- ✅ Keep the `tags` column for now as a backup
- ✅ Verify the application works correctly
- ⚠️ Once confirmed working, you can optionally drop the `tags` column in a future migration

### Troubleshooting

**Problem: Tags not appearing after migration**
- Check if tags exist in the `tag` table: `SELECT * FROM tag;`
- Verify `author_tag` has data: `SELECT COUNT(*) FROM author_tag;`
- Restart the backend server to pick up new data

**Problem: Some tags weren't migrated**
- Run the preview script to see which tags failed validation
- These tags don't exist in the `tag` table
- Add missing tags to the `tag` table, then re-run the migration

**Problem: Duplicate entries**
- The migration uses `ON CONFLICT DO NOTHING`, so duplicates are automatically skipped
- If you need to re-run, you can truncate `author_tag` first (see comment in SQL file)

## Example Data Flow

**Before Migration:**
```
author_main table:
id  | author | tags
----|--------|------------------
100 | Alice  | "二創,原創"
101 | Bob    | "插畫,二創"
```

**After Migration:**
```
author_tag table:
author_id | tag_name
----------|----------
100       | 二創
100       | 原創
101       | 插畫
101       | 二創
```

## Rollback

If you need to rollback the migration:

```sql
TRUNCATE TABLE author_tag;
```

The original CSV data in `author_main.tags` remains untouched.
