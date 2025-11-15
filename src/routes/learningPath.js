const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
  getPersonalizedRecommendations,
  getLearningPathOverview,
  getNextRecommendation,
  completeRecommendation,
  getPerformanceAnalysis,
  refreshRecommendations
} = require('../controllers/learningPathController');

const router = express.Router();

// All learning path routes require authentication
router.use(authenticate);

/**
 * GET /api/learning-path/recommendations
 * Get personalized learning recommendations
 * Query params: limit (default: 10)
 */
router.get('/recommendations', getPersonalizedRecommendations);

/**
 * GET /api/learning-path/overview
 * Get comprehensive learning path overview
 */
router.get('/overview', getLearningPathOverview);

/**
 * GET /api/learning-path/next
 * Get the next highest priority recommendation
 */
router.get('/next', getNextRecommendation);

/**
 * POST /api/learning-path/recommendations/:recommendationId/complete
 * Mark a recommendation as completed
 */
router.post('/recommendations/:recommendationId/complete', completeRecommendation);

/**
 * GET /api/learning-path/performance
 * Get detailed performance analysis
 * Query params: major_topic_id (optional)
 */
router.get('/performance', getPerformanceAnalysis);

/**
 * POST /api/learning-path/refresh
 * Force refresh of all recommendations
 */
router.post('/refresh', refreshRecommendations);

module.exports = router;