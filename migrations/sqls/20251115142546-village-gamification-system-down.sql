-- Rollback Village Gamification System Migration

-- Drop tables in reverse order (respecting foreign key dependencies)
DROP TABLE IF EXISTS village_history CASCADE;
DROP TABLE IF EXISTS user_milestones CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS user_decoration_placements CASCADE;
DROP TABLE IF EXISTS user_decorations CASCADE;
DROP TABLE IF EXISTS village_decorations CASCADE;
DROP TABLE IF EXISTS daily_streaks CASCADE;

-- Remove added columns from village_state
ALTER TABLE village_state 
DROP COLUMN IF EXISTS village_happiness,
DROP COLUMN IF EXISTS village_level,
DROP COLUMN IF EXISTS experience_points,
DROP COLUMN IF EXISTS total_resources_earned,
DROP COLUMN IF EXISTS total_resources_spent;
