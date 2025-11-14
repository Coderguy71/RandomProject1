const { query } = require('../utils/database');

const createUser = async ({ email, username, passwordHash, firstName = null, lastName = null }) => {
  const result = await query(
    `INSERT INTO users (email, username, password_hash, first_name, last_name)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, username, first_name, last_name, role, is_active, created_at, updated_at`,
    [email, username, passwordHash, firstName, lastName]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await query(
    `SELECT id, email, username, password_hash, first_name, last_name, role, is_active, created_at, updated_at
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email]
  );
  return result.rows[0];
};

const findUserByUsername = async (username) => {
  const result = await query(
    `SELECT id, email, username, password_hash, first_name, last_name, role, is_active, created_at, updated_at
     FROM users
     WHERE username = $1
     LIMIT 1`,
    [username]
  );
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await query(
    `SELECT id, email, username, password_hash, first_name, last_name, role, is_active, created_at, updated_at
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
};
