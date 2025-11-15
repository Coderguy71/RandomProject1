const { query } = require('../utils/database');

const applyDateFilter = (column, startDate, endDate, values) => {
  let filter = '';

  if (startDate) {
    values.push(startDate);
    filter += ` AND ${column} >= $${values.length}`;
  }

  if (endDate) {
    values.push(endDate);
    filter += ` AND ${column} <= $${values.length}`;
  }

  return filter;
};

const sanitizeInterval = (interval) => {
  if (!interval) {
    return 'day';
  }

  const normalized = interval.toLowerCase();

  if (normalized !== 'day' && normalized !== 'week') {
    throw new Error('Invalid interval');
  }

  return normalized;
};

const getOverallStats = async (userId, startDate, endDate) => {
  const values = [userId];
  const dateFilter = applyDateFilter('ua.created_at', startDate, endDate, values);

  const result = await query(
    `SELECT 
       COUNT(*) AS total_attempts,
       SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END) AS correct_attempts,
       COUNT(DISTINCT ua.problem_id) AS unique_problems,
       COUNT(DISTINCT CASE WHEN ua.is_correct THEN ua.problem_id END) AS unique_correct_problems,
       AVG(ua.time_taken) AS avg_time_taken,
       SUM(ua.time_taken) AS total_time_taken,
       MIN(ua.created_at) AS first_attempt_at,
       MAX(ua.created_at) AS last_attempt_at,
       COUNT(DISTINCT DATE_TRUNC('day', ua.created_at)) AS active_days
     FROM user_attempts ua
     WHERE ua.user_id = $1
     ${dateFilter}`,
    values
  );

  return result.rows[0] || null;
};

const getTopicBreakdown = async (userId, startDate, endDate) => {
  const values = [userId];
  const dateFilter = applyDateFilter('ua.created_at', startDate, endDate, values);

  const result = await query(
    `SELECT 
       mt.id AS topic_id,
       mt.name AS topic_name,
       COUNT(ua.id) AS total_attempts,
       SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END) AS correct_attempts,
       COUNT(DISTINCT ua.problem_id) AS unique_problems,
       AVG(ua.time_taken) AS avg_time_taken
     FROM major_topics mt
     JOIN subtopics s ON s.major_topic_id = mt.id
     JOIN practice_problems pp ON pp.subtopic_id = s.id
     LEFT JOIN user_attempts ua ON ua.problem_id = pp.id
       AND ua.user_id = $1
       ${dateFilter}
     GROUP BY mt.id, mt.name
     ORDER BY mt.name`,
    values
  );

  return result.rows;
};

const getSubtopicBreakdown = async (userId, startDate, endDate) => {
  const values = [userId];
  const dateFilter = applyDateFilter('ua.created_at', startDate, endDate, values);

  const result = await query(
    `SELECT 
       s.id AS subtopic_id,
       s.name AS subtopic_name,
       s.description AS subtopic_description,
       mt.id AS topic_id,
       mt.name AS topic_name,
       COUNT(ua.id) AS total_attempts,
       SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END) AS correct_attempts,
       COUNT(DISTINCT ua.problem_id) AS unique_problems,
       AVG(ua.time_taken) AS avg_time_taken
     FROM subtopics s
     JOIN major_topics mt ON mt.id = s.major_topic_id
     JOIN practice_problems pp ON pp.subtopic_id = s.id
     LEFT JOIN user_attempts ua ON ua.problem_id = pp.id
       AND ua.user_id = $1
       ${dateFilter}
     GROUP BY s.id, s.name, s.description, mt.id, mt.name
     ORDER BY mt.name, s.order_index, s.name`,
    values
  );

  return result.rows;
};

const getSubtopicStats = async (userId, subtopicId, startDate, endDate) => {
  const values = [userId, subtopicId];
  const dateFilter = applyDateFilter('ua.created_at', startDate, endDate, values);

  const result = await query(
    `SELECT 
       s.id AS subtopic_id,
       s.name AS subtopic_name,
       s.description AS subtopic_description,
       mt.id AS topic_id,
       mt.name AS topic_name,
       COUNT(ua.id) AS total_attempts,
       SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END) AS correct_attempts,
       COUNT(DISTINCT ua.problem_id) AS unique_problems,
       AVG(ua.time_taken) AS avg_time_taken,
       SUM(ua.time_taken) AS total_time_taken,
       MIN(ua.created_at) AS first_attempt_at,
       MAX(ua.created_at) AS last_attempt_at
     FROM subtopics s
     JOIN major_topics mt ON mt.id = s.major_topic_id
     LEFT JOIN practice_problems pp ON pp.subtopic_id = s.id
     LEFT JOIN user_attempts ua ON ua.problem_id = pp.id
       AND ua.user_id = $1
       ${dateFilter}
     WHERE s.id = $2
     GROUP BY s.id, s.name, s.description, mt.id, mt.name`,
    values
  );

  return result.rows[0] || null;
};

const getTimeline = async (userId, startDate, endDate, interval = 'day') => {
  const sanitizedInterval = sanitizeInterval(interval);
  const values = [userId];
  const dateFilter = applyDateFilter('ua.created_at', startDate, endDate, values);

  const result = await query(
    `SELECT 
       DATE_TRUNC('${sanitizedInterval}', ua.created_at) AS period_start,
       COUNT(*) AS total_attempts,
       SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END) AS correct_attempts,
       COUNT(DISTINCT ua.problem_id) AS unique_problems,
       AVG(ua.time_taken) AS avg_time_taken,
       SUM(ua.time_taken) AS total_time_taken
     FROM user_attempts ua
     WHERE ua.user_id = $1
     ${dateFilter}
     GROUP BY period_start
     ORDER BY period_start`,
    values
  );

  return result.rows;
};

const getSubtopicTimeline = async (userId, subtopicId, startDate, endDate, interval = 'day') => {
  const sanitizedInterval = sanitizeInterval(interval);
  const values = [userId, subtopicId];
  const dateFilter = applyDateFilter('ua.created_at', startDate, endDate, values);

  const result = await query(
    `SELECT 
       DATE_TRUNC('${sanitizedInterval}', ua.created_at) AS period_start,
       COUNT(*) AS total_attempts,
       SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END) AS correct_attempts,
       COUNT(DISTINCT ua.problem_id) AS unique_problems,
       AVG(ua.time_taken) AS avg_time_taken,
       SUM(ua.time_taken) AS total_time_taken
     FROM user_attempts ua
     JOIN practice_problems pp ON pp.id = ua.problem_id
     WHERE ua.user_id = $1
       AND pp.subtopic_id = $2
       ${dateFilter}
     GROUP BY period_start
     ORDER BY period_start`,
    values
  );

  return result.rows;
};

const getProblemsCount = async () => {
  const result = await query(
    `SELECT COUNT(*) AS total_problems FROM practice_problems`
  );

  return result.rows[0] ? parseInt(result.rows[0].total_problems, 10) : 0;
};

const getRecentAttemptsForSubtopic = async (userId, subtopicId, limit = 10) => {
  const result = await query(
    `SELECT 
       ua.id,
       ua.problem_id,
       ua.is_correct,
       ua.time_taken,
       ua.created_at,
       pp.question_text,
       pp.difficulty_level,
       pp.correct_answer
     FROM user_attempts ua
     JOIN practice_problems pp ON pp.id = ua.problem_id
     WHERE ua.user_id = $1
       AND pp.subtopic_id = $2
     ORDER BY ua.created_at DESC
     LIMIT $3`,
    [userId, subtopicId, limit]
  );

  return result.rows;
};

module.exports = {
  getOverallStats,
  getTopicBreakdown,
  getSubtopicBreakdown,
  getSubtopicStats,
  getTimeline,
  getSubtopicTimeline,
  getProblemsCount,
  getRecentAttemptsForSubtopic,
};
