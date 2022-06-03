const _ = require('lodash');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { ChannelService } = require('../services');

const create = catchAsync(async (req, res) => {
  const { name, members } = req.body;
  const ownerId = _.get(req, 'user.id');
  const channel = await ChannelService.createChannel(ownerId, name, members);
  res.status(httpStatus.CREATED).send(channel);
});

const deleteChannel = catchAsync(async (req, res) => {
  const channel = await ChannelService.deleteChannel(req.user.id, req.params.channelId);
  res.send(channel);
});

const leave = catchAsync(async (req, res) => {
  const channel = await ChannelService.leaveChannel(req.user.id, req.params.channelId);
  res.send(channel);
});

const list = catchAsync(async (req, res) => {
  const options = _.pick(req.query, ['sortBy', 'limit', 'page']);
  const channels = await ChannelService.listChannels(req.user.id, options);
  res.send(channels);
});

const getChannel = catchAsync(async (req, res) => {
  const channel = await ChannelService.getChannelsById(req.params.channelId);
  res.send(channel);
});

const updateChannel = catchAsync(async (req, res) => {
  const allowedUpdates = ['members', 'admins', 'name'];
  const update = _.pick(req.body, allowedUpdates);
  const channel = await ChannelService.updateChannel(req.params.channelId, req.user.id,update);
  res.send(channel);
});

module.exports = {
  create,
  list,
  getChannel,
  deleteChannel,
  leave,
  updateChannel
};