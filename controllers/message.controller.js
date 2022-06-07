const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const { MessageService } = require('../services');
const responseHandler = require('../utils/responseHandler');

const createMessage = catchAsync(async (req, res) => {
  const message = await MessageService.createMessage(req.params.channelId, req.body, req.user);
  responseHandler(req, res, message);
});
  
const getMessages = catchAsync(async (req, res) => {
  const options = _.pick(req.query, ['limit', 'page']);
  const messages = await MessageService.getPreviousMessages(req.user.id, req.params.channelId, options);
  responseHandler(req, res, messages);
});

const deleteMessage = catchAsync(async (req, res) => {
  await MessageService.deleteMessage(req.params.channelId, req.body.messageId);
  responseHandler(req, res);
});

module.exports = {
  createMessage,
  getMessages,
  deleteMessage
};