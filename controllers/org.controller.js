const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const { OrgService } = require('../services');
const responseHandler = require('../utils/responseHandler');

const create = catchAsync(async (req, res) => {
    const { name } = req.body;
    const ownerId = _.get(req, 'user.id');
    const org = await OrgService.createOrg(name, ownerId);
    responseHandler(req, res, org);
});

const deleteOrg = catchAsync(async (req, res) => {
    const org = await OrgService.deleteOrg(req.params.orgId, req.user.id);
    responseHandler(req, res, org);
});

const userOrgs = catchAsync(async (req, res) => {
    const options = _.pick(req.query, ['sortBy', 'limit', 'page']);
    const orgs = await OrgService.getUserOrgs(req.user.id, options);
    responseHandler(req, res, orgs);
});

module.exports = {
    create,
    deleteOrg,
    userOrgs,
};