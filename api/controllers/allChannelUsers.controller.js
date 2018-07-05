'use strict';

const ChannelService = require('../services/channel.service');
const sendStatus = require('../services/sendStatus');

module.exports = {
    getAllChannelUsers(req, res) {
        let channelService = new ChannelService();
        channelService.getAllChannelUsers(req.query.key).then(result => {
            if (result instanceof Error) {
                res.json(sendStatus.responseErr(result.message));
            }
            res.json(sendStatus.responseOk({result}));
        })
    }
}