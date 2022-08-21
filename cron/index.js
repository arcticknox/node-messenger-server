const cron = require('node-cron');
const logger = require('../config/logger');
const { deleteOldMessages } = require('./message.cron');

const crons = [
  deleteOldMessages
];

const scheduleCrons = () => {
  logger.info(`Started scheduling ${crons.length} crons.`);
  crons.forEach(c => cron.schedule(c.schedule, c.function));
};

module.exports = {
  scheduleCrons,
};