const _ = require('lodash');
const { createMessage } = require('../services/message.service');
const { verifyToken } = require('../services/token.service');
const { ChannelModel } = require('../models');
const logger = require('../config/logger');
const { messengerEvents } = require('../config/events');

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
  const token = _.get(payload, 'refresh.token');
  const tokenDoc = await verifyToken(token, 'refresh');
  const channels = await ChannelModel.find({ members: _.get(tokenDoc, 'user') });
  if (!channels) return;
  _.forEach(channels, channel => {
    console.log('initing room: ', channel.id);
    socket.join(channel.id);
  }); 
};

/**
 * Join room for single client
 * @param {*} socket 
 * @param {String} channelId 
 */
const initRoom = async (socket, channelId) => {
  socket.join(channelId);
};

/**
 * Join using channel invite link
 * @param {*} socket 
 * @param {String} channelId 
 * @param {*} io 
 */
const joinFromInviteLink = async (socket, payload, io) => {
  const { channelId, name } = payload;
  socket.join(channelId);
  // Send confirm event on join
  io.to(channelId).emit(messengerEvents.joinedFromInviteLink, `${name} has joined.`);
};

const leaveRoom = async (socket, channelId, io) => {
  socket.leave(channelId);
  io.to(channelId).emit(messengerEvents.confirmLeaveChannel);
};

module.exports = {
  sendMessage,
  initRooms,
  initRoom,
  joinFromInviteLink,
  leaveRoom
};