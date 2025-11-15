const { query } = require('../utils/database');

/**
 * Get or create streak record for a user
 */
const getOrCreateStreak = async (userId) => {
  const existing = await query(
    `SELECT 
      id,
      user_id,
      current_streak,
      longest_streak,
      last_practice_date,
      streak_frozen,
      freeze_count,
      created_at,
      updated_at
    FROM daily_streaks
    WHERE user_id = $1`,
    [userId]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  const newStreak = await query(
    `INSERT INTO daily_streaks (user_id, current_streak, longest_streak)
     VALUES ($1, 0, 0)
     RETURNING id, user_id, current_streak, longest_streak, last_practice_date,
               streak_frozen, freeze_count, created_at, updated_at`,
    [userId]
  );

  return newStreak.rows[0];
};

/**
 * Update streak based on practice activity
 */
const updateStreak = async (userId) => {
  const streak = await getOrCreateStreak(userId);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastPracticeDate = streak.last_practice_date ? new Date(streak.last_practice_date) : null;
  if (lastPracticeDate) {
    lastPracticeDate.setHours(0, 0, 0, 0);
  }

  let newStreak = streak.current_streak;
  let newLongest = streak.longest_streak;

  if (!lastPracticeDate) {
    newStreak = 1;
  } else {
    const daysDiff = Math.floor((today - lastPracticeDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      return streak;
    } else if (daysDiff === 1) {
      newStreak += 1;
    } else if (daysDiff > 1 && !streak.streak_frozen) {
      newStreak = 1;
    } else if (streak.streak_frozen) {
      newStreak += 1;
    }
  }

  newLongest = Math.max(newLongest, newStreak);

  const result = await query(
    `UPDATE daily_streaks
     SET current_streak = $1,
         longest_streak = $2,
         last_practice_date = CURRENT_DATE,
         streak_frozen = false
     WHERE user_id = $3
     RETURNING id, user_id, current_streak, longest_streak, last_practice_date,
               streak_frozen, freeze_count, created_at, updated_at`,
    [newStreak, newLongest, userId]
  );

  return result.rows[0];
};

/**
 * Get streak statistics for a user
 */
const getStreakStats = async (userId) => {
  const streak = await getOrCreateStreak(userId);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastPracticeDate = streak.last_practice_date ? new Date(streak.last_practice_date) : null;
  let isPracticedToday = false;
  
  if (lastPracticeDate) {
    lastPracticeDate.setHours(0, 0, 0, 0);
    isPracticedToday = lastPracticeDate.getTime() === today.getTime();
  }

  return {
    ...streak,
    is_practiced_today: isPracticedToday,
  };
};

/**
 * Freeze streak (prevents streak loss for one day)
 */
const freezeStreak = async (userId) => {
  const streak = await getOrCreateStreak(userId);
  
  if (streak.streak_frozen) {
    throw new Error('Streak is already frozen');
  }

  const result = await query(
    `UPDATE daily_streaks
     SET streak_frozen = true,
         freeze_count = freeze_count + 1
     WHERE user_id = $1
     RETURNING id, user_id, current_streak, longest_streak, last_practice_date,
               streak_frozen, freeze_count, created_at, updated_at`,
    [userId]
  );

  return result.rows[0];
};

module.exports = {
  getOrCreateStreak,
  updateStreak,
  getStreakStats,
  freezeStreak,
};
