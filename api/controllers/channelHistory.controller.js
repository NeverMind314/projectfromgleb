'use strict';

const ChannelService = require('../services/channel.service');
const sendStatus = require('../services/sendStatus')

module.exports = {
    getChannelHistory(req, res) {
        let channelHistory = new ChannelService();
        let startFrom = {
            moreThan: req.query.more_than,
            lessThan: req.query.less_than
        }
        if (startFrom.moreThan && startFrom.lessThan) {
            res.json(sendStatus.responseErr('Not allowed to request both of less_ and more_than fields'))
        }
        channelHistory.getChannelHistory(req.query.key, startFrom).then(result => {
            if (result instanceof Error) {
                res.json(sendStatus.responseErr(result.message));
            } else {
                res.json(sendStatus.responseOk({result}));
            }
        })
    }
}