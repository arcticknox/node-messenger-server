const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    members: Joi.array(),
  }),
};

const getChannel = {
  params: Joi.object().keys({
    channelId: Joi.string().custom(objectId).required(),
  }),
};

const deleteChannel = {
  params: Joi.object().keys({
    channelId: Joi.string().custom(objectId).required(),
  }),
};

const updateChannel = {
  params: Joi.object().keys({
    channelId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    members: Joi.array(),
    admins: Joi.array()
  }),
};

const list = {
  body: Joi.object().keys({
    orgId: Joi.string().required(),
  }),
};

module.exports = {
  create,
  getChannel,
  deleteChannel,
  updateChannel,
  list,
};
