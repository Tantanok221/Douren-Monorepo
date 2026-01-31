-- Migration Script: Populate author_tag table from author_main.tags CSV column
-- This script splits the CSV tags in author_main.tags and creates entries in author_tag

-- Step 1: Clear existing data in author_tag (if any)
-- Uncomment the line below if you want to start fresh
-- TRUNCATE TABLE author_tag;

-- Step 2: Insert tag associations from CSV column to junction table
INSERT INTO author_tag (author_id, tag_name)
SELECT DISTINCT
    am.id as author_id,
    TRIM(tag_item) as tag_name
FROM 
    author_main am,
    -- Split the CSV tags column by comma
    LATERAL unnest(string_to_array(am.tags, ',')) as tag_item
WHERE 
    am.tags IS NOT NULL 
    AND am.tags != ''
    AND TRIM(tag_item) != ''
    -- Only insert if the tag exists in the tag table
    AND EXISTS (
        SELECT 1 FROM tag t WHERE t.tag = TRIM(tag_item)
    )
ON CONFLICT (author_id, tag_name) DO NOTHING;

-- Step 3: Report statistics
DO $$
DECLARE
    total_authors INTEGER;
    authors_with_tags INTEGER;
    total_associations INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_authors FROM author_main;
    SELECT COUNT(DISTINCT author_id) INTO authors_with_tags FROM author_tag;
    SELECT COUNT(*) INTO total_associations FROM author_tag;
    
    RAISE NOTICE 'Migration Statistics:';
    RAISE NOTICE '  Total authors: %', total_authors;
    RAISE NOTICE '  Authors with tags: %', authors_with_tags;
    RAISE NOTICE '  Total tag associations: %', total_associations;
END $$;

-- Step 4 (Optional): Verify the migration
-- Uncomment to see sample data
/*
SELECT 
    am.id,
    am.author,
    am.tags as old_tags_csv,
    array_agg(at.tag_name ORDER BY at.tag_name) as new_tags_array
FROM author_main am
LEFT JOIN author_tag at ON am.id = at.author_id
WHERE am.tags IS NOT NULL AND am.tags != ''
GROUP BY am.id, am.author, am.tags
LIMIT 10;
*/
