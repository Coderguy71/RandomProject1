DROP INDEX IF EXISTS idx_community_replies_parent_id;
DROP INDEX IF EXISTS idx_community_posts_topic;

ALTER TABLE community_replies
  DROP COLUMN parent_id;

ALTER TABLE community_posts
  DROP COLUMN topic;
