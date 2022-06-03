const logger = require('../config/logger');

module.exports.privateMessage = async (msg, socket) => {
    logger.info(msg)
    const { message, channelId, socketId } = JSON.parse(msg);
    // io.emit('private message', JSON.stringify({
    //     message,
    //     channelId
    // }));
    // socket.to()
};