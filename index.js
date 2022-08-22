const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const http = require('http');
const { initSocketIOServer } = require('./socket');
const { connectMessenger } = require('./messenger');
const { connectMediasoup } = require('./mediasoup');
const { scheduleCrons } = require('./cron');

// Creating a http server
const server = http.createServer(app);

// Initialize Socket.io
const io = initSocketIOServer(server);

const initMongoDB = () => {
  mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    logger.info('Connected to MongoDB');
  }).catch((e) => {
    logger.warn('MongoDB connection error', e);
  });
};

// Changed server config to make it work with socket.io
server.listen(config.port, () => {
  initMongoDB();
  connectMessenger(io);
  // Mediasoup
  if (config.enableMediasoup) connectMediasoup(io);
  logger.info(`App server listening on port ${config.port}`);
  scheduleCrons();
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});