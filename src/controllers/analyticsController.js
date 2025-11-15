const analyticsModel = require('../models/analyticsModel');
const progressModel = require('../models/progressModel');
const streakModel = require('../models/streakModel');
const { sendSuccess } = require('../utils/response');
const analyticsCache = require('../utils/analyticsCache');
const { AppError } = require('../middleware/errorHandler');

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DEFAULT_PROGRESS_DAYS = 30;
const DEFAULT_TREND_WINDOW = 7;
const DEFAULT_PREDICTION_LOOKBACK = 30;
const MASTERY_ACCURACY_THRESHOLD = 85;
const MASTERY_PROBLEM_THRESHOLD = 5;
const PROGRESS_ACCURACY_THRESHOLD = 60;
const PROGRESS_PROBLEM_THRESHOLD = 3;

const GOALS = {
  accuracyRate: 85,
  problemsPerWeek: 28,
  averageTimePerProblem: 120,
  consistencyRate: 65,
};

const toInt = (value, fallback = 0) => {
  if (value === null || value === undefined) {
    return fallback;
  }
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const toFloat = (value, fallback = null) => {
  if (value === null || value === undefined) {
    return fallback;
  }
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const ensureDate = (value) => {
  if (!value) {
    return null;
  }
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = ensureDate(value);
  return date ? date.toISOString() : null;
};

const computeAccuracy = (correct, total) => {
  if (!total || total <= 0) {
    return 0;
  }
  return parseFloat(((correct / total) * 100).toFixed(2));
};

const calculateTotalDays = (startDate, endDate) => {
  const start = ensureDate(startDate);
  const end = ensureDate(endDate);

  if (!start || !end) {
    return 0;
  }

  const diff = end.getTime() - start.getTime();

  if (diff < 0) {
    return 0;
  }

  return Math.floor(diff / MS_PER_DAY) + 1;
};

const parseDateRange = (query, defaultDays = null) => {
  const { start_date: startDateRaw, end_date: endDateRaw } = query;
  let startDate = startDateRaw ? ensureDate(startDateRaw) : null;
  let endDate = endDateRaw ? ensureDate(endDateRaw) : null;

  if (startDateRaw && !startDate) {
    throw new AppError('Invalid start_date', 400);
  }

  if (endDateRaw && !endDate) {
    throw new AppError('Invalid end_date', 400);
  }

  if (!startDate && !endDate && defaultDays) {
    endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    startDate = new Date(endDate.getTime() - (defaultDays - 1) * MS_PER_DAY);
    startDate.setHours(0, 0, 0, 0);
  }

  if (startDate && !endDate) {
    endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
  }

  if (!startDate && endDate && defaultDays) {
    startDate = new Date(endDate.getTime() - (defaultDays - 1) * MS_PER_DAY);
    startDate.setHours(0, 0, 0, 0);
  }

  if (startDate) {
    startDate.setHours(0, 0, 0, 0);
  }

  if (endDate) {
    endDate.setHours(23, 59, 59, 999);
  }

  if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
    throw new AppError('start_date must be before end_date', 400);
  }

  return { startDate, endDate };
};

const normalizeInterval = (value) => {
  if (!value) {
    return 'day';
  }

  const normalized = value.toLowerCase();

  if (normalized !== 'day' && normalized !== 'week') {
    throw new AppError('Invalid interval. Allowed values are day or week.', 400);
  }

  return normalized;
};

const buildTopicStatus = (progressRecords) => {
  const mastered = [];
  const inProgress = [];
  const weak = [];

  for (const record of progressRecords) {
    const accuracy = toFloat(record.accuracy_rate, 0);
    const completed = toInt(record.problems_completed, 0);
    const entry = {
      subtopicId: record.subtopic_id,
      subtopicName: record.subtopic_name,
      topicId: record.major_topic_id,
      topicName: record.major_topic_name,
      problemsCompleted: completed,
      accuracyRate: parseFloat(accuracy.toFixed(2)),
    };

    if (completed >= MASTERY_PROBLEM_THRESHOLD && accuracy >= MASTERY_ACCURACY_THRESHOLD) {
      mastered.push(entry);
    } else if (completed >= PROGRESS_PROBLEM_THRESHOLD && accuracy >= PROGRESS_ACCURACY_THRESHOLD) {
      inProgress.push(entry);
    } else {
      weak.push(entry);
    }
  }

  return {
    counts: {
      mastered: mastered.length,
      inProgress: inProgress.length,
      weak: weak.length,
    },
    topics: {
      mastered,
      inProgress,
      weak,
    },
    thresholds: {
      mastery: {
        accuracy: MASTERY_ACCURACY_THRESHOLD,
        problems: MASTERY_PROBLEM_THRESHOLD,
      },
      progress: {
        accuracy: PROGRESS_ACCURACY_THRESHOLD,
        problems: PROGRESS_PROBLEM_THRESHOLD,
      },
    },
  };
};

const buildTimelinePoints = (rows, interval = 'day') => {
  let cumulativeAttempts = 0;
  let cumulativeCorrect = 0;

  return rows.map((row) => {
    const attempts = toInt(row.total_attempts, 0);
    const correct = toInt(row.correct_attempts, 0);
    const avgTime = row.avg_time_taken !== null && row.avg_time_taken !== undefined
      ? parseFloat(parseFloat(row.avg_time_taken).toFixed(2))
      : null;
    const totalTime = toInt(row.total_time_taken, 0);

    cumulativeAttempts += attempts;
    cumulativeCorrect += correct;

    const periodStart = ensureDate(row.period_start);

    return {
      periodStart: periodStart ? periodStart.toISOString() : null,
      label: interval === 'week' && periodStart
        ? `${periodStart.toISOString().slice(0, 10)}`
        : periodStart ? periodStart.toISOString().slice(0, 10) : null,
      attempts,
      correct,
      accuracy: computeAccuracy(correct, attempts),
      avgTime,
      totalTime,
      cumulativeAttempts,
      cumulativeCorrect,
    };
  });
};

const extractDateRangeFromStats = (stats, providedStart, providedEnd) => {
  const firstAttempt = ensureDate(stats?.first_attempt_at);
  const lastAttempt = ensureDate(stats?.last_attempt_at);

  const rangeStart = providedStart || firstAttempt;
  const rangeEnd = providedEnd || lastAttempt;

  return {
    rangeStart,
    rangeEnd,
    totalDays: calculateTotalDays(rangeStart, rangeEnd),
  };
};

const getOverview = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { startDate, endDate } = parseDateRange(req.query, null);

    const cacheKey = {
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
    };

    const cached = analyticsCache.get(userId, 'overview', cacheKey);
    if (cached) {
      sendSuccess(res, cached);
      return;
    }

    const [overallStatsRaw, topicBreakdownRaw, subtopicBreakdownRaw, progressRecords, streakStats, totalProblems] = await Promise.all([
      analyticsModel.getOverallStats(userId, startDate, endDate),
      analyticsModel.getTopicBreakdown(userId, startDate, endDate),
      analyticsModel.getSubtopicBreakdown(userId, startDate, endDate),
      progressModel.getUserProgress(userId),
      streakModel.getStreakStats(userId),
      analyticsModel.getProblemsCount(),
    ]);

    const totalAttempts = toInt(overallStatsRaw?.total_attempts, 0);
    const totalCorrect = toInt(overallStatsRaw?.correct_attempts, 0);
    const uniqueProblems = toInt(overallStatsRaw?.unique_problems, 0);
    const uniqueCorrectProblems = toInt(overallStatsRaw?.unique_correct_problems, 0);
    const avgTimePerProblem = overallStatsRaw?.avg_time_taken !== null && overallStatsRaw?.avg_time_taken !== undefined
      ? parseFloat(parseFloat(overallStatsRaw.avg_time_taken).toFixed(2))
      : null;
    const totalTimeSpent = toInt(overallStatsRaw?.total_time_taken, 0);
    const activeDays = toInt(overallStatsRaw?.active_days, 0);

    const { rangeStart, rangeEnd, totalDays } = extractDateRangeFromStats(overallStatsRaw, startDate, endDate);

    const overallAccuracy = computeAccuracy(totalCorrect, totalAttempts);
    const averageAttemptsPerDay = totalDays > 0 ? parseFloat((totalAttempts / totalDays).toFixed(2)) : 0;
    const averageAttemptsPerActiveDay = activeDays > 0 ? parseFloat((totalAttempts / activeDays).toFixed(2)) : 0;
    const consistencyRate = totalDays > 0 ? parseFloat(((activeDays / totalDays) * 100).toFixed(2)) : 0;

    const topicBreakdown = topicBreakdownRaw.map((row) => {
      const topicAttempts = toInt(row.total_attempts, 0);
      const topicCorrect = toInt(row.correct_attempts, 0);
      return {
        topicId: row.topic_id,
        topicName: row.topic_name,
        totalAttempts: topicAttempts,
        correctAttempts: topicCorrect,
        accuracyRate: computeAccuracy(topicCorrect, topicAttempts),
        uniqueProblems: toInt(row.unique_problems, 0),
        avgTimeTaken: row.avg_time_taken !== null && row.avg_time_taken !== undefined
          ? parseFloat(parseFloat(row.avg_time_taken).toFixed(2))
          : null,
      };
    });

    const subtopicAccuracy = subtopicBreakdownRaw.map((row) => {
      const subAttempts = toInt(row.total_attempts, 0);
      const subCorrect = toInt(row.correct_attempts, 0);
      return {
        subtopicId: row.subtopic_id,
        subtopicName: row.subtopic_name,
        topicId: row.topic_id,
        topicName: row.topic_name,
        totalAttempts: subAttempts,
        correctAttempts: subCorrect,
        accuracyRate: computeAccuracy(subCorrect, subAttempts),
        uniqueProblems: toInt(row.unique_problems, 0),
        avgTimeTaken: row.avg_time_taken !== null && row.avg_time_taken !== undefined
          ? parseFloat(parseFloat(row.avg_time_taken).toFixed(2))
          : null,
      };
    });

    const topicsStatus = buildTopicStatus(progressRecords);

    const progressSummary = {
      totalProblemsAvailable: totalProblems,
      uniqueProblemsAttempted: uniqueProblems,
      uniqueProblemsMastered: uniqueCorrectProblems,
      completionRate: totalProblems > 0
        ? parseFloat(((uniqueCorrectProblems / totalProblems) * 100).toFixed(2))
        : 0,
    };

    const studyConsistency = {
      activeDays,
      totalDaysTracked: totalDays,
      consistencyRate,
      averageAttemptsPerDay,
      averageAttemptsPerActiveDay,
    };

    const response = {
      summary: {
        totalAttempts,
        totalCorrect,
        overallAccuracy,
        uniqueProblemsAttempted: uniqueProblems,
        averageTimePerProblem: avgTimePerProblem,
        totalTimeSpent,
        averageAttemptsPerDay,
        averageAttemptsPerActiveDay,
        activeDays,
        dateRange: {
          start: formatDate(rangeStart),
          end: formatDate(rangeEnd),
          totalDays,
        },
      },
      topics: {
        perTopic: topicBreakdown,
        perSubtopic: subtopicAccuracy,
        status: topicsStatus,
      },
      streak: streakStats ? {
        currentStreak: toInt(streakStats.current_streak, 0),
        longestStreak: toInt(streakStats.longest_streak, 0),
        lastPracticeDate: formatDate(streakStats.last_practice_date),
        isPracticedToday: Boolean(streakStats.is_practiced_today),
        streakFrozen: Boolean(streakStats.streak_frozen),
        freezeCount: toInt(streakStats.freeze_count, 0),
      } : null,
      progress: progressSummary,
      studyConsistency,
    };

    analyticsCache.set(userId, 'overview', cacheKey, response);
    sendSuccess(res, response);
  } catch (error) {
    next(error);
  }
};

const getSubtopicDetail = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id: subtopicId } = req.params;
    const interval = normalizeInterval(req.query.interval);
    const { startDate, endDate } = parseDateRange(req.query, DEFAULT_PROGRESS_DAYS);

    const cacheKey = {
      subtopicId,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      interval,
    };

    const cached = analyticsCache.get(userId, 'subtopic_detail', cacheKey);
    if (cached) {
      sendSuccess(res, cached);
      return;
    }

    const [statsRaw, progressRecord, timelineRaw, recentAttemptsRaw] = await Promise.all([
      analyticsModel.getSubtopicStats(userId, subtopicId, startDate, endDate),
      progressModel.getProgressBySubtopic(userId, subtopicId),
      analyticsModel.getSubtopicTimeline(userId, subtopicId, startDate, endDate, interval),
      analyticsModel.getRecentAttemptsForSubtopic(userId, subtopicId, 10),
    ]);

    if (!statsRaw) {
      throw new AppError('Subtopic not found', 404);
    }

    const totalAttempts = toInt(statsRaw.total_attempts, 0);
    const correctAttempts = toInt(statsRaw.correct_attempts, 0);
    const uniqueProblems = toInt(statsRaw.unique_problems, 0);
    const avgTimeTaken = statsRaw.avg_time_taken !== null && statsRaw.avg_time_taken !== undefined
      ? parseFloat(parseFloat(statsRaw.avg_time_taken).toFixed(2))
      : null;
    const totalTimeSpent = toInt(statsRaw.total_time_taken, 0);
    const firstAttemptAt = ensureDate(statsRaw.first_attempt_at);
    const lastAttemptAt = ensureDate(statsRaw.last_attempt_at);

    const timeline = buildTimelinePoints(timelineRaw, interval);

    const recentAttempts = recentAttemptsRaw.map((attempt) => ({
      attemptId: attempt.id,
      problemId: attempt.problem_id,
      isCorrect: Boolean(attempt.is_correct),
      timeTaken: attempt.time_taken !== null && attempt.time_taken !== undefined ? toInt(attempt.time_taken, null) : null,
      createdAt: formatDate(attempt.created_at),
      difficulty: attempt.difficulty_level,
      questionText: attempt.question_text,
      correctAnswer: attempt.correct_answer,
    }));

    const response = {
      subtopic: {
        id: statsRaw.subtopic_id,
        name: statsRaw.subtopic_name,
        description: statsRaw.subtopic_description,
        topicId: statsRaw.topic_id,
        topicName: statsRaw.topic_name,
      },
      stats: {
        totalAttempts,
        correctAttempts,
        accuracyRate: computeAccuracy(correctAttempts, totalAttempts),
        uniqueProblems,
        averageTimePerProblem: avgTimeTaken,
        totalTimeSpent,
        firstAttemptAt: formatDate(firstAttemptAt),
        lastAttemptAt: formatDate(lastAttemptAt),
      },
      progress: progressRecord ? {
        problemsCompleted: toInt(progressRecord.problems_completed, 0),
        accuracyRate: toFloat(progressRecord.accuracy_rate, 0),
        streakDays: toInt(progressRecord.streak_days, 0),
        lastAccessed: formatDate(progressRecord.last_accessed),
      } : null,
      timeline,
      recentAttempts,
      dateRange: {
        start: formatDate(startDate || firstAttemptAt),
        end: formatDate(endDate || lastAttemptAt),
      },
    };

    analyticsCache.set(userId, 'subtopic_detail', cacheKey, response);
    sendSuccess(res, response);
  } catch (error) {
    next(error);
  }
};

const getProgressTimeline = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const defaultRange = DEFAULT_PROGRESS_DAYS;
    const interval = normalizeInterval(req.query.interval);
    const { startDate, endDate } = parseDateRange(req.query, defaultRange);

    const cacheKey = {
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      interval,
    };

    const cached = analyticsCache.get(userId, 'progress_timeline', cacheKey);
    if (cached) {
      sendSuccess(res, cached);
      return;
    }

    const timelineRows = await analyticsModel.getTimeline(userId, startDate, endDate, interval);
    const timeline = buildTimelinePoints(timelineRows, interval);

    const totalAttempts = timeline.reduce((sum, point) => sum + point.attempts, 0);
    const totalCorrect = timeline.reduce((sum, point) => sum + point.correct, 0);
    const totalTime = timeline.reduce((sum, point) => sum + point.totalTime, 0);
    const activeDays = timeline.filter(point => point.attempts > 0).length;

    const totalDays = calculateTotalDays(startDate, endDate);

    const summary = {
      totalAttempts,
      totalCorrect,
      overallAccuracy: computeAccuracy(totalCorrect, totalAttempts),
      totalTimeSpent: totalTime,
      averageTimePerProblem: totalAttempts > 0 ? parseFloat((totalTime / totalAttempts).toFixed(2)) : null,
      averageAttemptsPerDay: totalDays > 0 ? parseFloat((totalAttempts / totalDays).toFixed(2)) : 0,
      averageAttemptsPerActiveDay: activeDays > 0 ? parseFloat((totalAttempts / activeDays).toFixed(2)) : 0,
      activeDays,
    };

    const response = {
      interval,
      dateRange: {
        start: formatDate(startDate),
        end: formatDate(endDate),
        totalDays,
      },
      timeline,
      summary,
    };

    analyticsCache.set(userId, 'progress_timeline', cacheKey, response);
    sendSuccess(res, response);
  } catch (error) {
    next(error);
  }
};

const getTrendAnalysis = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const windowDays = req.query.window_days ? Math.max(1, parseInt(req.query.window_days, 10)) : DEFAULT_TREND_WINDOW;
    const { startDate: providedStart, endDate: providedEnd } = parseDateRange(req.query, null);

    const cacheKey = {
      windowDays,
      startDate: providedStart ? providedStart.toISOString() : null,
      endDate: providedEnd ? providedEnd.toISOString() : null,
    };

    const cached = analyticsCache.get(userId, 'trend_analysis', cacheKey);
    if (cached) {
      sendSuccess(res, cached);
      return;
    }

    const effectiveEnd = providedEnd || new Date();
    const recentEnd = new Date(effectiveEnd);
    recentEnd.setHours(23, 59, 59, 999);
    const recentStart = new Date(recentEnd.getTime() - (windowDays - 1) * MS_PER_DAY);
    recentStart.setHours(0, 0, 0, 0);

    const minStart = providedStart && providedStart.getTime() > recentStart.getTime()
      ? providedStart
      : recentStart;

    const previousEnd = new Date(minStart.getTime() - 1);
    previousEnd.setHours(23, 59, 59, 999);
    const previousStart = new Date(previousEnd.getTime() - (windowDays - 1) * MS_PER_DAY);
    previousStart.setHours(0, 0, 0, 0);

    const [recentStatsRaw, previousStatsRaw] = await Promise.all([
      analyticsModel.getOverallStats(userId, minStart, recentEnd),
      previousEnd.getTime() >= 0
        ? analyticsModel.getOverallStats(userId, previousStart, previousEnd)
        : Promise.resolve(null),
    ]);

    const recentAttempts = toInt(recentStatsRaw?.total_attempts, 0);
    const recentCorrect = toInt(recentStatsRaw?.correct_attempts, 0);
    const recentAccuracy = computeAccuracy(recentCorrect, recentAttempts);
    const recentAvgTime = recentAttempts > 0 && recentStatsRaw?.total_time_taken
      ? parseFloat((toInt(recentStatsRaw.total_time_taken, 0) / recentAttempts).toFixed(2))
      : null;
    const recentActiveDays = toInt(recentStatsRaw?.active_days, 0);
    const recentAverageAttemptsPerDay = parseFloat((recentAttempts / windowDays).toFixed(2));

    const previousAttempts = toInt(previousStatsRaw?.total_attempts, 0);
    const previousCorrect = toInt(previousStatsRaw?.correct_attempts, 0);
    const previousAccuracy = computeAccuracy(previousCorrect, previousAttempts);
    const previousAvgTime = previousAttempts > 0 && previousStatsRaw?.total_time_taken
      ? parseFloat((toInt(previousStatsRaw.total_time_taken, 0) / previousAttempts).toFixed(2))
      : null;
    const previousActiveDays = toInt(previousStatsRaw?.active_days, 0);
    const previousAverageAttemptsPerDay = parseFloat((previousAttempts / windowDays).toFixed(2));

    const accuracyDelta = parseFloat((recentAccuracy - previousAccuracy).toFixed(2));
    const attemptsDelta = recentAttempts - previousAttempts;
    const avgTimeDelta = (recentAvgTime !== null && previousAvgTime !== null)
      ? parseFloat((recentAvgTime - previousAvgTime).toFixed(2))
      : null;

    let status = 'steady';
    if (previousAttempts === 0 && recentAttempts === 0) {
      status = 'insufficient_data';
    } else if (previousAttempts === 0 && recentAttempts > 0) {
      status = 'improving';
    } else if (accuracyDelta > 5) {
      status = 'improving';
    } else if (accuracyDelta < -5) {
      status = 'declining';
    }

    const response = {
      windowDays,
      recent: {
        start: formatDate(minStart),
        end: formatDate(recentEnd),
        totalAttempts: recentAttempts,
        correctAttempts: recentCorrect,
        accuracyRate: recentAccuracy,
        averageTimePerProblem: recentAvgTime,
        activeDays: recentActiveDays,
        averageAttemptsPerDay: recentAverageAttemptsPerDay,
      },
      previous: previousStatsRaw ? {
        start: formatDate(previousStart),
        end: formatDate(previousEnd),
        totalAttempts: previousAttempts,
        correctAttempts: previousCorrect,
        accuracyRate: previousAccuracy,
        averageTimePerProblem: previousAvgTime,
        activeDays: previousActiveDays,
        averageAttemptsPerDay: previousAverageAttemptsPerDay,
      } : null,
      deltas: {
        accuracyRate: accuracyDelta,
        totalAttempts: attemptsDelta,
        averageTimePerProblem: avgTimeDelta,
      },
      status,
    };

    analyticsCache.set(userId, 'trend_analysis', cacheKey, response);

    sendSuccess(res, response);
  } catch (error) {
    next(error);
  }
};

const getPredictions = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const lookbackDays = req.query.lookback_days ? Math.max(7, parseInt(req.query.lookback_days, 10)) : DEFAULT_PREDICTION_LOOKBACK;
    const { startDate, endDate } = parseDateRange(req.query, lookbackDays);

    const cacheKey = {
      lookbackDays,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
    };

    const cached = analyticsCache.get(userId, 'predictions', cacheKey);
    if (cached) {
      sendSuccess(res, cached);
      return;
    }

    const [overallStatsRaw, timelineRows, totalProblems] = await Promise.all([
      analyticsModel.getOverallStats(userId, null, null),
      analyticsModel.getTimeline(userId, startDate, endDate, 'day'),
      analyticsModel.getProblemsCount(),
    ]);

    const totalAttemptsAllTime = toInt(overallStatsRaw?.total_attempts, 0);
    const totalCorrectAllTime = toInt(overallStatsRaw?.correct_attempts, 0);
    const uniqueProblemsAttempted = toInt(overallStatsRaw?.unique_problems, 0);
    const uniqueProblemsMastered = toInt(overallStatsRaw?.unique_correct_problems, 0);

    const recentTimeline = buildTimelinePoints(timelineRows, 'day');
    const recentAttempts = recentTimeline.reduce((sum, point) => sum + point.attempts, 0);
    const recentCorrect = recentTimeline.reduce((sum, point) => sum + point.correct, 0);
    const recentTime = recentTimeline.reduce((sum, point) => sum + point.totalTime, 0);
    const activeDays = recentTimeline.filter(point => point.attempts > 0).length;
    const totalDays = calculateTotalDays(startDate, endDate);

    const averageAttemptsPerDay = totalDays > 0 ? parseFloat((recentAttempts / totalDays).toFixed(2)) : 0;
    const averageAttemptsPerActiveDay = activeDays > 0 ? parseFloat((recentAttempts / activeDays).toFixed(2)) : 0;
    const averageTimePerProblem = recentAttempts > 0 ? parseFloat((recentTime / recentAttempts).toFixed(2)) : null;

    const remainingProblems = Math.max(totalProblems - uniqueProblemsMastered, 0);
    const estimatedDaysToMastery = averageAttemptsPerDay > 0
      ? Math.ceil(remainingProblems / averageAttemptsPerDay)
      : null;
    const estimatedCompletionDate = estimatedDaysToMastery !== null
      ? new Date(Date.now() + estimatedDaysToMastery * MS_PER_DAY)
      : null;

    let confidence = 'low';
    if (activeDays >= 12) {
      confidence = 'high';
    } else if (activeDays >= 6) {
      confidence = 'medium';
    }

    const response = {
      lookback: {
        start: formatDate(startDate),
        end: formatDate(endDate),
        totalDays,
      },
      progress: {
        totalProblems,
        uniqueProblemsAttempted,
        uniqueProblemsMastered,
        totalAttemptsAllTime,
        totalCorrectAllTime,
      },
      pace: {
        recentAttempts,
        recentCorrect,
        activeDays,
        averageAttemptsPerDay,
        averageAttemptsPerActiveDay,
        averageTimePerProblem,
      },
      projections: {
        remainingProblems,
        estimatedDaysToMastery,
        estimatedCompletionDate: formatDate(estimatedCompletionDate),
        confidence,
      },
    };

    analyticsCache.set(userId, 'predictions', cacheKey, response);

    sendSuccess(res, response);
  } catch (error) {
    next(error);
  }
};

const getComparison = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const cacheKey = { key: 'default' };
    const cached = analyticsCache.get(userId, 'comparison', cacheKey);
    if (cached) {
      sendSuccess(res, cached);
      return;
    }

    const now = new Date();
    now.setHours(23, 59, 59, 999);
    const weekAgo = new Date(now.getTime() - 6 * MS_PER_DAY);
    weekAgo.setHours(0, 0, 0, 0);
    const twoWeeksAgo = new Date(now.getTime() - 13 * MS_PER_DAY);
    twoWeeksAgo.setHours(0, 0, 0, 0);

    const [overallStatsRaw, weekTimelineRows, twoWeekTimelineRows] = await Promise.all([
      analyticsModel.getOverallStats(userId, null, null),
      analyticsModel.getTimeline(userId, weekAgo, now, 'day'),
      analyticsModel.getTimeline(userId, twoWeeksAgo, now, 'day'),
    ]);

    const accuracy = computeAccuracy(
      toInt(overallStatsRaw?.correct_attempts, 0),
      toInt(overallStatsRaw?.total_attempts, 0)
    );

    const weekTimeline = buildTimelinePoints(weekTimelineRows, 'day');
    const twoWeekTimeline = buildTimelinePoints(twoWeekTimelineRows, 'day');

    const problemsThisWeek = weekTimeline.reduce((sum, point) => sum + point.attempts, 0);
    const timeThisWeek = weekTimeline.reduce((sum, point) => sum + point.totalTime, 0);
    const activeDaysTwoWeeks = twoWeekTimeline.filter(point => point.attempts > 0).length;

    const averageTimePerProblem = problemsThisWeek > 0 ? parseFloat((timeThisWeek / problemsThisWeek).toFixed(2)) : null;
    const consistencyRate = parseFloat(((activeDaysTwoWeeks / 14) * 100).toFixed(2));

    const metrics = {
      accuracyRate: {
        value: accuracy,
        goal: GOALS.accuracyRate,
        direction: 'higher',
      },
      problemsPerWeek: {
        value: problemsThisWeek,
        goal: GOALS.problemsPerWeek,
        direction: 'higher',
      },
      averageTimePerProblem: {
        value: averageTimePerProblem,
        goal: GOALS.averageTimePerProblem,
        direction: 'lower',
      },
      consistencyRate: {
        value: consistencyRate,
        goal: GOALS.consistencyRate,
        direction: 'higher',
      },
    };

    const comparison = Object.entries(metrics).map(([key, metric]) => {
      const { value, goal, direction } = metric;
      let status = 'behind';
      let delta = null;

      if (value === null || value === undefined) {
        status = 'insufficient_data';
      } else if (direction === 'higher') {
        delta = parseFloat((value - goal).toFixed(2));
        status = value >= goal ? 'on_track' : 'behind';
      } else {
        delta = parseFloat((goal - value).toFixed(2));
        status = value <= goal ? 'on_track' : 'behind';
      }

      return {
        metric: key,
        value,
        goal,
        direction,
        delta,
        status,
      };
    });

    const response = {
      goals: GOALS,
      comparison,
      window: {
        week: {
          start: formatDate(weekAgo),
          end: formatDate(now),
        },
        twoWeeks: {
          start: formatDate(twoWeeksAgo),
          end: formatDate(now),
        },
      },
    };

    analyticsCache.set(userId, 'comparison', cacheKey, response);

    sendSuccess(res, response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  getSubtopicDetail,
  getProgressTimeline,
  getTrendAnalysis,
  getPredictions,
  getComparison,
};
