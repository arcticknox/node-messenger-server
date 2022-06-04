module.exports.sendMessage = async (entity, msg, io) => {
    if (entity.role === 'user') {
        const { message, to, from } = JSON.parse(msg);
        [to, from].forEach(e => io.emit(e, JSON.stringify({ message, from })));
    }
};