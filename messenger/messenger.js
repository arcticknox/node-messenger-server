const _ = require('lodash');
const { createMessage } = require('../services/message.service');
const { verifyToken } = require('../services/token.service');
const { ChannelModel } = require('../models');
const logger = require('../config/logger');

/**
 * Send message to a specific room/channel
 * @param {Object} payload 
 * @param {*} io 
 */
const sendMessage = async (payload, io) => {
  const { message, channelId, user, tokens } = JSON.parse(payload);
  const channel = await ChannelModel.findOne({ _id: channelId, status: 'active' });
  if (channel) {
    const tokenDoc = await verifyToken(_.get(tokens, 'refresh.token'), 'refresh');
    if (tokenDoc) {
      const { members, id } = channel;

      if (members && members.indexOf(user.id) > -1) {
        io.to(id).emit(id, JSON.stringify(await createMessage(channelId, { message }, user)));
      }
    } else {
      logger.error(`Token of ${user.id} has expired.`);
    }
  } else {
    logger.error('Channel doesn\'t exist or might be inactive.');
  }
};

/**
 * Fetch client channels and join
 * @param {Object} payload 
 * @param {*} socket 
 */
const initRooms = async (payload, socket) => {
  const { id } = JSON.parse(payload);
  const channels = await ChannelModel.find({ members: id });
  if (!channels) return;
  _.forEach(channels, channel => {
    console.log('initing room: ', channel.id);
    socket.join(channel.id);
  }); 
};

module.exports = {
  sendMessage,
  initRooms
};