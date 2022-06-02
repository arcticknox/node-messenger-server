const Joi = require('joi');

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    members: Joi.array(),
  }),
};

module.exports = {
  create,
};
  