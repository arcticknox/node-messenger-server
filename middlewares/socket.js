const { listAllChannels } = require('../services/channel.service');
const { sendMessage } = require('../services/socket.service');

module.exports.socketIO = async (io) => {
  // Load all channels
  
  io.on('connection', async (socket) => {
    // Reload list of channels
    const channels = await listAllChannels();
    
    console.log(`${socket.id} has connected!`);

    for (const channel of channels) {
      socket.on(channel.id, payload => sendMessage(channel, payload, io));
    }
  });
};