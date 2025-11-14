const pool = require('../config/database');

const query = async (text, params = []) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`Executed query (${duration}ms):\n${text}`);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

const getConnection = async () => {
  const client = await pool.connect();
  return client;
};

const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

module.exports = {
  query,
  getConnection,
  testConnection,
  pool,
};
