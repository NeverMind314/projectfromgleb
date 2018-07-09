'use strict'

const channelQueueModel = require('../models/channelQueue.model');

class QueueService {
    async addToQueue(newLink) {
        return await channelQueueModel.create({
            link: newLink.trim()
        });
    }

    async removeFromQueue(link) {
        let deletedItem = await channelQueueModel.destroy({
            where: {
                link: link.trim()
            }
        });
        if (!deletedItem) {
            return new Error('no item in queue with such link');
        }
        return 'successfully deleted from queue';
    }

    async getQueue() {
        return channelQueueModel.findAll();
    }
}

module.exports = QueueService;