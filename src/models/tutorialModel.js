const { query } = require('../utils/database');

const getAllTutorials = async ({ search = null, topicId = null, limit = 10, offset = 0 }) => {
  let sql = `
    SELECT 
      t.id,
      t.subtopic_id,
      t.title,
      t.content,
      t.video_url,
      t.order_index,
      t.created_at,
      t.updated_at,
      s.name as subtopic_name,
      s.description as subtopic_description,
      mt.id as major_topic_id,
      mt.name as major_topic_name
    FROM tutorials t
    JOIN subtopics s ON t.subtopic_id = s.id
    JOIN major_topics mt ON s.major_topic_id = mt.id
    WHERE 1=1
  `;

  const params = [];
  let paramIndex = 1;

  if (search) {
    sql += ` AND (t.title ILIKE $${paramIndex} OR t.content ILIKE $${paramIndex} OR s.name ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (topicId) {
    sql += ` AND s.major_topic_id = $${paramIndex}`;
    params.push(topicId);
    paramIndex++;
  }

  sql += ` ORDER BY mt.name, s.order_index, t.order_index
           LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const result = await query(sql, params);
  return result.rows;
};

const countAllTutorials = async ({ search = null, topicId = null }) => {
  let sql = `
    SELECT COUNT(*) as total
    FROM tutorials t
    JOIN subtopics s ON t.subtopic_id = s.id
    JOIN major_topics mt ON s.major_topic_id = mt.id
    WHERE 1=1
  `;

  const params = [];
  let paramIndex = 1;

  if (search) {
    sql += ` AND (t.title ILIKE $${paramIndex} OR t.content ILIKE $${paramIndex} OR s.name ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (topicId) {
    sql += ` AND s.major_topic_id = $${paramIndex}`;
    params.push(topicId);
  }

  const result = await query(sql, params);
  return parseInt(result.rows[0].total, 10);
};

const getTutorialById = async (tutorialId) => {
  const result = await query(
    `SELECT 
      t.id,
      t.subtopic_id,
      t.title,
      t.content,
      t.video_url,
      t.order_index,
      t.created_at,
      t.updated_at,
      s.name as subtopic_name,
      s.description as subtopic_description,
      mt.id as major_topic_id,
      mt.name as major_topic_name
    FROM tutorials t
    JOIN subtopics s ON t.subtopic_id = s.id
    JOIN major_topics mt ON s.major_topic_id = mt.id
    WHERE t.id = $1`,
    [tutorialId]
  );
  return result.rows[0];
};

const getTutorialsBySubtopic = async ({ subtopicId, limit = 10, offset = 0 }) => {
  const sql = `
    SELECT 
      t.id,
      t.subtopic_id,
      t.title,
      t.content,
      t.video_url,
      t.order_index,
      t.created_at,
      t.updated_at,
      s.name as subtopic_name,
      s.description as subtopic_description,
      mt.id as major_topic_id,
      mt.name as major_topic_name
    FROM tutorials t
    JOIN subtopics s ON t.subtopic_id = s.id
    JOIN major_topics mt ON s.major_topic_id = mt.id
    WHERE t.subtopic_id = $1
    ORDER BY t.order_index
    LIMIT $2 OFFSET $3
  `;

  const result = await query(sql, [subtopicId, limit, offset]);
  return result.rows;
};

const countTutorialsBySubtopic = async (subtopicId) => {
  const result = await query(
    'SELECT COUNT(*) as total FROM tutorials WHERE subtopic_id = $1',
    [subtopicId]
  );
  return parseInt(result.rows[0].total, 10);
};

const getRelatedProblems = async (tutorialId, { limit = 5 }) => {
  const sql = `
    SELECT 
      pp.id,
      pp.subtopic_id,
      pp.question_text,
      pp.options,
      pp.difficulty_level,
      pp.created_at,
      s.name as subtopic_name,
      mt.name as major_topic_name
    FROM practice_problems pp
    JOIN subtopics s ON pp.subtopic_id = s.id
    JOIN major_topics mt ON s.major_topic_id = mt.id
    WHERE pp.subtopic_id = (
      SELECT subtopic_id FROM tutorials WHERE id = $1
    )
    ORDER BY pp.difficulty_level, pp.created_at
    LIMIT $2
  `;

  const result = await query(sql, [tutorialId, limit]);
  return result.rows;
};

const markTutorialAsViewed = async (userId, tutorialId) => {
  const sql = `
    INSERT INTO tutorial_views (user_id, tutorial_id, viewed_at, completed)
    VALUES ($1, $2, CURRENT_TIMESTAMP, false)
    ON CONFLICT (user_id, tutorial_id) 
    DO UPDATE SET 
      viewed_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;

  const result = await query(sql, [userId, tutorialId]);
  return result.rows[0];
};

const getTutorialViewStatus = async (userId, tutorialId) => {
  const result = await query(
    `SELECT * FROM tutorial_views 
     WHERE user_id = $1 AND tutorial_id = $2`,
    [userId, tutorialId]
  );
  return result.rows[0];
};

const getUserViewedTutorials = async (userId, { limit = 20, offset = 0 }) => {
  const sql = `
    SELECT 
      t.id,
      t.subtopic_id,
      t.title,
      t.video_url,
      t.order_index,
      tv.viewed_at,
      tv.completed,
      s.name as subtopic_name,
      mt.name as major_topic_name
    FROM tutorial_views tv
    JOIN tutorials t ON tv.tutorial_id = t.id
    JOIN subtopics s ON t.subtopic_id = s.id
    JOIN major_topics mt ON s.major_topic_id = mt.id
    WHERE tv.user_id = $1
    ORDER BY tv.viewed_at DESC
    LIMIT $2 OFFSET $3
  `;

  const result = await query(sql, [userId, limit, offset]);
  return result.rows;
};

const countUserViewedTutorials = async (userId) => {
  const result = await query(
    'SELECT COUNT(*) as total FROM tutorial_views WHERE user_id = $1',
    [userId]
  );
  return parseInt(result.rows[0].total, 10);
};

module.exports = {
  getAllTutorials,
  countAllTutorials,
  getTutorialById,
  getTutorialsBySubtopic,
  countTutorialsBySubtopic,
  getRelatedProblems,
  markTutorialAsViewed,
  getTutorialViewStatus,
  getUserViewedTutorials,
  countUserViewedTutorials,
};