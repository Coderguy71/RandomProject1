const jwt = require('jsonwebtoken');
const config = require('../config/environment');

const signAccessToken = (payload, options = {}) => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
    issuer: config.jwt.issuer,
    ...options,
  });
};

const signRefreshToken = (payload, options = {}) => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
    issuer: config.jwt.issuer,
    ...options,
  });
};

const verifyAccessToken = (token, options = {}) => {
  return jwt.verify(token, config.jwt.accessSecret, {
    issuer: config.jwt.issuer,
    ...options,
  });
};

const verifyRefreshToken = (token, options = {}) => {
  return jwt.verify(token, config.jwt.refreshSecret, {
    issuer: config.jwt.issuer,
    ...options,
  });
};

const decodeToken = (token) => jwt.decode(token, { complete: false });

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
};
