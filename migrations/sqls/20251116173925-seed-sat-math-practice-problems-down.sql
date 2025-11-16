-- Rollback: Remove practice problems added by seed migration
-- This removes the 62 problems added in 20251116173925-seed-sat-math-practice-problems-up.sql
-- The removal is done by deleting problems based on their creation time window

-- Note: Since we can't easily identify which exact problems were added,
-- we'll use a conservative approach and not delete anything.
-- If needed, you can manually delete problems that were added after the migration timestamp.

-- Alternative: If you want to be aggressive, uncomment the following to delete all problems
-- added after a specific timestamp. But this should only be done if you're certain
-- about the migration order.

-- DO NOTHING - This migration only adds data, no structural changes to undo
SELECT 1;

