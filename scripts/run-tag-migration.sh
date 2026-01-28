#!/bin/bash

# Script to run the tag migration from CSV column to junction table
# Usage: ./scripts/run-tag-migration.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_FILE="$SCRIPT_DIR/migrate-tags-to-junction-table.sql"

echo "🚀 Starting tag migration..."
echo ""

# Check if Infisical is available and DATABASE_URL is set
if command -v infisical &> /dev/null; then
    echo "📦 Using Infisical to get database credentials..."
    
    # Run the SQL file with Infisical
    infisical run --env=dev -- psql "$LOCAL_DATABASE_URL" -f "$SQL_FILE"
else
    echo "⚠️  Infisical not found. Make sure DATABASE_URL environment variable is set."
    
    # Check if DATABASE_URL is set
    if [ -z "$DATABASE_URL" ]; then
        echo "❌ ERROR: DATABASE_URL environment variable is not set"
        echo ""
        echo "Please set DATABASE_URL or install Infisical:"
        echo "  export DATABASE_URL='postgresql://user:pass@host:port/dbname'"
        echo ""
        exit 1
    fi
    
    # Run the SQL file directly
    psql "$DATABASE_URL" -f "$SQL_FILE"
fi

echo ""
echo "✅ Migration completed successfully!"
echo ""
echo "Next steps:"
echo "  1. Verify the migration by checking the author_tag table"
echo "  2. Test the application to ensure tags are displaying correctly"
echo "  3. Once confirmed, you can optionally remove the 'tags' column from author_main"
