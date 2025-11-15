const { query } = require('../utils/database');

const getProblemsBySubtopic = async ({ subtopicId, difficulty = null, limit = 10, offset = 0 }) => {
  let sql = `
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
    WHERE pp.subtopic_id = $1
  `;

  const params = [subtopicId];
  let paramIndex = 2;

  if (difficulty) {
    sql += ` AND pp.difficulty_level = $${paramIndex}`;
    params.push(difficulty);
    paramIndex++;
  }

  sql += ` ORDER BY pp.created_at
           LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const result = await query(sql, params);
  return result.rows;
};

const countProblemsBySubtopic = async ({ subtopicId, difficulty = null }) => {
  let sql = `
    SELECT COUNT(*) as total
    FROM practice_problems pp
    WHERE pp.subtopic_id = $1
  `;

  const params = [subtopicId];

  if (difficulty) {
    sql += ` AND pp.difficulty_level = $2`;
    params.push(difficulty);
  }

  const result = await query(sql, params);
  return parseInt(result.rows[0].total, 10);
};

const getProblemById = async (problemId) => {
  const result = await query(
    `SELECT 
      pp.id,
      pp.subtopic_id,
      pp.question_text,
      pp.options,
      pp.correct_answer,
      pp.explanation,
      pp.difficulty_level,
      pp.created_at,
      s.name as subtopic_name,
      mt.name as major_topic_name
    FROM practice_problems pp
    JOIN subtopics s ON pp.subtopic_id = s.id
    JOIN major_topics mt ON s.major_topic_id = mt.id
    WHERE pp.id = $1`,
    [problemId]
  );
  return result.rows[0];
};

const getAllProblems = async ({ difficulty = null, limit = 10, offset = 0 }) => {
  let sql = `
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
    WHERE 1=1
  `;

  const params = [];
  let paramIndex = 1;

  if (difficulty) {
    sql += ` AND pp.difficulty_level = $${paramIndex}`;
    params.push(difficulty);
    paramIndex++;
  }

  sql += ` ORDER BY pp.created_at
           LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const result = await query(sql, params);
  return result.rows;
};

const countAllProblems = async ({ difficulty = null }) => {
  let sql = `
    SELECT COUNT(*) as total
    FROM practice_problems pp
    WHERE 1=1
  `;

  const params = [];

  if (difficulty) {
    sql += ` AND pp.difficulty_level = $1`;
    params.push(difficulty);
  }

  const result = await query(sql, params);
  return parseInt(result.rows[0].total, 10);
};

module.exports = {
  getProblemsBySubtopic,
  countProblemsBySubtopic,
  getProblemById,
  getAllProblems,
  countAllProblems,
};
