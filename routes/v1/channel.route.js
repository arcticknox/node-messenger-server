const express = require('express');
// const validate = require('../../middlewares/validate');
const channelController = require('../../controllers/channel.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(auth(), channelController.create)
  .get(auth(), channelController.list);

module.exports = router;
