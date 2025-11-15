const { query } = require('../utils/database');

// Performance threshold constants
const PERFORMANCE_THRESHOLDS = {
  MASTERY: 80, // 80% accuracy = move forward
  PROFICIENCY: 60, // 60-80% = needs more practice
  STRUGGLING: 40, // 40-60% = needs review
  CRITICAL: 40 // <40% = needs intervention
};

// Recommendation types
const RECOMMENDATION_TYPES = {
  NEXT_TOPIC: 'next_topic',
  REVIEW: 'review',
  PRACTICE: 'practice',
  CHALLENGE: 'challenge'
};

// Priority levels (1=highest, 5=lowest)
const PRIORITY = {
  CRITICAL: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
  LOWEST: 5
};

const analyzeUserPerformance = async (userId, limit = 20) => {
  const result = await query(
    `SELECT 
      s.id as subtopic_id,
      s.name as subtopic_name,
      s.order_index,
      mt.id as major_topic_id,
      mt.name as major_topic_name,
      COUNT(ua.id) as total_attempts,
      SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END) as correct_attempts,
      AVG(ua.time_taken) as avg_time_taken,
      COUNT(DISTINCT ua.problem_id) as unique_problems_attempted,
      MAX(ua.created_at) as last_attempt_at
    FROM user_attempts ua
    JOIN practice_problems pp ON ua.problem_id = pp.id
    JOIN subtopics s ON pp.subtopic_id = s.id
    JOIN major_topics mt ON s.major_topic_id = mt.id
    WHERE ua.user_id = $1
      AND ua.created_at >= NOW() - INTERVAL '30 days'
    GROUP BY s.id, s.name, s.order_index, mt.id, mt.name
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
      major_topic_id: row.major_topic_id,
      major_topic_name: row.major_topic_name,
      order_index: row.order_index,
      total_attempts: totalAttempts,
      correct_attempts: correctAttempts,
      accuracy_rate: parseFloat(accuracyRate.toFixed(2)),
      avg_time_taken: row.avg_time_taken ? parseFloat(row.avg_time_taken).toFixed(2) : null,
      unique_problems_attempted: parseInt(row.unique_problems_attempted, 10),
      last_attempt_at: row.last_attempt_at,
      performance_level: getPerformanceLevel(accuracyRate),
      needs_review: accuracyRate < PERFORMANCE_THRESHOLDS.PROFICIENCY && totalAttempts >= 3
    };
  });
};

const getPerformanceLevel = (accuracyRate) => {
  if (accuracyRate >= PERFORMANCE_THRESHOLDS.MASTERY) return 'mastered';
  if (accuracyRate >= PERFORMANCE_THRESHOLDS.PROFICIENCY) return 'proficient';
  if (accuracyRate >= PERFORMANCE_THRESHOLDS.STRUGGLING) return 'struggling';
  return 'critical';
};

const calculateEngagementScore = async (userId) => {
  const result = await query(
    `SELECT 
      COUNT(DISTINCT DATE(ua.created_at)) as active_days,
      COUNT(ua.id) as total_attempts,
      AVG(ua.time_taken) as avg_time_per_problem,
      MAX(ua.created_at) as last_activity
    FROM user_attempts ua
    WHERE ua.user_id = $1
      AND ua.created_at >= NOW() - INTERVAL '14 days'`,
    [userId]
  );

  if (result.rows.length === 0) return 0;

  const { active_days, total_attempts, avg_time_per_problem, last_activity } = result.rows[0];
  
  let engagementScore = 0;
  
  // Activity frequency (40% of score)
  engagementScore += Math.min((active_days / 14) * 40, 40);
  
  // Attempt volume (30% of score)
  engagementScore += Math.min((total_attempts / 50) * 30, 30);
  
  // Recency (20% of score)
  const daysSinceLastActivity = last_activity ? 
    Math.max(0, 14 - (new Date() - new Date(last_activity)) / (1000 * 60 * 60 * 24)) / 14 : 0;
  engagementScore += daysSinceLastActivity * 20;
  
  // Time per problem (10% of score) - lower is better
  if (avg_time_per_problem) {
    const timeScore = Math.max(0, 10 - (avg_time_per_problem / 60)); // Convert to minutes
    engagementScore += Math.max(0, timeScore);
  }

  return parseFloat(engagementScore.toFixed(2));
};

const getAllSubtopics = async () => {
  const result = await query(
    `SELECT 
      s.id,
      s.name,
      s.order_index,
      s.major_topic_id,
      mt.name as major_topic_name,
      COUNT(pp.id) as total_problems
    FROM subtopics s
    JOIN major_topics mt ON s.major_topic_id = mt.id
    LEFT JOIN practice_problems pp ON s.id = pp.subtopic_id
    GROUP BY s.id, s.name, s.order_index, s.major_topic_id, mt.name
    ORDER BY mt.name, s.order_index`
  );

  return result.rows;
};

const generateRecommendations = async (userId) => {
  // Get user performance data
  const performance = await analyzeUserPerformance(userId);
  const allSubtopics = await getAllSubtopics();
  const engagementScore = await calculateEngagementScore(userId);

  // Clear existing recommendations
  await query('DELETE FROM learning_path_recommendations WHERE user_id = $1', [userId]);

  const recommendations = [];
  const attemptedSubtopicIds = new Set(performance.map(p => p.subtopic_id));

  // 1. Identify critical areas that need immediate review
  const criticalAreas = performance
    .filter(p => p.performance_level === 'critical' && p.total_attempts >= 3)
    .sort((a, b) => a.accuracy_rate - b.accuracy_rate);

  criticalAreas.forEach((area, index) => {
    recommendations.push({
      user_id: userId,
      subtopic_id: area.subtopic_id,
      recommendation_type: RECOMMENDATION_TYPES.REVIEW,
      priority: PRIORITY.CRITICAL,
      difficulty_level: 'easy',
      reason: `Critical review needed: ${area.accuracy_rate}% accuracy in ${area.subtopic_name}`
    });
  });

  // 2. Identify struggling areas
  const strugglingAreas = performance
    .filter(p => p.performance_level === 'struggling' && p.total_attempts >= 3)
    .sort((a, b) => a.accuracy_rate - b.accuracy_rate);

  strugglingAreas.forEach((area, index) => {
    recommendations.push({
      user_id: userId,
      subtopic_id: area.subtopic_id,
      recommendation_type: RECOMMENDATION_TYPES.PRACTICE,
      priority: PRIORITY.HIGH,
      difficulty_level: 'easy',
      reason: `Additional practice needed: ${area.accuracy_rate}% accuracy in ${area.subtopic_name}`
    });
  });

  // 3. Find next unattempted subtopics in logical order
  const unattemptedSubtopics = allSubtopics.filter(s => !attemptedSubtopicIds.has(s.id));
  
  // Group by major topic and find the first unattempted in each
  const majorTopics = {};
  unattemptedSubtopics.forEach(subtopic => {
    if (!majorTopics[subtopic.major_topic_id]) {
      majorTopics[subtopic.major_topic_id] = [];
    }
    majorTopics[subtopic.major_topic_id].push(subtopic);
  });

  // For each major topic, recommend the first unattempted subtopic
  Object.values(majorTopics).forEach(subtopics => {
    subtopics.sort((a, b) => a.order_index - b.order_index);
    const nextSubtopic = subtopics[0];
    if (nextSubtopic) {
      recommendations.push({
        user_id: userId,
        subtopic_id: nextSubtopic.id,
        recommendation_type: RECOMMENDATION_TYPES.NEXT_TOPIC,
        priority: PRIORITY.MEDIUM,
        difficulty_level: engagementScore > 70 ? 'medium' : 'easy',
        reason: `Next topic to explore: ${nextSubtopic.name}`
      });
    }
  });

  // 4. Challenge problems for mastered topics
  const masteredAreas = performance.filter(p => p.performance_level === 'mastered');
  if (masteredAreas.length > 0 && engagementScore > 80) {
    masteredAreas.forEach(area => {
      recommendations.push({
        user_id: userId,
        subtopic_id: area.subtopic_id,
        recommendation_type: RECOMMENDATION_TYPES.CHALLENGE,
        priority: PRIORITY.LOW,
        difficulty_level: 'hard',
        reason: `Challenge problems for mastered topic: ${area.subtopic_name}`
      });
    });
  }

  // Insert recommendations into database
  for (const rec of recommendations) {
    await query(
      `INSERT INTO learning_path_recommendations 
       (user_id, subtopic_id, recommendation_type, priority, difficulty_level, reason)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [rec.user_id, rec.subtopic_id, rec.recommendation_type, rec.priority, rec.difficulty_level, rec.reason]
    );
  }

  return recommendations;
};

const getUserRecommendations = async (userId, limit = 10) => {
  const result = await query(
    `SELECT 
      lpr.id,
      lpr.recommendation_type,
      lpr.priority,
      lpr.difficulty_level,
      lpr.reason,
      lpr.is_completed,
      lpr.created_at,
      s.id as subtopic_id,
      s.name as subtopic_name,
      mt.name as major_topic_name
    FROM learning_path_recommendations lpr
    JOIN subtopics s ON lpr.subtopic_id = s.id
    JOIN major_topics mt ON s.major_topic_id = mt.id
    WHERE lpr.user_id = $1 AND lpr.is_completed = false
    ORDER BY lpr.priority, lpr.created_at
    LIMIT $2`,
    [userId, limit]
  );

  return result.rows;
};

const updateLearningPathProgress = async (userId) => {
  const performance = await analyzeUserPerformance(userId);
  const engagementScore = await calculateEngagementScore(userId);

  // Get major topics
  const majorTopicsResult = await query(
    `SELECT DISTINCT major_topic_id FROM subtopics`
  );

  for (const majorTopic of majorTopicsResult.rows) {
    const majorTopicId = majorTopic.major_topic_id;
    const topicPerformance = performance.filter(p => p.major_topic_id === majorTopicId);
    
    const totalSubtopics = await query(
      `SELECT COUNT(*) as count FROM subtopics WHERE major_topic_id = $1`,
      [majorTopicId]
    );

    const completedSubtopics = topicPerformance.filter(p => p.accuracy_rate >= PERFORMANCE_THRESHOLDS.MASTERY);
    const masteryLevel = topicPerformance.length > 0 ? 
      (completedSubtopics.length / topicPerformance.length) * 100 : 0;

    // Upsert learning path progress
    await query(
      `INSERT INTO learning_path_progress 
       (user_id, major_topic_id, mastery_level, subtopics_completed, total_subtopics, engagement_score, last_recommendation_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (user_id, major_topic_id) 
       DO UPDATE SET 
         mastery_level = EXCLUDED.mastery_level,
         subtopics_completed = EXCLUDED.subtopics_completed,
         total_subtopics = EXCLUDED.total_subtopics,
         engagement_score = EXCLUDED.engagement_score,
         last_recommendation_at = EXCLUDED.last_recommendation_at,
         updated_at = CURRENT_TIMESTAMP`,
      [userId, majorTopicId, masteryLevel, completedSubtopics.length, parseInt(totalSubtopics.rows[0].count), engagementScore]
    );
  }
};

const getLearningPathProgress = async (userId) => {
  const result = await query(
    `SELECT 
      lpp.*,
      mt.name as major_topic_name
    FROM learning_path_progress lpp
    JOIN major_topics mt ON lpp.major_topic_id = mt.id
    WHERE lpp.user_id = $1
    ORDER BY mt.name`,
    [userId]
  );

  return result.rows;
};

const markRecommendationCompleted = async (userId, recommendationId) => {
  const result = await query(
    `UPDATE learning_path_recommendations 
     SET is_completed = true, completed_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [recommendationId, userId]
  );

  return result.rows[0];
};

module.exports = {
  PERFORMANCE_THRESHOLDS,
  RECOMMENDATION_TYPES,
  PRIORITY,
  analyzeUserPerformance,
  calculateEngagementScore,
  generateRecommendations,
  getUserRecommendations,
  updateLearningPathProgress,
  getLearningPathProgress,
  markRecommendationCompleted,
  getPerformanceLevel
};