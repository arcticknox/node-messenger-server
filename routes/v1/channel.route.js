const express = require('express');
const validate = require('../../middlewares/validate');
const channelValidation = require('../../validations/channel.validation');
const channelController = require('../../controllers/channel.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(channelValidation.create),channelController.create)
  .get(auth(), channelController.list);

router
  .route('/:channelId')
  .get(auth(), channelController.getChannel)
  .delete(auth(), channelController.deleteChannel)
  .patch(auth(), channelController.updateChannel);


router.route('/:channelId/leave').post(auth(), channelController.leave);  

module.exports = router;
