const { query } = require('../utils/database');

const createAttempt = async ({ userId, problemId, userAnswer, isCorrect, timeTaken = null }) => {
  const result = await query(
    `INSERT INTO user_attempts (user_id, problem_id, user_answer, is_correct, time_taken)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_id, problem_id, user_answer, is_correct, time_taken, created_at`,
    [userId, problemId, userAnswer, isCorrect, timeTaken]
  );
  return result.rows[0];
};

const getUserAttempts = async ({ userId, limit = 20, offset = 0 }) => {
  const result = await query(
    `SELECT 
      ua.id,
      ua.user_id,
      ua.problem_id,
      ua.user_answer,
      ua.is_correct,
      ua.time_taken,
      ua.created_at,
      pp.question_text,
      pp.options,
      pp.correct_answer,
      pp.explanation,
      pp.difficulty_level,
      s.name as subtopic_name,
      mt.name as major_topic_name
    FROM user_attempts ua
    JOIN practice_problems pp ON ua.problem_id = pp.id
    JOIN subtopics s ON pp.subtopic_id = s.id
    JOIN major_topics mt ON s.major_topic_id = mt.id
    WHERE ua.user_id = $1
    ORDER BY ua.created_at DESC
    LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
};

const countUserAttempts = async (userId) => {
  const result = await query(
    `SELECT COUNT(*) as total
     FROM user_attempts
     WHERE user_id = $1`,
    [userId]
  );
  return parseInt(result.rows[0].total, 10);
};

const getUserAttemptsByProblem = async (userId, problemId) => {
  const result = await query(
    `SELECT 
      id,
      user_id,
      problem_id,
      user_answer,
      is_correct,
      time_taken,
      created_at
    FROM user_attempts
    WHERE user_id = $1 AND problem_id = $2
    ORDER BY created_at DESC`,
    [userId, problemId]
  );
  return result.rows;
};

const getSubtopicAnalytics = async (userId, subtopicId) => {
  const result = await query(
    `SELECT 
      COUNT(*) as total_attempts,
      SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_attempts,
      AVG(time_taken) as avg_time_taken,
      COUNT(DISTINCT problem_id) as unique_problems_attempted
    FROM user_attempts ua
    JOIN practice_problems pp ON ua.problem_id = pp.id
    WHERE ua.user_id = $1 AND pp.subtopic_id = $2`,
    [userId, subtopicId]
  );
  
  const row = result.rows[0];
  const totalAttempts = parseInt(row.total_attempts, 10);
  const correctAttempts = parseInt(row.correct_attempts, 10);
  const accuracyRate = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

  return {
    total_attempts: totalAttempts,
    correct_attempts: correctAttempts,
    accuracy_rate: parseFloat(accuracyRate.toFixed(2)),
    avg_time_taken: row.avg_time_taken ? parseFloat(row.avg_time_taken).toFixed(2) : null,
    unique_problems_attempted: parseInt(row.unique_problems_attempted, 10),
  };
};

const getAllSubtopicsAnalytics = async (userId) => {
  const result = await query(
    `SELECT 
      s.id as subtopic_id,
      s.name as subtopic_name,
      mt.name as major_topic_name,
      COUNT(ua.id) as total_attempts,
      SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END) as correct_attempts,
      AVG(ua.time_taken) as avg_time_taken,
      COUNT(DISTINCT ua.problem_id) as unique_problems_attempted
    FROM subtopics s
    LEFT JOIN practice_problems pp ON s.id = pp.subtopic_id
    LEFT JOIN user_attempts ua ON pp.id = ua.problem_id AND ua.user_id = $1
    JOIN major_topics mt ON s.major_topic_id = mt.id
    GROUP BY s.id, s.name, mt.name
    ORDER BY mt.name, s.order_index`,
    [userId]
  );

  return result.rows.map(row => {
    const totalAttempts = parseInt(row.total_attempts, 10);
    const correctAttempts = parseInt(row.correct_attempts, 10);
    const accuracyRate = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

    return {
      subtopic_id: row.subtopic_id,
      subtopic_name: row.subtopic_name,
      major_topic_name: row.major_topic_name,
      total_attempts: totalAttempts,
      correct_attempts: correctAttempts,
      accuracy_rate: parseFloat(accuracyRate.toFixed(2)),
      avg_time_taken: row.avg_time_taken ? parseFloat(row.avg_time_taken).toFixed(2) : null,
      unique_problems_attempted: parseInt(row.unique_problems_attempted, 10),
    };
  });
};

module.exports = {
  createAttempt,
  getUserAttempts,
  countUserAttempts,
  getUserAttemptsByProblem,
  getSubtopicAnalytics,
  getAllSubtopicsAnalytics,
};
