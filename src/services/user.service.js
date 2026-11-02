const httpStatus = require('http-status');
const userDal = require('../data/dal/userDal');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<Object>}
 */

const createUser = async (userData) => {
  if (!userData.name || !userData.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name and email are required');
  }
  // Business logic: check uniqueness, hash passwords, etc.
  const newUser = await userDal.createUser(userData);

  // Optional: emit events or call secondary services (e.g., send welcome email)
  return newUser;
};

/**
 * Get user by id
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
const getUserById = async (id) => {
  const user = await userDal.getUserById(id); // Throws 404 if not found
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

/**
 * Update user by id
 * @param {number|string} userId
 * @param {Object} updateBody
 * @returns {Promise<Object>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId); // Throws 404 if not found

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  return userDal.updateUser(userId, updateBody);
};

/**
 * Delete user by id
 * @param {number|string} userId
 * @returns {Promise<Object>}
 */
const deleteUserById = async (userId) => {
  const deletedUser = await userDal.deleteUser(userId);
  if (!deletedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return deletedUser;
};

module.exports = {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
