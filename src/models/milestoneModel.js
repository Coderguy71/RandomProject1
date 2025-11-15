const { query } = require('../utils/database');

/**
 * Get all active milestones
 */
const getAllMilestones = async (filters = {}) => {
  let whereClause = 'WHERE is_active = true';
  const values = [];
  let paramIndex = 1;

  if (filters.milestone_type) {
    whereClause += ` AND milestone_type = $${paramIndex++}`;
    values.push(filters.milestone_type);
  }

  const result = await query(
    `SELECT 
      id,
      name,
      description,
      milestone_type,
      requirement_criteria,
      reward_resources,
      reward_experience,
      icon_url,
      created_at
    FROM milestones
    ${whereClause}
    ORDER BY milestone_type, created_at`,
    values
  );

  return result.rows;
};

/**
 * Get milestone by ID
 */
const getMilestoneById = async (milestoneId) => {
  const result = await query(
    `SELECT 
      id,
      name,
      description,
      milestone_type,
      requirement_criteria,
      reward_resources,
      reward_experience,
      icon_url,
      is_active,
      created_at,
      updated_at
    FROM milestones
    WHERE id = $1`,
    [milestoneId]
  );

  return result.rows[0];
};

/**
 * Get user's achieved milestones
 */
const getUserMilestones = async (userId) => {
  const result = await query(
    `SELECT 
      um.id,
      um.user_id,
      um.milestone_id,
      um.achieved_at,
      um.progress,
      m.name,
      m.description,
      m.milestone_type,
      m.requirement_criteria,
      m.reward_resources,
      m.reward_experience,
      m.icon_url
    FROM user_milestones um
    JOIN milestones m ON um.milestone_id = m.id
    WHERE um.user_id = $1
    ORDER BY um.achieved_at DESC`,
    [userId]
  );

  return result.rows;
};

/**
 * Check if user has achieved a milestone
 */
const userHasMilestone = async (userId, milestoneId) => {
  const result = await query(
    `SELECT id, achieved_at
    FROM user_milestones
    WHERE user_id = $1 AND milestone_id = $2`,
    [userId, milestoneId]
  );

  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Award milestone to user
 */
const awardMilestone = async (userId, milestoneId, progress = {}) => {
  const existing = await userHasMilestone(userId, milestoneId);

  if (existing) {
    return existing;
  }

  const result = await query(
    `INSERT INTO user_milestones (user_id, milestone_id, progress)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, milestone_id, achieved_at, progress`,
    [userId, milestoneId, JSON.stringify(progress)]
  );

  return result.rows[0];
};

/**
 * Check and award eligible milestones for a user
 */
const checkAndAwardMilestones = async (userId) => {
  const stats = await getUserStats(userId);
  
  const allMilestones = await getAllMilestones();
  const achievedMilestones = await getUserMilestones(userId);
  const achievedIds = new Set(achievedMilestones.map(m => m.milestone_id));

  const newlyAwarded = [];

  for (const milestone of allMilestones) {
    if (achievedIds.has(milestone.id)) {
      continue;
    }

    if (checkMilestoneRequirement(stats, milestone.requirement_criteria)) {
      const awarded = await awardMilestone(userId, milestone.id, stats);
      newlyAwarded.push({
        ...awarded,
        milestone_name: milestone.name,
        milestone_description: milestone.description,
        reward_resources: milestone.reward_resources,
        reward_experience: milestone.reward_experience,
      });
    }
  }

  return newlyAwarded;
};

/**
 * Get user statistics for milestone checking
 */
const getUserStats = async (userId) => {
  const result = await query(
    `SELECT 
      COUNT(DISTINCT ua.problem_id) as problems_completed,
      COALESCE(AVG(CASE WHEN ua.is_correct THEN 100 ELSE 0 END), 0) as accuracy_rate,
      COALESCE(ds.current_streak, 0) as streak_days,
      COUNT(DISTINCT pp.subtopic_id) as subtopics_completed,
      COUNT(CASE WHEN ua.time_taken IS NOT NULL AND ua.time_taken < 120 THEN 1 END) as fast_completions
    FROM users u
    LEFT JOIN user_attempts ua ON u.id = ua.user_id
    LEFT JOIN practice_problems pp ON ua.problem_id = pp.id
    LEFT JOIN daily_streaks ds ON u.id = ds.user_id
    WHERE u.id = $1
    GROUP BY ds.current_streak`,
    [userId]
  );

  if (result.rows.length === 0) {
    return {
      problems_completed: 0,
      accuracy_rate: 0,
      streak_days: 0,
      subtopics_completed: 0,
      fast_completions: 0,
    };
  }

  const stats = result.rows[0];
  return {
    problems_completed: parseInt(stats.problems_completed, 10) || 0,
    accuracy_rate: parseFloat(stats.accuracy_rate) || 0,
    streak_days: parseInt(stats.streak_days, 10) || 0,
    subtopics_completed: parseInt(stats.subtopics_completed, 10) || 0,
    fast_completions: parseInt(stats.fast_completions, 10) || 0,
  };
};

/**
 * Check if user meets milestone requirement
 */
const checkMilestoneRequirement = (userStats, requirement) => {
  for (const [key, requiredValue] of Object.entries(requirement)) {
    const userValue = userStats[key] || 0;
    if (userValue < requiredValue) {
      return false;
    }
  }
  return true;
};

/**
 * Get milestones with user progress
 */
const getMilestonesWithProgress = async (userId) => {
  const allMilestones = await getAllMilestones();
  const achievedMilestones = await getUserMilestones(userId);
  const userStats = await getUserStats(userId);

  const achievedMap = new Map(achievedMilestones.map(m => [m.milestone_id, m]));

  return allMilestones.map(milestone => {
    const achieved = achievedMap.get(milestone.id);
    
    if (achieved) {
      return {
        ...milestone,
        achieved: true,
        achieved_at: achieved.achieved_at,
        progress: userStats,
      };
    }

    return {
      ...milestone,
      achieved: false,
      achieved_at: null,
      progress: userStats,
    };
  });
};

module.exports = {
  getAllMilestones,
  getMilestoneById,
  getUserMilestones,
  userHasMilestone,
  awardMilestone,
  checkAndAwardMilestones,
  getUserStats,
  getMilestonesWithProgress,
};
