const { 
  sendMessage, 
  initRooms, 
  initRoom, 
  joinFromInviteLink,
  leaveRoom 
} = require('./messenger');
const logger = require('../config/logger');
const { messengerEvents, commonEvents } = require('../config/events');

module.exports.connectMessenger = async (io) => {
  io.on('connection', async (socket) => {
    logger.info(`${socket.id} has connected to messenger socket!`);
    // send message event
    socket.on(messengerEvents.sendMessage, payload => sendMessage(payload, io));
    // Init rooms
    socket.on(commonEvents.initRooms, payload => initRooms(payload, socket));
    // Join channel room on creation
    socket.on(messengerEvents.createChannel, payload => initRoom(socket, payload));
    // Join channel from invite link
    socket.on(messengerEvents.joinFromInviteLink, payload => joinFromInviteLink(socket, payload, io));
    // Leave room
    socket.on(messengerEvents.leaveChannel, payload => leaveRoom(socket, payload, io));
  });
};