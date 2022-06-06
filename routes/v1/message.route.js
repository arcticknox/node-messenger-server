const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { messageValidation } = require('../../validations');
const messageController = require('../../controllers/message.controller');

const router = express.Router();

// Messages
router
  .route('/:channelId')
  .post(auth(), validate(messageValidation.createMessage), messageController.createMessage)
  .get(auth(), validate(messageValidation.getMessages), messageController.getMessages)
  .delete(auth(), validate(messageValidation.deleteMessage), messageController.deleteMessage);

module.exports = router;