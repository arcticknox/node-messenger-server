const catchAsync = require('../utils/catchAsync');
const path = require('path');
const responseHandler = require('../utils/responseHandler');
const { AuthService, UserService, TokenService, EmailService } = require('../services');
const httpStatus = require('http-status');

const createTokenAndSendVerificationEmail = async (user) => {
  const verifyEmailToken = await TokenService.generateVerifyEmailToken(user);
  await EmailService.sendVerificationEmail(user.email, verifyEmailToken);
};

const register = catchAsync(async (req, res) => {
  const user = await UserService.createUser(req.body);
  const tokens = await TokenService.generateAuthTokens(user);
  await createTokenAndSendVerificationEmail(user);
  responseHandler(req, res, { user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await AuthService.loginUserWithEmailAndPassword(email, password);
  const tokens = await TokenService.generateAuthTokens(user);
  responseHandler(req, res, { user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await AuthService.logout(req.body.refreshToken);
  responseHandler(req, res);
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await AuthService.refreshAuth(req.body.refreshToken);
  responseHandler(req, res, { ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const emailCount = await AuthService.checkEmail(req.body.email);
  if (emailCount) {
    const resetPasswordToken = await TokenService.generateResetPasswordToken(req.body.email);
    await EmailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    responseHandler(req, res);
    return;
  }
  responseHandler(req, res, { message: `User with email ${req.body.email} doesn't exists!` }, httpStatus.BAD_REQUEST);
});

const resetPassword = catchAsync(async (req, res) => {
  await AuthService.resetPassword(req.query.token, req.body.password);
  responseHandler(req, res);
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  createTokenAndSendVerificationEmail(req.user);
  responseHandler(req, res);
});

const verifyEmail = catchAsync(async (req, res) => {
  await AuthService.verifyEmail(req.query.token);
  // TODO: Need to handle this better from client
  res.sendFile(path.resolve('public/emailVerified.html'));
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
