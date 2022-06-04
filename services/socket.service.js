module.exports.sendMessage = async (channel, msg, io) => {
    if (channel) {
        const { members, id } = channel;
        const { message, from } = JSON.parse(msg);
        if (members && members.indexOf(from) > -1) {
            io.emit(id, JSON.stringify({ message, from }));
        }
    }
};