const _ = require('lodash');
const { Server } = require('socket.io');
const config = require('../config/config');
const logger = require('../config/logger');

/**
 * Initialise Socket.io
 */
const initSocketIOServer = (server) => {
  try {
    const io = new Server(server, {
      cors: {
        origin: _.get(config, 'corsWhitelist', '*'),
        methods: ['GET', 'POST']
      }
    });
    // Add middlewares here
    logger.info('Socket.io connected.');
    return io;
  } catch (err) {
    logger.error('Socket.io init error: ', err);
  }
};

module.exports = {
  initSocketIOServer
};