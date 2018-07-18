'use strict';

const QueueService = require('../services/channelQueue.service');
const sendStatus = require('../services/sendStatus');

module.exports = {
    removeFromQueue(req, res) {
        let queueService = new QueueService();
        queueService.removeFromQueue(req.query.link).then(result => {
            try {
                if (result instanceof Error) {
                    res.json(sendStatus.responseErr(result.message));
                } else {
                    res.json(sendStatus.responseOk({result}));
                }
            } catch (e) {
                res.json(sendStatus.responseErr(e.message));
            }
        })
    }
}