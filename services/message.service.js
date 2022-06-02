const _ = require('lodash');
const { ChannelModel, MessageModel } = require('../models');

/**
 * Create message
 * @param {string} channelId 
 * @param {object} payload 
 * @param {object} ownerDetails 
 * @returns {Promise}
 */
const createMessage = async (channelId, payload, ownerDetails) => {
  const { id, name } = ownerDetails;
  const channelInfo = await ChannelModel.findOne({_id: channelId, status: 'active'});
  const recipients = _.get(channelInfo, 'members');
  const message = _.get(payload, 'message');
  return MessageModel.create({channelId, message, recipients, ownerId: id, ownerName: name});
};

/**
 * Get previous chat messages for a channel
 * @param {string} channelId 
 * @returns {Promise}
 */
const getPreviousMessages = async (channelId, options) => {
  const messages = await MessageModel.paginate({channelId}, options);
  return messages;
};

/**
 * Delete message
 * @param {string} channelId 
 * @param {string} messageId 
 * @returns {Promise}
 */
const deleteMessage = async (channelId, messageId) => {
  return MessageModel.update({_id: messageId, channelId}, { $set: { status: 'deleted' } });
};

module.exports = {
  createMessage,
  getPreviousMessages,
  deleteMessage
};