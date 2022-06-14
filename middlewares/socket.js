const { sendMessage } = require('../services/socket.service');
const logger = require('../config/logger');

module.exports.socketIO = async (io) => {
  let connections = 0;
  io.on('connection', async (socket) => {
    connections +=1;
    logger.info(`${socket.id} has connected! Connections: ${connections}`);
    // sendMessage event
    socket.on('sendMessage', payload => sendMessage(payload, io));

  });
  
  
};