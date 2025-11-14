-- Rollback SAT Platform Schema

-- Drop triggers
DROP TRIGGER IF EXISTS update_community_replies_timestamp ON community_replies;
DROP TRIGGER IF EXISTS update_community_posts_timestamp ON community_posts;
DROP TRIGGER IF EXISTS update_village_state_timestamp ON village_state;
DROP TRIGGER IF EXISTS update_learning_paths_timestamp ON learning_paths;
DROP TRIGGER IF EXISTS update_user_progress_timestamp ON user_progress;
DROP TRIGGER IF EXISTS update_practice_problems_timestamp ON practice_problems;
DROP TRIGGER IF EXISTS update_tutorials_timestamp ON tutorials;
DROP TRIGGER IF EXISTS update_subtopics_timestamp ON subtopics;
DROP TRIGGER IF EXISTS update_major_topics_timestamp ON major_topics;

-- Drop function
DROP FUNCTION IF EXISTS update_timestamp();

-- Drop tables in reverse order of foreign key dependencies
DROP TABLE IF EXISTS community_replies;
DROP TABLE IF EXISTS community_posts;
DROP TABLE IF EXISTS village_state;
DROP TABLE IF EXISTS learning_paths;
DROP TABLE IF EXISTS user_attempts;
DROP TABLE IF EXISTS user_progress;
DROP TABLE IF EXISTS practice_problems;
DROP TABLE IF EXISTS tutorials;
DROP TABLE IF EXISTS subtopics;
DROP TABLE IF EXISTS major_topics;
