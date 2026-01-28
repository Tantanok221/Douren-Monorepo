-- Preview Tag Migration
-- This query shows what data will be migrated from the CSV tags column to the junction table

-- Preview: Show artists with their current CSV tags and what will be created
WITH tag_split AS (
    SELECT 
        am.id as author_id,
        am.author,
        am.tags as current_csv_tags,
        TRIM(tag_item) as tag_name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM tag t WHERE t.tag = TRIM(tag_item)) 
            THEN '✓ Valid'
            ELSE '✗ Tag not found in tag table'
        END as status
    FROM 
        author_main am,
        LATERAL unnest(string_to_array(am.tags, ',')) as tag_item
    WHERE 
        am.tags IS NOT NULL 
        AND am.tags != ''
        AND TRIM(tag_item) != ''
)
SELECT 
    author_id,
    author,
    current_csv_tags,
    string_agg(tag_name || ' (' || status || ')', ', ' ORDER BY tag_name) as parsed_tags
FROM tag_split
GROUP BY author_id, author, current_csv_tags
ORDER BY author_id
LIMIT 20;

-- Summary statistics
SELECT 
    'Total authors' as metric,
    COUNT(*) as count
FROM author_main
UNION ALL
SELECT 
    'Authors with tags (CSV column)',
    COUNT(*)
FROM author_main
WHERE tags IS NOT NULL AND tags != ''
UNION ALL
SELECT 
    'Existing associations in author_tag',
    COUNT(*)
FROM author_tag
UNION ALL
SELECT 
    'Distinct tags in tag table',
    COUNT(*)
FROM tag;
