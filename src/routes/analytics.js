const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

router.get('/overview', authenticate, analyticsController.getOverview);
router.get('/subtopic/:id', authenticate, analyticsController.getSubtopicDetail);
router.get('/progress', authenticate, analyticsController.getProgressTimeline);
router.get('/trends', authenticate, analyticsController.getTrendAnalysis);
router.get('/predictions', authenticate, analyticsController.getPredictions);
router.get('/comparison', authenticate, analyticsController.getComparison);

module.exports = router;
