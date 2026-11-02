const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

// http://localhost:3000/v1/docs/postman

const dev = catchAsync(async (req, res) => {

  res.status(httpStatus.OK).send();
});

module.exports = {
  dev,
};
