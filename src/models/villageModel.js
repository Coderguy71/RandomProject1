const { query } = require('../utils/database');

/**
 * Get or create village state for a user
 */
const getOrCreateVillageState = async (userId) => {
  const existing = await query(
    `SELECT 
      id,
      user_id,
      village_health,
      village_happiness,
      village_level,
      experience_points,
      resources,
      decorations,
      total_resources_earned,
      total_resources_spent,
      last_updated,
      created_at,
      updated_at
    FROM village_state
    WHERE user_id = $1`,
    [userId]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  const newVillage = await query(
    `INSERT INTO village_state (
      user_id,
      village_health,
      village_happiness,
      village_level,
      experience_points,
      resources,
      decorations,
      total_resources_earned,
      total_resources_spent
    )
    VALUES ($1, 100, 100, 1, 0, 
      '{"gold": 100, "gems": 10, "wood": 20}'::jsonb,
      '[]'::jsonb,
      '{"gold": 0, "gems": 0, "wood": 0}'::jsonb,
      '{"gold": 0, "gems": 0, "wood": 0}'::jsonb
    )
    RETURNING 
      id, user_id, village_health, village_happiness, village_level,
      experience_points, resources, decorations, total_resources_earned,
      total_resources_spent, last_updated, created_at, updated_at`,
    [userId]
  );

  return newVillage.rows[0];
};

/**
 * Update village state
 */
const updateVillageState = async (userId, updates) => {
  const setClauses = [];
  const values = [];
  let paramIndex = 1;

  if (updates.village_health !== undefined) {
    setClauses.push(`village_health = $${paramIndex++}`);
    values.push(updates.village_health);
  }

  if (updates.village_happiness !== undefined) {
    setClauses.push(`village_happiness = $${paramIndex++}`);
    values.push(updates.village_happiness);
  }

  if (updates.village_level !== undefined) {
    setClauses.push(`village_level = $${paramIndex++}`);
    values.push(updates.village_level);
  }

  if (updates.experience_points !== undefined) {
    setClauses.push(`experience_points = $${paramIndex++}`);
    values.push(updates.experience_points);
  }

  if (updates.resources !== undefined) {
    setClauses.push(`resources = $${paramIndex++}`);
    values.push(JSON.stringify(updates.resources));
  }

  if (updates.decorations !== undefined) {
    setClauses.push(`decorations = $${paramIndex++}`);
    values.push(JSON.stringify(updates.decorations));
  }

  if (updates.total_resources_earned !== undefined) {
    setClauses.push(`total_resources_earned = $${paramIndex++}`);
    values.push(JSON.stringify(updates.total_resources_earned));
  }

  if (updates.total_resources_spent !== undefined) {
    setClauses.push(`total_resources_spent = $${paramIndex++}`);
    values.push(JSON.stringify(updates.total_resources_spent));
  }

  setClauses.push(`last_updated = NOW()`);

  values.push(userId);

  const result = await query(
    `UPDATE village_state
     SET ${setClauses.join(', ')}
     WHERE user_id = $${paramIndex}
     RETURNING 
       id, user_id, village_health, village_happiness, village_level,
       experience_points, resources, decorations, total_resources_earned,
       total_resources_spent, last_updated, created_at, updated_at`,
    values
  );

  return result.rows[0];
};

/**
 * Add resources to village
 */
const addResources = async (userId, resourcesToAdd) => {
  const village = await getOrCreateVillageState(userId);
  
  const currentResources = village.resources || { gold: 0, gems: 0, wood: 0 };
  const totalEarned = village.total_resources_earned || { gold: 0, gems: 0, wood: 0 };
  
  const newResources = {
    gold: (currentResources.gold || 0) + (resourcesToAdd.gold || 0),
    gems: (currentResources.gems || 0) + (resourcesToAdd.gems || 0),
    wood: (currentResources.wood || 0) + (resourcesToAdd.wood || 0),
  };

  const newTotalEarned = {
    gold: (totalEarned.gold || 0) + (resourcesToAdd.gold || 0),
    gems: (totalEarned.gems || 0) + (resourcesToAdd.gems || 0),
    wood: (totalEarned.wood || 0) + (resourcesToAdd.wood || 0),
  };

  return updateVillageState(userId, {
    resources: newResources,
    total_resources_earned: newTotalEarned,
  });
};

/**
 * Spend resources from village
 */
const spendResources = async (userId, resourcesToSpend) => {
  const village = await getOrCreateVillageState(userId);
  
  const currentResources = village.resources || { gold: 0, gems: 0, wood: 0 };
  const totalSpent = village.total_resources_spent || { gold: 0, gems: 0, wood: 0 };

  if (
    (currentResources.gold || 0) < (resourcesToSpend.gold || 0) ||
    (currentResources.gems || 0) < (resourcesToSpend.gems || 0) ||
    (currentResources.wood || 0) < (resourcesToSpend.wood || 0)
  ) {
    throw new Error('Insufficient resources');
  }

  const newResources = {
    gold: (currentResources.gold || 0) - (resourcesToSpend.gold || 0),
    gems: (currentResources.gems || 0) - (resourcesToSpend.gems || 0),
    wood: (currentResources.wood || 0) - (resourcesToSpend.wood || 0),
  };

  const newTotalSpent = {
    gold: (totalSpent.gold || 0) + (resourcesToSpend.gold || 0),
    gems: (totalSpent.gems || 0) + (resourcesToSpend.gems || 0),
    wood: (totalSpent.wood || 0) + (resourcesToSpend.wood || 0),
  };

  return updateVillageState(userId, {
    resources: newResources,
    total_resources_spent: newTotalSpent,
  });
};

/**
 * Add experience points and level up if needed
 */
const addExperience = async (userId, experienceToAdd) => {
  const village = await getOrCreateVillageState(userId);
  
  let newExp = (village.experience_points || 0) + experienceToAdd;
  let newLevel = village.village_level || 1;

  const expForNextLevel = newLevel * 100;
  
  while (newExp >= expForNextLevel) {
    newExp -= expForNextLevel;
    newLevel += 1;
  }

  return updateVillageState(userId, {
    experience_points: newExp,
    village_level: newLevel,
  });
};

/**
 * Calculate village health based on user progress
 */
const calculateVillageHealth = async (userId) => {
  const statsResult = await query(
    `SELECT 
      COALESCE(AVG(CASE WHEN ua.created_at > NOW() - INTERVAL '7 days' 
        THEN CASE WHEN ua.is_correct THEN 100 ELSE 0 END 
      END), 0) as recent_accuracy,
      COUNT(DISTINCT CASE WHEN ua.created_at > NOW() - INTERVAL '7 days' 
        THEN ua.problem_id END) as recent_problems,
      COALESCE(ds.current_streak, 0) as current_streak
    FROM users u
    LEFT JOIN user_attempts ua ON u.id = ua.user_id
    LEFT JOIN daily_streaks ds ON u.id = ds.user_id
    WHERE u.id = $1
    GROUP BY ds.current_streak`,
    [userId]
  );

  const stats = statsResult.rows[0];
  const recentAccuracy = parseFloat(stats.recent_accuracy) || 0;
  const recentProblems = parseInt(stats.recent_problems, 10) || 0;
  const currentStreak = parseInt(stats.current_streak, 10) || 0;

  let health = 50;
  
  health += Math.min(recentAccuracy * 0.3, 30);
  
  health += Math.min(recentProblems * 2, 10);
  
  health += Math.min(currentStreak, 10);

  health = Math.max(0, Math.min(100, Math.round(health)));

  return health;
};

module.exports = {
  getOrCreateVillageState,
  updateVillageState,
  addResources,
  spendResources,
  addExperience,
  calculateVillageHealth,
};
