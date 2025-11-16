const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const topicController = require('../controllers/topicController');

// Public routes - no authentication required
router.get('/topics', topicController.getTopics);
router.get('/topics/:id/subtopics', topicController.getSubtopicsByTopic);
router.get('/subtopics', topicController.getAllSubtopics);
router.get('/subtopics/:id', topicController.getSubtopicById);

// Protected routes - require authentication
router.get('/subtopics/:id/progress', authenticate, topicController.getSubtopicProgress);

module.exports = router;