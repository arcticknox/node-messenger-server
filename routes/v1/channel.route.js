const express = require('express');
const validate = require('../../middlewares/validate');
const { channelValidation } = require('../../validations');
const { channelController } = require('../../controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(channelValidation.create), channelController.create)
  .get(auth(), validate(channelValidation.list), channelController.list);

router
  .route('/:channelId')
  .get(auth(), validate(channelValidation.getChannel), channelController.getChannel)
  .delete(auth(), validate(channelValidation.deleteChannel), channelController.deleteChannel)
  .patch(auth(), validate(channelValidation.updateChannel), channelController.updateChannel);


router.route('/:channelId/leave').post(auth(), channelController.leave);  
router.route('/:channelId/generateInviteToken').get(auth(), channelController.genInviteToken);
router.route('/:channelId/invite').post(auth(), channelController.inviteToChannel);

module.exports = router;
