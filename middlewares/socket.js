const { listAllChannels } = require('../services/channel.service');
const { sendMessage } = require('../services/socket.service');

module.exports.socketIO = async (io) => {
  // Load all channels
  const channels = await Promise.resolve(listAllChannels());

  io.on('connection', (socket) => {
    console.log(`${socket.id} has connected!`);

    for (const channel of channels) {
      socket.on(channel.id, msg => sendMessage(channel, msg, io));
    }
  });
};