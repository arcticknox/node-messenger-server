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

const list = catchAsync(async (req, res) => {
  const channels = await ChannelService.listChannels(req.user.id);
  res.send(channels);
});

module.exports = {
  create,
  list
};