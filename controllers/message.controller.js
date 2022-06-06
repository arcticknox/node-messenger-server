const _ = require('lodash');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { MessageService } = require('../services');

const createMessage = catchAsync(async (req, res) => {
  const message = await MessageService.createMessage(req.params.channelId, req.body, req.user);
  res.send(message);
});
  
const getMessages = catchAsync(async (req, res) => {
  const options = _.pick(req.query, ['sortBy', 'limit', 'page']);
  const messages = await MessageService.getPreviousMessages(req.user.id, req.params.channelId, options);
  res.send(messages);
});

const deleteMessage = catchAsync(async (req, res) => {
  await MessageService.deleteMessage(req.params.channelId, req.body.messageId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createMessage,
  getMessages,
  deleteMessage
};