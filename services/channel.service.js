const _ = require('lodash');
const ApiError = require('../utils/ApiError');
const { ChannelModel } = require('../models');
const httpStatus = require('http-status');

const createChannel = async (ownerId, name, members = []) => {
  const channelInfo = await ChannelModel.findOne({ name, ownerId });
  members.push(ownerId); // Ensure owner is in members
  if (channelInfo) throw new ApiError(httpStatus.BAD_REQUEST, 'Channel already exists');
  return ChannelModel.create({
    name, 
    ownerId,
    members: _.uniq(members),
    admins: [ownerId],
  });
};

const leaveChannel = async (userId, channelId) => {
  const channel = await ChannelModel
    .findOneAndUpdate({ _id: channelId, status: 'active' }, { $pull: { members: userId, admins: userId } });
  if (!channel) throw new ApiError(httpStatus.BAD_REQUEST, 'Channel does not exist');
  return channel;
};


/**
 * Delete channel, admin rights required
 * @param {string} userId 
 * @param {string} channelId 
 * @returns {Promise}
 */
const deleteChannel = async (userId, channelId) => {
  const channel = await ChannelModel
    .findOneAndUpdate({ _id: channelId, admins: userId }, { $set: { status: 'deleted' } }, { new: true });
  if (!channel) throw new ApiError(httpStatus.FORBIDDEN);
  return channel;
};

const listChannels = async (userId, options) => {
  const channelInfo = await ChannelModel.paginate({ members: userId, status: 'active' }, options);
  if (!channelInfo) throw new ApiError(httpStatus.NOT_FOUND, 'No channels');
  return channelInfo;
};

const getChannelsById = async (channelId) => {
  const channel = await ChannelModel.findOne({ _id: channelId, status: 'active' });
  if (!channel) throw new ApiError(httpStatus.NOT_FOUND, 'Channel does not exist');
  return channel;
};

/**
 * Update channel, admin rights required
 * @param {string} channelId 
 * @param {object} update 
 * @returns {Promise}
 */
const updateChannel = async (channelId, userId, update) => {
  const { members = [], admins = [], name } = update;
  members.push(userId); admins.push(userId);
  const channel = await ChannelModel
    .findOneAndUpdate({ channelId, admins: userId, status: 'active' }, 
      { $set: { name, members: _.uniq(members), admins: _.uniq(admins) } }, { new: true });
  if (!channel) throw new ApiError(httpStatus.UNAUTHORIZED, 'No rights, or channel does not exist');
  return channel;
};

module.exports = {
  createChannel,
  listChannels,
  getChannelsById,
  deleteChannel,
  leaveChannel,
  updateChannel
};