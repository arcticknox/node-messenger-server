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

const listChannels = async (userId, options) => {
  const channelInfo = await ChannelModel.paginate({members: userId}, options);
  if (!channelInfo) throw new ApiError(httpStatus.NOT_FOUND, 'No channels');
  return channelInfo;
};

const getChannelsById = async (channelId) => {
  const channel = await ChannelModel.findOne({id: channelId});
  if (!channel) throw new ApiError(httpStatus.NOT_FOUND, 'Channel does not exist');
  return channel;
};

module.exports = {
  createChannel,
  listChannels,
  getChannelsById
};