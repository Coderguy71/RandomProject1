const express = require('express');

const { asyncHandler } = require('../middleware/errorHandler');
const { authenticate } = require('../middleware/auth');
const characterController = require('../controllers/characterController');

const router = express.Router();

router.get('/', authenticate, asyncHandler(characterController.getCharacter));
router.post('/', authenticate, asyncHandler(characterController.createCharacter));

module.exports = router;
