const logger = require('../config/logger');

module.exports.sendMessage = async (msg, io) => {
    const { message, to, from } = JSON.parse(msg);
    [to, from].forEach(e => io.emit(e, JSON.stringify({ message, from })));
};