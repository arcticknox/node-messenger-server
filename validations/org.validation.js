const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const deleteOrg = {
  params: Joi.object().keys({
    orgId: Joi.string().custom(objectId).required(),
  }),
}

module.exports = {
  create,
  deleteOrg,
};