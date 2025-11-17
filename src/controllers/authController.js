const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const config = require('../config/environment');
const { sendSuccess } = require('../utils/response');
const { AppError } = require('../middleware/errorHandler');
const { signAccessToken, signRefreshToken, verifyRefreshToken, decodeToken } = require('../utils/jwt');
const { hashToken } = require('../utils/token');
const userModel = require('../models/userModel');
const refreshTokenModel = require('../models/refreshTokenModel');
const characterModel = require('../models/characterModel');

const DEFAULT_REFRESH_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

const toUserResponse = (user) => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
    isActive: user.is_active,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};

const buildTokenResponse = ({ accessToken, refreshToken, refreshTokenExpiresAt }) => ({
  tokenType: 'Bearer',
  accessToken,
  accessTokenExpiresIn: config.jwt.accessExpiresIn,
  refreshToken,
  refreshTokenExpiresAt: refreshTokenExpiresAt ? refreshTokenExpiresAt.toISOString() : null,
});

const issueTokensForUser = async (user) => {
  const accessPayload = {
    sub: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    type: 'access',
  };

  const accessToken = signAccessToken(accessPayload);

  const jwtId = crypto.randomUUID();
  const refreshPayload = {
    sub: user.id,
    type: 'refresh',
  };

  const refreshToken = signRefreshToken(refreshPayload, { jwtid: jwtId });
  const decodedRefresh = decodeToken(refreshToken);
  const refreshExpiresAt = decodedRefresh?.exp
    ? new Date(decodedRefresh.exp * 1000)
    : new Date(Date.now() + DEFAULT_REFRESH_EXPIRATION_MS);
  const tokenHash = hashToken(refreshToken);

  await refreshTokenModel.createRefreshToken({
    userId: user.id,
    tokenHash,
    jwtId,
    expiresAt: refreshExpiresAt,
  });

  return {
    accessToken,
    refreshToken,
    refreshTokenExpiresAt: refreshExpiresAt,
  };
};

const validateSignupInput = ({ email, username, password }) => {
  if (!email || typeof email !== 'string' || !validator.isEmail(email.trim())) {
    throw new AppError('A valid email address is required', 400);
  }

  if (!username || typeof username !== 'string') {
    throw new AppError('Username is required', 400);
  }

  const trimmedUsername = username.trim();
  if (trimmedUsername.length < 3) {
    throw new AppError('Username must be at least 3 characters long', 400);
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(trimmedUsername)) {
    throw new AppError('Username may only contain letters, numbers, dots, underscores, or hyphens', 400);
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    throw new AppError('Password must be at least 8 characters long', 400);
  }
};

const normalizeSignupInput = ({ email, username, password, firstName, lastName }) => ({
  email: email.trim().toLowerCase(),
  username: username.trim(),
  password,
  firstName: firstName?.trim() || null,
  lastName: lastName?.trim() || null,
});

const register = async (req, res, next) => {
  try {
    validateSignupInput(req.body);
    const normalized = normalizeSignupInput(req.body);

    const existingEmail = await userModel.findUserByEmail(normalized.email);
    if (existingEmail) {
      throw new AppError('An account with this email already exists', 409);
    }

    const existingUsername = await userModel.findUserByUsername(normalized.username);
    if (existingUsername) {
      throw new AppError('An account with this username already exists', 409);
    }

    const passwordHash = await bcrypt.hash(normalized.password, config.security.bcryptSaltRounds);

    let user;
    try {
      user = await userModel.createUser({
        email: normalized.email,
        username: normalized.username,
        passwordHash,
        firstName: normalized.firstName,
        lastName: normalized.lastName,
      });
    } catch (error) {
      if (error.code === '23505') {
        throw new AppError('An account with the provided credentials already exists', 409);
      }
      throw error;
    }

    // Create character for new user
    try {
      await characterModel.createCharacter(user.id);
    } catch (error) {
      console.error('Failed to create character during signup:', error);
      // Don't fail signup if character creation fails
    }

    const tokens = await issueTokensForUser(user);

    sendSuccess(
      res,
      {
        user: toUserResponse(user),
        tokens: buildTokenResponse(tokens),
      },
      201,
      'User registered successfully'
    );
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !validator.isEmail(email.trim())) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!password || typeof password !== 'string') {
      throw new AppError('Invalid email or password', 401);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await userModel.findUserByEmail(normalizedEmail);

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.is_active) {
      throw new AppError('Account is inactive. Please contact support.', 403);
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const tokens = await issueTokensForUser(user);

    sendSuccess(
      res,
      {
        user: toUserResponse(user),
        tokens: buildTokenResponse(tokens),
      },
      200,
      'User logged in successfully'
    );
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: incomingToken } = req.body;

    if (!incomingToken || typeof incomingToken !== 'string') {
      throw new AppError('Refresh token is required', 400);
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(incomingToken);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        const payload = decodeToken(incomingToken);
        if (payload?.jti) {
          await refreshTokenModel.revokeRefreshTokenByJwtId(payload.jti);
        }
        throw new AppError('Refresh token has expired', 401);
      }
      throw new AppError('Invalid refresh token', 401);
    }

    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid refresh token type', 401);
    }

    if (!decoded.jti || !decoded.sub) {
      throw new AppError('Invalid refresh token payload', 401);
    }

    const tokenHash = hashToken(incomingToken);
    const storedToken = await refreshTokenModel.findRefreshTokenByJwtId(decoded.jti);

    if (!storedToken || storedToken.is_revoked) {
      throw new AppError('Refresh token is no longer valid', 401);
    }

    if (storedToken.token_hash !== tokenHash) {
      await refreshTokenModel.revokeRefreshTokenById(storedToken.id);
      throw new AppError('Refresh token mismatch', 401);
    }

    if (storedToken.expires_at && new Date(storedToken.expires_at) <= new Date()) {
      await refreshTokenModel.revokeRefreshTokenById(storedToken.id);
      throw new AppError('Refresh token has expired', 401);
    }

    const user = await userModel.findUserById(decoded.sub);

    if (!user || !user.is_active) {
      await refreshTokenModel.revokeRefreshTokenById(storedToken.id);
      throw new AppError('User account is unavailable', 401);
    }

    await refreshTokenModel.revokeRefreshTokenById(storedToken.id);

    const tokens = await issueTokensForUser(user);

    sendSuccess(
      res,
      {
        user: toUserResponse(user),
        tokens: buildTokenResponse(tokens),
      },
      200,
      'Token refreshed successfully'
    );
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken: incomingToken } = req.body;

    if (!incomingToken || typeof incomingToken !== 'string') {
      throw new AppError('Refresh token is required', 400);
    }

    const tokenHash = hashToken(incomingToken);
    const payload = decodeToken(incomingToken);

    if (payload?.jti) {
      const storedToken = await refreshTokenModel.findRefreshTokenByJwtId(payload.jti);
      if (storedToken && storedToken.token_hash === tokenHash && !storedToken.is_revoked) {
        await refreshTokenModel.revokeRefreshTokenById(storedToken.id);
      }
    }

    sendSuccess(
      res,
      {
        success: true,
      },
      200,
      'Logged out successfully'
    );
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?.sub;

    if (!userId) {
      throw new AppError('Unable to identify user', 401);
    }

    const user = await userModel.findUserById(userId);

    if (!user || !user.is_active) {
      throw new AppError('User not found', 404);
    }

    sendSuccess(
      res,
      {
        user: toUserResponse(user),
      },
      200,
      'User profile retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
};
