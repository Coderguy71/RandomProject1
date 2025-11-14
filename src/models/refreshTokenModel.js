const { query } = require('../utils/database');

const BASE_SELECT = `id, user_id, token_hash, jwt_id, is_revoked, revoked_at, expires_at, created_at, updated_at`;

const createRefreshToken = async ({ userId, tokenHash, jwtId, expiresAt }) => {
  const result = await query(
    `INSERT INTO refresh_tokens (user_id, token_hash, jwt_id, expires_at)
     VALUES ($1, $2, $3, $4)
     RETURNING ${BASE_SELECT}`,
    [userId, tokenHash, jwtId, expiresAt]
  );
  return result.rows[0];
};

const findRefreshTokenByHash = async (tokenHash) => {
  const result = await query(
    `SELECT ${BASE_SELECT}
     FROM refresh_tokens
     WHERE token_hash = $1
     LIMIT 1`,
    [tokenHash]
  );
  return result.rows[0];
};

const findRefreshTokenByJwtId = async (jwtId) => {
  const result = await query(
    `SELECT ${BASE_SELECT}
     FROM refresh_tokens
     WHERE jwt_id = $1
     LIMIT 1`,
    [jwtId]
  );
  return result.rows[0];
};

const revokeRefreshTokenById = async (id) => {
  const result = await query(
    `UPDATE refresh_tokens
     SET is_revoked = true,
         revoked_at = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING ${BASE_SELECT}`,
    [id]
  );
  return result.rows[0];
};

const revokeRefreshTokenByJwtId = async (jwtId) => {
  const result = await query(
    `UPDATE refresh_tokens
     SET is_revoked = true,
         revoked_at = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP
     WHERE jwt_id = $1
     RETURNING ${BASE_SELECT}`,
    [jwtId]
  );
  return result.rows[0];
};

const revokeAllTokensForUser = async (userId) => {
  await query(
    `UPDATE refresh_tokens
     SET is_revoked = true,
         revoked_at = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $1 AND is_revoked = false`,
    [userId]
  );
};

module.exports = {
  createRefreshToken,
  findRefreshTokenByHash,
  findRefreshTokenByJwtId,
  revokeRefreshTokenById,
  revokeRefreshTokenByJwtId,
  revokeAllTokensForUser,
};
