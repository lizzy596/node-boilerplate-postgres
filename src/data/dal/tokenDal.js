const tokenDao = require('../dao/tokenDao');

const tokenDal = {
  create(tokenData) {
    return tokenDao.create(tokenData);
  },

  findOne(filter) {
    return tokenDao.findOne(filter);
  },

  deleteMany(filter) {
    return tokenDao.deleteMany(filter);
  },

  deleteById(id) {
    return tokenDao.deleteById(id);
  },
};

module.exports = tokenDal;
