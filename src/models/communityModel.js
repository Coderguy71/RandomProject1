const { query } = require('../utils/database');

const createPost = async ({ userId, title, content, topic }) => {
  const result = await query(
    `INSERT INTO community_posts (user_id, title, content, topic)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, title, content, topic, created_at, updated_at`,
    [userId, title, content, topic]
  );
  return result.rows[0];
};

const getPostById = async (postId) => {
  const result = await query(
    `SELECT 
      cp.id,
      cp.user_id,
      cp.title,
      cp.content,
      cp.topic,
      cp.created_at,
      cp.updated_at,
      u.username,
      u.first_name,
      u.last_name
     FROM community_posts cp
     JOIN users u ON cp.user_id = u.id
     WHERE cp.id = $1`,
    [postId]
  );
  return result.rows[0];
};

const getPosts = async ({ topic = null, search = null, sort = 'newest', limit = 20, offset = 0 }) => {
  let sql = `
    SELECT 
      cp.id,
      cp.user_id,
      cp.title,
      cp.content,
      cp.topic,
      cp.created_at,
      cp.updated_at,
      u.username,
      u.first_name,
      u.last_name,
      COUNT(cr.id) as reply_count
    FROM community_posts cp
    JOIN users u ON cp.user_id = u.id
    LEFT JOIN community_replies cr ON cp.id = cr.post_id
    WHERE 1=1
  `;

  const params = [];
  let paramIndex = 1;

  if (topic) {
    sql += ` AND cp.topic = $${paramIndex}`;
    params.push(topic);
    paramIndex++;
  }

  if (search) {
    sql += ` AND (cp.title ILIKE $${paramIndex} OR cp.content ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  sql += ` GROUP BY cp.id, u.id`;

  if (sort === 'most-replied') {
    sql += ` ORDER BY reply_count DESC, cp.created_at DESC`;
  } else if (sort === 'trending') {
    sql += ` ORDER BY (COUNT(cr.id)::float / GREATEST(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - cp.created_at)), 1)) DESC`;
  } else {
    sql += ` ORDER BY cp.created_at DESC`;
  }

  sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const result = await query(sql, params);
  return result.rows;
};

const countPosts = async ({ topic = null, search = null }) => {
  let sql = `
    SELECT COUNT(*) as total
    FROM community_posts cp
    WHERE 1=1
  `;

  const params = [];
  let paramIndex = 1;

  if (topic) {
    sql += ` AND cp.topic = $${paramIndex}`;
    params.push(topic);
    paramIndex++;
  }

  if (search) {
    sql += ` AND (cp.title ILIKE $${paramIndex} OR cp.content ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
  }

  const result = await query(sql, params);
  return parseInt(result.rows[0].total, 10);
};

const updatePost = async ({ postId, title, content, topic }) => {
  const result = await query(
    `UPDATE community_posts
     SET title = $1, content = $2, topic = $3
     WHERE id = $4
     RETURNING id, user_id, title, content, topic, created_at, updated_at`,
    [title, content, topic, postId]
  );
  return result.rows[0];
};

const deletePost = async (postId) => {
  const result = await query(
    `DELETE FROM community_posts
     WHERE id = $1
     RETURNING id`,
    [postId]
  );
  return result.rows[0];
};

const createReply = async ({ postId, userId, content, parentId = null }) => {
  const result = await query(
    `INSERT INTO community_replies (post_id, user_id, content, parent_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, post_id, user_id, content, parent_id, created_at, updated_at`,
    [postId, userId, content, parentId]
  );
  return result.rows[0];
};

const getRepliesByPostId = async (postId) => {
  const result = await query(
    `SELECT 
      cr.id,
      cr.post_id,
      cr.user_id,
      cr.content,
      cr.parent_id,
      cr.created_at,
      cr.updated_at,
      u.username,
      u.first_name,
      u.last_name
     FROM community_replies cr
     JOIN users u ON cr.user_id = u.id
     WHERE cr.post_id = $1
     ORDER BY cr.created_at ASC`,
    [postId]
  );
  return result.rows;
};

const getReplyById = async (replyId) => {
  const result = await query(
    `SELECT 
      cr.id,
      cr.post_id,
      cr.user_id,
      cr.content,
      cr.parent_id,
      cr.created_at,
      cr.updated_at,
      u.username,
      u.first_name,
      u.last_name
     FROM community_replies cr
     JOIN users u ON cr.user_id = u.id
     WHERE cr.id = $1`,
    [replyId]
  );
  return result.rows[0];
};

const updateReply = async ({ replyId, content }) => {
  const result = await query(
    `UPDATE community_replies
     SET content = $1
     WHERE id = $2
     RETURNING id, post_id, user_id, content, parent_id, created_at, updated_at`,
    [content, replyId]
  );
  return result.rows[0];
};

const deleteReply = async (replyId) => {
  const result = await query(
    `DELETE FROM community_replies
     WHERE id = $1
     RETURNING id`,
    [replyId]
  );
  return result.rows[0];
};

const getTrendingPosts = async (limit = 10) => {
  const result = await query(
    `SELECT 
      cp.id,
      cp.user_id,
      cp.title,
      cp.content,
      cp.topic,
      cp.created_at,
      cp.updated_at,
      u.username,
      u.first_name,
      u.last_name,
      COUNT(cr.id) as reply_count,
      (COUNT(cr.id)::float / GREATEST(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - cp.created_at)), 1)) as trending_score
     FROM community_posts cp
     JOIN users u ON cp.user_id = u.id
     LEFT JOIN community_replies cr ON cp.id = cr.post_id
     WHERE cp.created_at > CURRENT_TIMESTAMP - INTERVAL '7 days'
     GROUP BY cp.id, u.id
     ORDER BY trending_score DESC, cp.created_at DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
};

module.exports = {
  createPost,
  getPostById,
  getPosts,
  countPosts,
  updatePost,
  deletePost,
  createReply,
  getRepliesByPostId,
  getReplyById,
  updateReply,
  deleteReply,
  getTrendingPosts,
};
