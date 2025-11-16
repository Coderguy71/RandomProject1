-- Rollback: Remove streak and village records created by this migration
-- We only delete records that were created by this specific migration
-- This is conservative to avoid accidentally deleting user data

-- Note: Since we can't reliably track which records were created by this migration,
-- we don't delete anything on rollback. The data will remain in the database.
-- This is intentional to preserve user data integrity during rollback.
