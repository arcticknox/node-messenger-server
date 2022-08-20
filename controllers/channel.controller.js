const _ = require('lodash');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { ChannelService, TokenService } = require('../services');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const responseHandler = require('../utils/responseHandler');

const create = catchAsync(async (req, res) => {
  const { name, members } = req.body;
  if (name === 'Lobby') throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden channel name');
  const ownerId = _.get(req, 'user.id');
  const channel = await ChannelService.createChannel(ownerId, name, members);
  responseHandler(req, res, channel);
});

const deleteChannel = catchAsync(async (req, res) => {
  const channel = await ChannelService.deleteChannel(req.user.id, req.params.channelId);
  responseHandler(req, res, channel);
});

const leave = catchAsync(async (req, res) => {
  const channel = await ChannelService.leaveChannel(req.user.id, req.params.channelId);
  responseHandler(req, res, channel);
});

const list = catchAsync(async (req, res) => {
  const options = _.pick(req.query, ['sortBy', 'limit', 'page']);
  const channels = await ChannelService.listChannels(req.user.id, options);
  responseHandler(req, res, channels);
});

const getChannel = catchAsync(async (req, res) => {
  const channel = await ChannelService.getChannelsById(req.params.channelId);
  responseHandler(req, res, channel);
});

const updateChannel = catchAsync(async (req, res) => {
  const allowedUpdates = ['members', 'admins', 'name'];
  const update = _.pick(req.body, allowedUpdates);
  const channel = await ChannelService.updateChannel(req.params.channelId, req.user.id, update);
  responseHandler(req, res, channel);
});

const inviteToChannel = catchAsync(async (req, res) => {
  await TokenService.verifyToken(req.query.token, tokenTypes.VERIFY_EMAIL);
  const channel = await ChannelService.inviteToChannel(req.params.channelId, req.user.id);
  responseHandler(req, res, channel);
});

const genInviteToken = catchAsync(async (req, res) => {
  const token = await TokenService.generateVerifyEmailToken(req.user);
  responseHandler(req, res, { token });
});

module.exports = {
  create,
  list,
  getChannel,
  deleteChannel,
  leave,
  updateChannel,
  inviteToChannel,
  genInviteToken
};