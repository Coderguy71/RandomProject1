const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const problemController = require('../controllers/problemController');

router.get('/', authenticate, problemController.getProblems);
router.get('/:id', authenticate, problemController.getProblemById);

module.exports = router;
