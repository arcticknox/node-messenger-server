const { sendMessage, initRooms, initRoom } = require('./messenger');
const logger = require('../config/logger');
const { messengerEvents } = require('../config/events');

module.exports.connectMessenger = async (io) => {
  io.on('connection', async (socket) => {
    logger.info(`${socket.id} has connected to messenger socket!`);
    // send message event
    socket.on(messengerEvents.sendMessage, payload => sendMessage(payload, io));
    // Init rooms
    socket.on('common:init-rooms', payload => initRooms(payload, socket));
    // Join channel room on creation
    socket.on(messengerEvents.createChannel, payload => initRoom(socket, payload));
  });
};