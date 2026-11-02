const express = require('express');
const devController = require('../../controllers/dev.controller');

const router = express.Router();

router.route('/').get(devController.dev);

module.exports = router;
