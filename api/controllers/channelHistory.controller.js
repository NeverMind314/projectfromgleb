'use strict';

const ChannelHistoryService = require('../services/channelHistroy.service');
const sendStatus = require('../services/sendStatus')

module.exports = {
    getChannelHistory(req, res) {
        let channelHistory = new ChannelHistoryService();
        channelHistory.getChannelHistory(req.query.key).then(result => {
            if (result instanceof Error) {
                res.json(sendStatus.responseErr(result.message));
            }
            res.json(sendStatus.responseOk({result}));
        })
    }
}