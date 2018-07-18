'use strict';

const QueueService = require('../services/channelQueue.service');
const sendStatus = require('../services/sendStatus');

module.exports = {
    addToQueue(req, res) {
        let queueService = new QueueService();
        queueService.addToQueue(req.query.link).then(result => {
            try {
                if (result[1]) {
                    res.json(sendStatus.responseOk({
                        message: 'channell successfully created',
                        created_channel: result[0]
                    }));
                }
                res.json(sendStatus.responseErr('this channel aredy in queue'));
            } catch (e) {
                res.json(sendStatus.responseErr(e.message));
            }
        })
    }
}