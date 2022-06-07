const httpStatus = require('http-status');
const _ = require('lodash');
const { ChannelModel, MessageModel } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create message
 * @param {string} channelId 
 * @param {object} payload 
 * @param {object} ownerDetails 
 * @returns {Promise}
 */
const createMessage = async (channelId, payload, ownerDetails) => {
  const { id, name } = ownerDetails;
  const channelInfo = await ChannelModel.findOne({ _id: channelId, status: 'active' });
  const recipients = _.get(channelInfo, 'members');
  const message = _.get(payload, 'message');
  return MessageModel.create({ channelId, message, recipients, ownerId: id, ownerName: name });
};

/**
 * Get previous chat messages for a channel
 * @param {string} channelId 
 * @returns {Promise}
 */
const getPreviousMessages = async (userId, channelId, options) => {
  const channelInfo = await ChannelModel.findOne({ _id: channelId, members: userId });
  if (!channelInfo) throw new ApiError(httpStatus.FORBIDDEN, 'User is not a member of this channel');
  options.sortBy = 'createdAt:desc';
  const messages = await MessageModel.paginate({ channelId, status: 'active' }, options);
  messages.results = _.reverse(messages.results);
  return messages;
};

/**
 * Delete message
 * @param {string} channelId 
 * @param {string} messageId 
 * @returns {Promise}
 */
const deleteMessage = async (channelId, messageId) => {
  return MessageModel.updateOne({ _id: messageId, channelId }, { $set: { status: 'deleted' } });
};

module.exports = {
  createMessage,
  getPreviousMessages,
  deleteMessage
};