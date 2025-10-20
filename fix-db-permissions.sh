#!/bin/bash

##############################################
# Fix Database Permissions for Jam Social API
# Run with: sudo bash fix-db-permissions.sh
##############################################

set -e  # Exit on error

echo "Fixing database permissions for koolfoam user..."

sudo -u postgres psql -d koolfoam <<EOF
-- Grant all privileges on tables to koolfoam user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO koolfoam;

-- Grant all privileges on sequences to koolfoam user
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO koolfoam;

-- Grant execute on all functions to koolfoam user
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO koolfoam;

-- Make koolfoam owner of the tables (fixes future permission issues)
ALTER TABLE user_files OWNER TO koolfoam;
ALTER TABLE user_storage OWNER TO koolfoam;

-- Verify permissions
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

\q
EOF

echo "✅ Database permissions fixed!"
echo ""
echo "Testing connection..."
PGPASSWORD='koolfoam2000$' psql -U koolfoam -d koolfoam -c "SELECT COUNT(*) as user_files_count FROM user_files; SELECT COUNT(*) as user_storage_count FROM user_storage;"

echo ""
echo "✅ All done! Restart the API to test:"
echo "   pm2 restart jam-api"
echo "   pm2 logs jam-api --lines 50"
