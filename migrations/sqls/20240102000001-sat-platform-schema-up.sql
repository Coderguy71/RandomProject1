-- SAT Platform Schema - Core Tables for MVP
-- This migration creates all required tables for the SAT Math learning platform

-- ========================================
-- 1. MAJOR TOPICS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS major_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_major_topics_name ON major_topics(name);

-- ========================================
-- 2. SUBTOPICS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS subtopics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  major_topic_id UUID NOT NULL REFERENCES major_topics(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  tutorial_video_url VARCHAR(1000),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subtopics_major_topic_id ON subtopics(major_topic_id);
CREATE INDEX IF NOT EXISTS idx_subtopics_name ON subtopics(name);

-- ========================================
-- 3. TUTORIALS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS tutorials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subtopic_id UUID NOT NULL REFERENCES subtopics(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  content TEXT,
  video_url VARCHAR(1000),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tutorials_subtopic_id ON tutorials(subtopic_id);
CREATE INDEX IF NOT EXISTS idx_tutorials_order ON tutorials(order_index);

-- ========================================
-- 4. PRACTICE PROBLEMS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS practice_problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subtopic_id UUID NOT NULL REFERENCES subtopics(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer VARCHAR(255) NOT NULL,
  explanation TEXT,
  difficulty_level VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_practice_problems_subtopic_id ON practice_problems(subtopic_id);
CREATE INDEX IF NOT EXISTS idx_practice_problems_difficulty_level ON practice_problems(difficulty_level);

-- ========================================
-- 5. USER PROGRESS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subtopic_id UUID NOT NULL REFERENCES subtopics(id) ON DELETE CASCADE,
  problems_completed INTEGER DEFAULT 0,
  accuracy_rate DECIMAL(5, 2) DEFAULT 0.00,
  last_accessed TIMESTAMP WITH TIME ZONE,
  streak_days INTEGER DEFAULT 0,
  last_streak_updated TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, subtopic_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_subtopic_id ON user_progress(subtopic_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_subtopic ON user_progress(user_id, subtopic_id);

-- ========================================
-- 6. USER ATTEMPTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS user_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES practice_problems(id) ON DELETE CASCADE,
  user_answer VARCHAR(255) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_attempts_user_id ON user_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_attempts_problem_id ON user_attempts(problem_id);
CREATE INDEX IF NOT EXISTS idx_user_attempts_user_problem ON user_attempts(user_id, problem_id);
CREATE INDEX IF NOT EXISTS idx_user_attempts_created_at ON user_attempts(created_at);

-- ========================================
-- 7. LEARNING PATHS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  current_subtopic_id UUID REFERENCES subtopics(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'in_progress',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_current_subtopic_id ON learning_paths(current_subtopic_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_status ON learning_paths(status);

-- ========================================
-- 8. VILLAGE STATE TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS village_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  village_health INTEGER DEFAULT 100,
  resources JSONB DEFAULT '{"gold": 0, "gems": 0, "wood": 0}'::jsonb,
  decorations JSONB DEFAULT '[]'::jsonb,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_village_state_user_id ON village_state(user_id);

-- ========================================
-- 9. COMMUNITY POSTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at);

-- ========================================
-- 10. COMMUNITY REPLIES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS community_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_community_replies_post_id ON community_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_community_replies_user_id ON community_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_community_replies_created_at ON community_replies(created_at);

-- ========================================
-- ADD AUDIT TRIGGER UPDATE FOR TIMESTAMPS
-- ========================================
-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_major_topics_timestamp
  BEFORE UPDATE ON major_topics
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_subtopics_timestamp
  BEFORE UPDATE ON subtopics
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_tutorials_timestamp
  BEFORE UPDATE ON tutorials
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_practice_problems_timestamp
  BEFORE UPDATE ON practice_problems
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_user_progress_timestamp
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_learning_paths_timestamp
  BEFORE UPDATE ON learning_paths
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_village_state_timestamp
  BEFORE UPDATE ON village_state
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_community_posts_timestamp
  BEFORE UPDATE ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_community_replies_timestamp
  BEFORE UPDATE ON community_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();
