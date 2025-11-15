const { AppError } = require('../middleware/errorHandler');
const { sendSuccess, sendPaginated } = require('../utils/response');
const problemModel = require('../models/problemModel');
const attemptModel = require('../models/attemptModel');
const progressModel = require('../models/progressModel');
const villageModel = require('../models/villageModel');
const streakModel = require('../models/streakModel');
const milestoneModel = require('../models/milestoneModel');
const villageHistoryModel = require('../models/villageHistoryModel');
const analyticsCache = require('../utils/analyticsCache');

const submitAnswer = async (req, res, next) => {
  try {
    const { id: problemId } = req.params;
    const { answer, time_taken } = req.body;
    const userId = req.user.userId;

    if (!answer) {
      throw new AppError('Answer is required', 400);
    }

    const problem = await problemModel.getProblemById(problemId);

    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    const normalizedUserAnswer = answer.trim().toUpperCase();
    const normalizedCorrectAnswer = problem.correct_answer.trim().toUpperCase();
    const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

    const timeTaken = time_taken ? parseInt(time_taken, 10) : null;

    const attempt = await attemptModel.createAttempt({
      userId,
      problemId,
      userAnswer: normalizedUserAnswer,
      isCorrect,
      timeTaken,
    });

    await progressModel.getOrCreateProgress(userId, problem.subtopic_id);
    await progressModel.updateProgress(userId, problem.subtopic_id);

    const villageRewards = await updateVillageOnCompletion(userId, problem, isCorrect, timeTaken);

    const feedback = {
      attempt_id: attempt.id,
      is_correct: isCorrect,
      correct_answer: problem.correct_answer,
      explanation: problem.explanation,
      user_answer: normalizedUserAnswer,
      time_taken: timeTaken,
      problem: {
        id: problem.id,
        question_text: problem.question_text,
        options: problem.options,
        difficulty_level: problem.difficulty_level,
        subtopic_name: problem.subtopic_name,
        major_topic_name: problem.major_topic_name,
      },
      village_rewards: villageRewards,
    };

    analyticsCache.invalidateUser(userId);

    sendSuccess(res, feedback, 201, isCorrect ? 'Correct answer!' : 'Incorrect answer');
  } catch (error) {
    next(error);
  }
};

const updateVillageOnCompletion = async (userId, problem, isCorrect, timeTaken) => {
  try {
    const rewards = {
      resources: { gold: 0, gems: 0, wood: 0 },
      experience: 0,
      milestones: [],
      streak_updated: false,
      health_change: 0,
    };

    const difficultyMultipliers = {
      easy: 1,
      medium: 1.5,
      hard: 2,
    };

    const multiplier = difficultyMultipliers[problem.difficulty_level] || 1;

    if (isCorrect) {
      rewards.resources.gold = Math.round(10 * multiplier);
      rewards.resources.wood = Math.round(2 * multiplier);
      rewards.experience = Math.round(20 * multiplier);

      if (timeTaken && timeTaken < 120) {
        rewards.resources.gold += 5;
        rewards.experience += 10;
      }
    } else {
      rewards.resources.gold = Math.round(2 * multiplier);
      rewards.experience = Math.round(5 * multiplier);
    }

    await villageModel.addResources(userId, rewards.resources);
    await villageModel.addExperience(userId, rewards.experience);

    const streak = await streakModel.updateStreak(userId);
    rewards.streak_updated = true;
    rewards.current_streak = streak.current_streak;

    if (streak.current_streak > 0 && streak.current_streak % 7 === 0) {
      const streakBonus = {
        gold: streak.current_streak * 2,
        gems: Math.floor(streak.current_streak / 7),
        wood: streak.current_streak,
      };
      await villageModel.addResources(userId, streakBonus);
      rewards.resources.gold += streakBonus.gold;
      rewards.resources.gems += streakBonus.gems;
      rewards.resources.wood += streakBonus.wood;
    }

    const newMilestones = await milestoneModel.checkAndAwardMilestones(userId);
    rewards.milestones = newMilestones;

    for (const milestone of newMilestones) {
      if (milestone.reward_resources) {
        await villageModel.addResources(userId, milestone.reward_resources);
      }
      if (milestone.reward_experience) {
        await villageModel.addExperience(userId, milestone.reward_experience);
      }
    }

    const newHealth = await villageModel.calculateVillageHealth(userId);
    const village = await villageModel.getOrCreateVillageState(userId);
    rewards.health_change = newHealth - (village.village_health || 0);
    
    if (rewards.health_change !== 0) {
      await villageModel.updateVillageState(userId, { village_health: newHealth });
    }

    await villageHistoryModel.logVillageEvent(
      userId,
      'problem_completed',
      `Completed ${problem.difficulty_level} problem: ${isCorrect ? 'correct' : 'incorrect'}`,
      {
        problem_id: problem.id,
        is_correct: isCorrect,
        rewards: rewards.resources,
        experience: rewards.experience,
      }
    );

    return rewards;
  } catch (error) {
    console.error('Error updating village on completion:', error);
    return {
      resources: { gold: 0, gems: 0, wood: 0 },
      experience: 0,
      milestones: [],
      streak_updated: false,
      health_change: 0,
    };
  }
};

const getAttemptHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page = 1, page_size = 20 } = req.query;

    const pageNum = parseInt(page, 10);
    const pageSize = parseInt(page_size, 10);

    if (pageNum < 1 || pageSize < 1 || pageSize > 100) {
      throw new AppError('Invalid pagination parameters', 400);
    }

    const offset = (pageNum - 1) * pageSize;

    const attempts = await attemptModel.getUserAttempts({
      userId,
      limit: pageSize,
      offset,
    });

    const total = await attemptModel.countUserAttempts(userId);

    sendPaginated(res, attempts, total, pageNum, pageSize);
  } catch (error) {
    next(error);
  }
};

const getSubtopicAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { subtopicId } = req.params;

    const analytics = await attemptModel.getSubtopicAnalytics(userId, subtopicId);
    const progress = await progressModel.getProgressBySubtopic(userId, subtopicId);

    const data = {
      subtopic_id: subtopicId,
      subtopic_name: progress?.subtopic_name || null,
      major_topic_name: progress?.major_topic_name || null,
      analytics,
      progress: progress || null,
    };

    sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

const getAllAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const analytics = await attemptModel.getAllSubtopicsAnalytics(userId);
    const progress = await progressModel.getUserProgress(userId);

    const data = {
      subtopics: analytics,
      progress,
      summary: {
        total_attempts: analytics.reduce((sum, a) => sum + a.total_attempts, 0),
        total_correct: analytics.reduce((sum, a) => sum + a.correct_attempts, 0),
        overall_accuracy: calculateOverallAccuracy(analytics),
        subtopics_started: analytics.filter(a => a.total_attempts > 0).length,
      },
    };

    sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

const calculateOverallAccuracy = (analytics) => {
  const totalAttempts = analytics.reduce((sum, a) => sum + a.total_attempts, 0);
  const totalCorrect = analytics.reduce((sum, a) => sum + a.correct_attempts, 0);
  
  if (totalAttempts === 0) return 0;
  
  return parseFloat(((totalCorrect / totalAttempts) * 100).toFixed(2));
};

module.exports = {
  submitAnswer,
  getAttemptHistory,
  getSubtopicAnalytics,
  getAllAnalytics,
};
