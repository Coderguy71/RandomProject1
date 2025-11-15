const { query } = require('../utils/database');

const getOrCreateProgress = async (userId, subtopicId) => {
  const existing = await query(
    `SELECT 
      id,
      user_id,
      subtopic_id,
      problems_completed,
      accuracy_rate,
      last_accessed,
      streak_days,
      last_streak_updated,
      created_at,
      updated_at
    FROM user_progress
    WHERE user_id = $1 AND subtopic_id = $2`,
    [userId, subtopicId]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  const newProgress = await query(
    `INSERT INTO user_progress (user_id, subtopic_id, problems_completed, accuracy_rate, last_accessed)
     VALUES ($1, $2, 0, 0.00, NOW())
     RETURNING id, user_id, subtopic_id, problems_completed, accuracy_rate, last_accessed, 
               streak_days, last_streak_updated, created_at, updated_at`,
    [userId, subtopicId]
  );

  return newProgress.rows[0];
};

const updateProgress = async (userId, subtopicId) => {
  const analyticsResult = await query(
    `SELECT 
      COUNT(*) as total_attempts,
      SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_attempts,
      COUNT(DISTINCT problem_id) as unique_problems
    FROM user_attempts ua
    JOIN practice_problems pp ON ua.problem_id = pp.id
    WHERE ua.user_id = $1 AND pp.subtopic_id = $2`,
    [userId, subtopicId]
  );

  const stats = analyticsResult.rows[0];
  const totalAttempts = parseInt(stats.total_attempts, 10);
  const correctAttempts = parseInt(stats.correct_attempts, 10);
  const accuracyRate = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
  const problemsCompleted = parseInt(stats.unique_problems, 10);

  const result = await query(
    `UPDATE user_progress
     SET problems_completed = $1,
         accuracy_rate = $2,
         last_accessed = NOW()
     WHERE user_id = $3 AND subtopic_id = $4
     RETURNING id, user_id, subtopic_id, problems_completed, accuracy_rate, last_accessed, 
               streak_days, last_streak_updated, created_at, updated_at`,
    [problemsCompleted, accuracyRate.toFixed(2), userId, subtopicId]
  );

  return result.rows[0];
};

const getUserProgress = async (userId) => {
  const result = await query(
    `SELECT 
      up.id,
      up.user_id,
      up.subtopic_id,
      up.problems_completed,
      up.accuracy_rate,
      up.last_accessed,
      up.streak_days,
      up.last_streak_updated,
      up.created_at,
      up.updated_at,
      s.name as subtopic_name,
      s.description as subtopic_description,
      mt.name as major_topic_name,
      mt.id as major_topic_id
    FROM user_progress up
    JOIN subtopics s ON up.subtopic_id = s.id
    JOIN major_topics mt ON s.major_topic_id = mt.id
    WHERE up.user_id = $1
    ORDER BY mt.name, s.order_index`,
    [userId]
  );

  return result.rows;
};

const getProgressBySubtopic = async (userId, subtopicId) => {
  const result = await query(
    `SELECT 
      up.id,
      up.user_id,
      up.subtopic_id,
      up.problems_completed,
      up.accuracy_rate,
      up.last_accessed,
      up.streak_days,
      up.last_streak_updated,
      up.created_at,
      up.updated_at,
      s.name as subtopic_name,
      s.description as subtopic_description,
      mt.name as major_topic_name,
      mt.id as major_topic_id
    FROM user_progress up
    JOIN subtopics s ON up.subtopic_id = s.id
    JOIN major_topics mt ON s.major_topic_id = mt.id
    WHERE up.user_id = $1 AND up.subtopic_id = $2`,
    [userId, subtopicId]
  );

  return result.rows[0];
};

module.exports = {
  getOrCreateProgress,
  updateProgress,
  getUserProgress,
  getProgressBySubtopic,
};
