const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const http = require('http');
const { Server } = require('socket.io');
const { privateMessage } = require('./services/socket.service');

// Creating a http server
const server = http.createServer(app);

// Initializing Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});

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
  logger.info(`App server listening on port ${config.port}`);
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

// Get users for private messages

// Establish socket connection
io.on('connection', (socket) => {
  logger.info(`${socket.id} has connected!`)
  // socket.emit('assign socket id', socket.id, socket.id);

  socket.on('private message', msg => privateMessage(msg, socket));
});