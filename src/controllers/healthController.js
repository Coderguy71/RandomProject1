const { sendSuccess } = require('../utils/response');
const { testConnection } = require('../utils/database');

const getHealth = async (req, res, next) => {
  try {
    await testConnection();
    
    sendSuccess(res, {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: 'connected',
    }, 200, 'Server is healthy');
  } catch (error) {
    next(error);
  }
};

const getReadiness = async (req, res, next) => {
  try {
    await testConnection();
    
    res.status(200).json({
      ready: true,
      database: true,
    });
  } catch (error) {
    res.status(503).json({
      ready: false,
      database: false,
      error: error.message,
    });
  }
};

module.exports = {
  getHealth,
  getReadiness,
};
