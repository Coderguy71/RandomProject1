const express = require('express');

const { asyncHandler } = require('../middleware/errorHandler');
const { authRateLimiter } = require('../middleware/rateLimit');
const { authenticate } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authRateLimiter, asyncHandler(authController.register));
router.post('/login', authRateLimiter, asyncHandler(authController.login));
router.post('/refresh', authRateLimiter, asyncHandler(authController.refreshToken));
router.post('/logout', authRateLimiter, asyncHandler(authController.logout));
router.get('/me', authenticate, asyncHandler(authController.getProfile));

module.exports = router;
