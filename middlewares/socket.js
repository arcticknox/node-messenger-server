const { sendMessage } = require('../services/socket.service');
const logger = require('../config/logger');

module.exports.socketIO = async (io) => {
  const messenger = io.of('/messenger');
  let connections = 0;
  messenger.on('connection', async (socket) => {
    connections +=1;
    logger.info(`${socket.id} has connected! Connections: ${connections}`);
    // sendMessage event
    socket.on('sendMessage', payload => sendMessage(payload, messenger));

  });
  
  
};