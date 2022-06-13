const _ = require('lodash');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { UserService } = require('../services');
const responseHandler = require('../utils/responseHandler');

const createUser = catchAsync(async (req, res) => {
  const user = await UserService.createUser(req.body);
  responseHandler(req, res, user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = _.pick(req.query, ['name']);
  const options = _.pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await UserService.queryUsers(filter, options);
  responseHandler(req, res, result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await UserService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  responseHandler(req, res, user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await UserService.updateUserById(req.params.userId, req.body);
  responseHandler(req, res, user);
});

const deleteUser = catchAsync(async (req, res) => {
  await UserService.deleteUserById(req.params.userId);
  responseHandler(req, res);
});

const getUsersByIds = catchAsync(async (req, res) => {
  const users = await UserService.getUsersByIds(req.body.members);
  responseHandler(req, res, users);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUsersByIds,
};
