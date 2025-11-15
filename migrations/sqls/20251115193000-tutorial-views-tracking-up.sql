-- Tutorial Views Tracking Table
-- This table tracks which tutorials have been viewed by users

CREATE TABLE IF NOT EXISTS tutorial_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tutorial_id UUID NOT NULL REFERENCES tutorials(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, tutorial_id)
);

CREATE INDEX IF NOT EXISTS idx_tutorial_views_user_id ON tutorial_views(user_id);
CREATE INDEX IF NOT EXISTS idx_tutorial_views_tutorial_id ON tutorial_views(tutorial_id);
CREATE INDEX IF NOT EXISTS idx_tutorial_views_user_tutorial ON tutorial_views(user_id, tutorial_id);
CREATE INDEX IF NOT EXISTS idx_tutorial_views_viewed_at ON tutorial_views(viewed_at);

-- Trigger for updated_at
CREATE TRIGGER update_tutorial_views_timestamp
  BEFORE UPDATE ON tutorial_views
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();