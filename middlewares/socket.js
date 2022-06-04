const { listAllChannels } = require('../services/channel.service');
const { sendMessage } = require('../services/socket.service');
const { queryAllUsers } = require('../services/user.service');

module.exports.socketIO = async (io) => {
    // Load all users and channels
    const entities = [...await Promise.resolve(queryAllUsers()), ...await Promise.resolve(listAllChannels())];

    io.on('connection', (socket) => {
        console.log(`${socket.id} has connected!`);

        for (const entity of entities) {
            socket.on(entity.name, msg => sendMessage(entity, msg, io));
        }
    });
}