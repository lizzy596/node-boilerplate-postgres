const userDao = require('../dao/userDao');

const userDal = {
  async createUser(userData) {
    // If you add Redis caching or coordination here later, you will need await again.
    return userDao.insert(userData);
  },

  async getUserById(id) {
    return userDao.findById(id);
  },

  async updateUser(id, userData) {
    return userDao.update(id, userData);
  },

  async deleteUser(id) {
    return userDao.delete(id);
  },
};

module.exports = userDal;
