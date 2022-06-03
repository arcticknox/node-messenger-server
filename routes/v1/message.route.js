const express = require('express');
const auth = require('../../middlewares/auth');
const messageController = require('../../controllers/message.controller');

const router = express.Router();

// Messages
router
  .route('/:channelId')
  .post(auth(), messageController.createMessage)
  .get(auth(), messageController.getMessages)
  .delete(auth(), messageController.deleteMessage);

module.exports = router;