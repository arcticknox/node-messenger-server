const cron = require('node-cron');
const config = require('../config/config');
const logger = require('../config/logger');
const { deleteMessages } = require('../services/message.service');

let tasks = [];

/**
 * Deletes specified days old messages
 * based on MESSAGE_RETENTION env variable
 */
tasks.push(cron.schedule('2 * * * * *', async () => {
    logger.info('***** Started: Delete Old Messages *****')

    let date = new Date();
    date.setDate(date.getDate() - config.messageRetention);

    const {acknowledged, deletedCount} = await deleteMessages({
        createdAt: {
            $lt: new Date(date.getFullYear(), date.getMonth(), date.getDay())
        }
    });

    if (acknowledged) {
        logger.info(`Total ${deletedCount} messages deleted.`)
    }
    logger.info('***** Ended: Delete Old Messages *****')
}, {
    scheduled: false,
    timezone: 'Asia/Kolkata'
}));

const startCronTasks = () => {
    tasks.forEach(t => t.start());
};

const stopCronTasks = () => {
    tasks.forEach(t => t.stop());
}

module.exports = {
    startCronTasks,
    stopCronTasks
};