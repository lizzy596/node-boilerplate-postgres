const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const tokenDal = require('../data/dal/tokenDal');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  // Assuming userService handles finding and checking password match securely
  const user = await userService.isEmailAndPasswordMatch(email, password);
  if (!user || user.authType !== 'email') {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout (Revoke refresh token)
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await tokenDal.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });

  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await tokenDal.deleteById(refreshTokenDoc.id);
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserProfile(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await tokenDal.deleteById(refreshTokenDoc.id);
    const tokens = await tokenService.generateAuthTokens(user);
    return { user, tokens };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserProfile(resetPasswordTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }

    // Update user password through userService/DAL
    await userService.modifyUser(user.id, { password: newPassword });

    // Clean up reset password tokens using the DAL
    await tokenDal.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<void>}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserProfile(verifyEmailTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
    }

    // Clear verification tokens and update email status
    await tokenDal.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.modifyUser(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
