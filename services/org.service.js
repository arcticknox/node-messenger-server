const httpStatus = require('http-status');
const { Org } = require('../models/org.model');
const ApiError = require('../utils/ApiError');
const Channel = require('../models/channel.model');
const config = require('../config/config');

/**
 * 
 * @param {String} name 
 * @param {String} ownerId 
 * @returns {Promise}
 */
const createOrg = async (name, ownerId) => {
  const orgInfo = await Org.findOne({ name, ownerId });
  if (orgInfo) {
    throw new ApiError(httpStatus.CONFLICT, 'This Org already exists');
  }
  const count = await Org.countDocuments({ ownerId });
  if (count > config.maxOrgsAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'User can create maximum of 5 orgs.');
  }
  const org = await Org.create({ name, ownerId, members: [ownerId], admins: [ownerId] });
  // Create #Lobby channel for this org
  if (org) {
    createDefaultLobby(org);
  }
  return org;
};

/**
 * 
 * @param {String} orgId 
 * @param {String} ownerId 
 * @returns {Promise}
 */
const deleteOrg = async (orgId, ownerId) => {
  const orgInfo = await Org.findOneAndUpdate({ _id: orgId, ownerId }, { $set: { active: false } }, { new: true });
  if (!orgInfo) {
    throw new ApiError(httpStatus.FORBIDDEN);
  }
  // Delete associated channels
  deleteOrgChannels(orgInfo.id, orgInfo.ownerId);
  return orgInfo;
};

const createDefaultLobby = async (org) => {
  const { id, ownerId, members, admins } = org;
  await Channel.create({
    name: '#Lobby',
    ownerId,
    members,
    admins,
    orgId: id,
  });
};

const deleteOrgChannels = async (orgId, ownerId) => {
  await Channel.findOneAndUpdate({ orgId, ownerId }, { $set: { status: 'deleted' } }, { new: true });
};

/**
 * 
 * @param {String} userId 
 * @param {String} options 
 * @returns {Promise}
 */
const getUserOrgs = async (userId, options) => {
  const orgs = await Org.paginate({ members: userId, active: true }, options);
  if (!orgs) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No orgs found!');
  }
  return orgs;
};

module.exports = {
  createOrg,
  deleteOrg,
  getUserOrgs,
};