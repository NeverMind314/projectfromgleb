'use strict';

const QueueService = require('../services/channelQueue.service');
const sendStatus = require('../services/sendStatus');

module.exports = {
    addToQueue(req, res) {
        let queueService = new QueueService();
        queueService.addToQueue(req.query.link).then(result => {
            try {
                res.json(sendStatus.responseOk({result}));
            } catch (e) {
                res.json(sendStatus.responseErr(e.message))
            }
        })
    }
}