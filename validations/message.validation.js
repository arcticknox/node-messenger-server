const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMessage = {
  params: Joi.object().keys({
    channelId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    message: Joi.string().required(),
  }),
};

const getMessages = {
  params: Joi.object().keys({
    channelId: Joi.string().custom(objectId).required(),
  }),
  query: Joi.object().keys({
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const deleteMessage = {
  params: Joi.object().keys({
    channelId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    messageId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createMessage,
  getMessages,
  deleteMessage
};