-- Drop learning path tables

-- Drop triggers first
DROP TRIGGER IF EXISTS update_learning_path_recommendations_timestamp ON learning_path_recommendations;
DROP TRIGGER IF EXISTS update_learning_path_progress_timestamp ON learning_path_progress;

-- Drop tables
DROP TABLE IF EXISTS learning_path_recommendations;
DROP TABLE IF EXISTS learning_path_progress;

-- Drop trigger function
DROP FUNCTION IF EXISTS update_learning_path_timestamp();