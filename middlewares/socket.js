const _ = require('lodash');
const { sendMessage } = require('../services/socket.service');

const users = ['Kunal', 'Kaushik'];

module.exports.socketIO = io => {
    io.on('connection', (socket) => {
        console.log(`${socket.id} has connected!`)

        for (const user of users) {
            socket.on(user, msg => sendMessage(msg, io))
        }
    });
}