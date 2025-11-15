const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const attemptController = require('../controllers/attemptController');

router.post('/problems/:id/submit', authenticate, attemptController.submitAnswer);
router.get('/history', authenticate, attemptController.getAttemptHistory);
router.get('/analytics', authenticate, attemptController.getAllAnalytics);
router.get('/analytics/subtopics/:subtopicId', authenticate, attemptController.getSubtopicAnalytics);

module.exports = router;
