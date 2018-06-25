'use strict';

const ChannelHistoryService = require('../services/channelHistroy.service');
const sendStatus = require('../services/sendStatus')

module.exports = {
    getChannelHistory(req, res) {
        let channelHistory = new ChannelHistoryService();
        try {
            channelHistory.getChannelHistory(req.query.key).then(history => {
                res.json(sendStatus.responseOk({history}));
            })
        } catch (e) {
            res.json(sendStatus.responseErr(e));
        }
    }
}