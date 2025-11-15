ALTER TABLE community_posts
  ADD COLUMN topic VARCHAR(100) NOT NULL DEFAULT 'general';

ALTER TABLE community_replies
  ADD COLUMN parent_id UUID REFERENCES community_replies(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_community_posts_topic ON community_posts(topic);
CREATE INDEX IF NOT EXISTS idx_community_replies_parent_id ON community_replies(parent_id);
