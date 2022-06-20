const { sendMessage } = require('./messenger');
const logger = require('../config/logger');
const { messengerEvents } = require('../config/events');

module.exports.connectMessenger = async (io) => {
  io.on('connection', async (socket) => {
    logger.info(`${socket.id} has connected to messenger socket!`);
    // sendMessage event
    socket.on(messengerEvents.sendMessage, payload => sendMessage(payload, io));
  });
};