const { query } = require('../utils/database');

const getAllTopics = async () => {
  const result = await query(
    `SELECT 
       id,
       name,
       description,
       created_at,
       updated_at
     FROM major_topics
     ORDER BY name`
  );
  return result.rows;
};

const getSubtopicsByTopic = async (topicId) => {
  const result = await query(
    `SELECT 
       s.id,
       s.name,
       s.description,
       s.major_topic_id,
       s.created_at,
       s.updated_at,
       mt.name as major_topic_name
     FROM subtopics s
     JOIN major_topics mt ON s.major_topic_id = mt.id
     WHERE s.major_topic_id = $1
     ORDER BY s.name`,
    [topicId]
  );
  return result.rows;
};

const getAllSubtopics = async (userId = null) => {
  let sql = `
    SELECT 
      s.id,
      s.name,
      s.description,
      s.major_topic_id,
      s.created_at,
      s.updated_at,
      mt.name as major_topic_name
  `;
  
  if (userId) {
    sql += `,
      COALESCE(pp.problem_count, 0) as problem_count,
      COALESCE(pa.attempts_count, 0) as attempts_count,
      COALESCE(pa.correct_attempts, 0) as correct_attempts,
      CASE 
        WHEN COALESCE(pa.attempts_count, 0) = 0 THEN NULL
        ELSE ROUND((COALESCE(pa.correct_attempts, 0)::decimal / COALESCE(pa.attempts_count, 1)) * 100, 2)
      END as accuracy,
      COALESCE(pp.avg_difficulty, 'medium') as average_difficulty
    `;
  } else {
    sql += `,
      COALESCE(pp.problem_count, 0) as problem_count,
      COALESCE(pp.avg_difficulty, 'medium') as average_difficulty
    `;
  }
  
  sql += `
    FROM subtopics s
    JOIN major_topics mt ON s.major_topic_id = mt.id
    LEFT JOIN (
      SELECT 
        subtopic_id,
        COUNT(*) as problem_count,
        CASE 
          WHEN COUNT(CASE WHEN difficulty_level = 'easy' THEN 1 END) > COUNT(CASE WHEN difficulty_level = 'hard' THEN 1 END) THEN 'easy'
          WHEN COUNT(CASE WHEN difficulty_level = 'hard' THEN 1 END) > COUNT(CASE WHEN difficulty_level = 'easy' THEN 1 END) THEN 'hard'
          ELSE 'medium'
        END as avg_difficulty
      FROM practice_problems
      GROUP BY subtopic_id
    ) pp ON s.id = pp.subtopic_id
  `;
  
  if (userId) {
    sql += `
      LEFT JOIN (
        SELECT 
          pp.subtopic_id,
          COUNT(a.id) as attempts_count,
          COUNT(CASE WHEN a.is_correct = true THEN 1 END) as correct_attempts
        FROM practice_problems pp
        LEFT JOIN attempts a ON pp.id = a.problem_id AND a.user_id = $1
        GROUP BY pp.subtopic_id
      ) pa ON s.id = pa.subtopic_id
    `;
  }
  
  sql += ` ORDER BY mt.name, s.name`;
  
  const params = userId ? [userId] : [];
  const result = await query(sql, params);
  return result.rows;
};

const getSubtopicById = async (subtopicId) => {
  const result = await query(
    `SELECT 
       s.id,
       s.name,
       s.description,
       s.major_topic_id,
       s.created_at,
       s.updated_at,
       mt.name as major_topic_name
     FROM subtopics s
     JOIN major_topics mt ON s.major_topic_id = mt.id
     WHERE s.id = $1`,
    [subtopicId]
  );
  return result.rows[0];
};

module.exports = {
  getAllTopics,
  getSubtopicsByTopic,
  getAllSubtopics,
  getSubtopicById,
};