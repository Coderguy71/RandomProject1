const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');
const { verifyAccessToken } = require('../utils/jwt');

const authenticate = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AppError('Authorization header missing', 401);
    }

    const [, token] = authorization.split(' ');

    if (!token) {
      throw new AppError('Authorization token missing', 401);
    }

    const decoded = verifyAccessToken(token);

    if (decoded.type !== 'access') {
      throw new AppError('Invalid token type', 401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('Token expired', 401));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid token', 401));
    }
    next(error);
  }
};

module.exports = {
  authenticate,
  verifyToken: authenticate,
};
