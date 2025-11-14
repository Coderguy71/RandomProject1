const morgan = require('morgan');

const morganFormat = process.env.NODE_ENV === 'production' 
  ? 'combined' 
  : 'dev';

const loggerMiddleware = morgan(morganFormat);

module.exports = loggerMiddleware;
