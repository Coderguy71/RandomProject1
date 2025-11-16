-- Create learning path tables

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create learning_path_recommendations table
CREATE TABLE IF NOT EXISTS learning_path_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subtopic_id UUID NOT NULL REFERENCES subtopics(id) ON DELETE CASCADE,
  recommendation_type VARCHAR(50) NOT NULL,
  priority INTEGER NOT NULL DEFAULT 1,
  difficulty_level VARCHAR(50),
  reason TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create learning_path_progress table
CREATE TABLE IF NOT EXISTS learning_path_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  major_topic_id UUID NOT NULL REFERENCES major_topics(id) ON DELETE CASCADE,
  current_subtopic_id UUID REFERENCES subtopics(id) ON DELETE SET NULL,
  mastery_level DECIMAL(5,2) DEFAULT 0.00,
  subtopics_completed INTEGER DEFAULT 0,
  total_subtopics INTEGER DEFAULT 0,
  last_recommendation_at TIMESTAMP WITH TIME ZONE,
  engagement_score DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, major_topic_id)
);

-- Create indexes for learning_path_recommendations
CREATE INDEX IF NOT EXISTS idx_learning_path_recommendations_user_id ON learning_path_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_path_recommendations_subtopic_id ON learning_path_recommendations(subtopic_id);
CREATE INDEX IF NOT EXISTS idx_learning_path_recommendations_user_priority ON learning_path_recommendations(user_id, priority);

-- Create indexes for learning_path_progress
CREATE INDEX IF NOT EXISTS idx_learning_path_progress_user_id ON learning_path_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_path_progress_major_topic_id ON learning_path_progress(major_topic_id);
CREATE INDEX IF NOT EXISTS idx_learning_path_progress_user_major ON learning_path_progress(user_id, major_topic_id);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_learning_path_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for both tables
CREATE TRIGGER update_learning_path_recommendations_timestamp
  BEFORE UPDATE ON learning_path_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION update_learning_path_timestamp();

CREATE TRIGGER update_learning_path_progress_timestamp
  BEFORE UPDATE ON learning_path_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_learning_path_timestamp();