const config = require('../config/config');
const logger = require('../config/logger');
const { deleteMessages } = require('../services/message.service');

/**
 * Deletes specified days old messages
 * based on MESSAGE_RETENTION env variable
 */
const deleteOldMessages = {
  schedule: '* * 23 * * *',
  function: async () => {
    logger.info(`***** Started: Delete ${config.messageRetention} days old messages *****`);

    let date = new Date();
    date.setDate(date.getDate() - config.messageRetention);

    const { acknowledged, deletedCount } = await deleteMessages({
      createdAt: {
        $lt: new Date(date.getFullYear(), date.getMonth(), date.getDay())
      }
    });

    if (acknowledged) {
      logger.info(`Total ${deletedCount} messages deleted.`);
    }
    logger.info(`***** Ended: Delete ${config.messageRetention} days old messages *****`);
  }
};

module.exports = {
  deleteOldMessages,
};