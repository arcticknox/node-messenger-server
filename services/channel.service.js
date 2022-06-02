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

const listChannels = async (userId) => {
  const channelInfo = await ChannelModel.find({members: userId});
  if (!channelInfo) throw new ApiError(httpStatus.NOT_FOUND, 'No channels');
  return channelInfo;
};

module.exports = {
  createChannel,
  listChannels
};