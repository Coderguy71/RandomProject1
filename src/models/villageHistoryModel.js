const { query } = require('../utils/database');

/**
 * Log a village event
 */
const logVillageEvent = async (userId, eventType, eventDescription, changes, villageStateSnapshot = null) => {
  const result = await query(
    `INSERT INTO village_history (user_id, event_type, event_description, changes, village_state_snapshot)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_id, event_type, event_description, changes, village_state_snapshot, created_at`,
    [userId, eventType, eventDescription, JSON.stringify(changes), villageStateSnapshot ? JSON.stringify(villageStateSnapshot) : null]
  );

  return result.rows[0];
};

/**
 * Get user's village history
 */
const getVillageHistory = async (userId, limit = 50, offset = 0) => {
  const result = await query(
    `SELECT 
      id,
      user_id,
      event_type,
      event_description,
      changes,
      village_state_snapshot,
      created_at
    FROM village_history
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return result.rows;
};

/**
 * Count user's village history events
 */
const countVillageHistory = async (userId) => {
  const result = await query(
    `SELECT COUNT(*) as total
    FROM village_history
    WHERE user_id = $1`,
    [userId]
  );

  return parseInt(result.rows[0].total, 10);
};

/**
 * Get village history by event type
 */
const getVillageHistoryByType = async (userId, eventType, limit = 20) => {
  const result = await query(
    `SELECT 
      id,
      user_id,
      event_type,
      event_description,
      changes,
      village_state_snapshot,
      created_at
    FROM village_history
    WHERE user_id = $1 AND event_type = $2
    ORDER BY created_at DESC
    LIMIT $3`,
    [userId, eventType, limit]
  );

  return result.rows;
};

/**
 * Get recent village activity summary
 */
const getRecentActivitySummary = async (userId, days = 7) => {
  const result = await query(
    `SELECT 
      event_type,
      COUNT(*) as count,
      MAX(created_at) as last_occurrence
    FROM village_history
    WHERE user_id = $1 AND created_at > NOW() - INTERVAL '${days} days'
    GROUP BY event_type
    ORDER BY count DESC`,
    [userId]
  );

  return result.rows;
};

module.exports = {
  logVillageEvent,
  getVillageHistory,
  countVillageHistory,
  getVillageHistoryByType,
  getRecentActivitySummary,
};
