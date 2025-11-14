require('dotenv').config();

const parseNumber = (value, defaultValue) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

const defaultJwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const defaultJwtExpiry = process.env.JWT_EXPIRY;

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseNumber(process.env.PORT, 3000),
  host: process.env.HOST || 'localhost',

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseNumber(process.env.DB_PORT, 5432),
    name: process.env.DB_NAME || 'sat_math_platform',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    poolMin: parseNumber(process.env.DB_POOL_MIN, 2),
    poolMax: parseNumber(process.env.DB_POOL_MAX, 10),
  },

  jwt: (() => {
    const accessSecret = process.env.JWT_ACCESS_SECRET || defaultJwtSecret;
    const refreshSecret = process.env.JWT_REFRESH_SECRET || defaultJwtSecret;
    const accessExpiresIn = process.env.JWT_ACCESS_EXPIRY || defaultJwtExpiry || '15m';
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRY || '7d';
    const issuer = process.env.JWT_ISSUER || 'SAT Math Learning Platform';

    return {
      accessSecret,
      refreshSecret,
      accessExpiresIn,
      refreshExpiresIn,
      issuer,
      secret: accessSecret,
      expiresIn: accessExpiresIn,
    };
  })(),

  security: {
    bcryptSaltRounds: parseNumber(process.env.BCRYPT_SALT_ROUNDS, 10),
  },

  rateLimit: {
    auth: {
      windowMs: parseNumber(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
      max: parseNumber(process.env.AUTH_RATE_LIMIT_MAX, 10),
    },
  },

  api: {
    version: process.env.API_VERSION || 'v1',
    title: process.env.API_TITLE || 'SAT Math Learning Platform API',
  },

  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

module.exports = config;
