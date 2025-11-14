const rateLimit = require('express-rate-limit');
const config = require('../config/environment');
const { AppError } = require('./errorHandler');

const authRateLimiter = rateLimit({
  windowMs: config.rateLimit.auth.windowMs,
  max: config.rateLimit.auth.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many authentication attempts. Please try again later.', 429));
  },
});

module.exports = {
  authRateLimiter,
};
