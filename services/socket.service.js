const _ = require('lodash');
const { createMessage } = require('./message.service');
const { verifyToken } = require('./token.service');

module.exports.sendMessage = async (channel, payload, io) => {
  if (channel && channel.status === 'active') {
    const { message, channelId, user, tokens } = JSON.parse(payload);
    const tokenDoc = await Promise.resolve(verifyToken(_.get(tokens, 'refresh.token'), 'refresh'));
    if (tokenDoc) {
      const { members, id } = channel;

      if (members && members.indexOf(user.id) > -1) {
        io.emit(id, JSON.stringify(await createMessage(channelId, { message }, user)));
      }
    } else {
      console.error(`Token of ${user.id} has expired.`);
    }
  } else {
    console.error('Channel doesn\'t exist or might be inactive.');
  }
};