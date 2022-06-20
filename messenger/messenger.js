const _ = require('lodash');
const { createMessage } = require('../services/message.service');
const { verifyToken } = require('../services/token.service');
const { ChannelModel } = require('../models');
const logger = require('../config/logger');

module.exports.sendMessage = async (payload, io) => {
  const { message, channelId, user, tokens } = JSON.parse(payload);
  const channel = await ChannelModel.findOne({ _id: channelId, status: 'active' });
  if (channel) {
    const tokenDoc = await verifyToken(_.get(tokens, 'refresh.token'), 'refresh');
    if (tokenDoc) {
      const { members, id } = channel;

      if (members && members.indexOf(user.id) > -1) {
        io.emit(id, JSON.stringify(await createMessage(channelId, { message }, user)));
      }
    } else {
      logger.error(`Token of ${user.id} has expired.`);
    }
  } else {
    logger.error('Channel doesn\'t exist or might be inactive.');
  }
};