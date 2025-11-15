const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const tutorialController = require('../controllers/tutorialController');

// Public routes - accessible without authentication
router.get('/', tutorialController.getTutorials);
router.get('/:id', tutorialController.getTutorialById);
router.get('/subtopic/:subtopic_id', tutorialController.getTutorialsBySubtopic);

// Authenticated routes
router.post('/:id/viewed', authenticate, tutorialController.markTutorialAsViewed);
router.get('/:id/problems', authenticate, tutorialController.getTutorialProblems);

module.exports = router;