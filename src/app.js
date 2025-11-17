const express = require('express');
const corsMiddleware = require('./middleware/cors');
const loggerMiddleware = require('./middleware/logger');
const { errorHandler, AppError } = require('./middleware/errorHandler');
const config = require('./config/environment');

const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problems');
const attemptRoutes = require('./routes/attempts');
const tutorialRoutes = require('./routes/tutorials');
const topicRoutes = require('./routes/topics');

const app = express();

app.use(corsMiddleware);
app.use(loggerMiddleware);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/tutorials', tutorialRoutes);
app.use('/api', topicRoutes);
app.use('/', healthRoutes);

app.get('/api/info', (req, res) => {
  res.json({
    name: config.api.title,
    version: config.api.version,
    environment: config.nodeEnv,
  });
});

app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

module.exports = app;
