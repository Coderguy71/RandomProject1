require('dotenv').config();

const app = require('./app');
const config = require('./config/environment');
const { testConnection } = require('./utils/database');

const PORT = config.port;
const HOST = config.host;

const startServer = async () => {
  try {
    console.log(`Starting ${config.api.title} in ${config.nodeEnv} environment...`);

    await testConnection();
    console.log('✓ Database connected');

    const server = app.listen(PORT, HOST, () => {
      console.log(`✓ Server running on http://${HOST}:${PORT}`);
      console.log(`✓ API Version: ${config.api.version}`);
      console.log(`✓ Environment: ${config.nodeEnv}`);
      console.log(`✓ Health check: GET http://${HOST}:${PORT}/health`);
      console.log(`✓ Ready check: GET http://${HOST}:${PORT}/ready`);
      console.log(`✓ API info: GET http://${HOST}:${PORT}/api/info`);
    });

    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
