const { listAllChannels } = require('../services/channel.service');
const { sendMessage } = require('../services/socket.service');

module.exports.socketIO = async (io) => {
  // Load all channels
  const channels = await listAllChannels();

  io.on('connection', (socket) => {
    console.log(`${socket.id} has connected!`);

    for (const channel of channels) {
      socket.on(channel.id, payload => sendMessage(channel, payload, io));
    }
  });
};