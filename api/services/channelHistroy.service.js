'use strict';

const channelModel = require('../models/channel.model');
const messageModel = require('../models/message.model');

class getChannelHistory {
    async getChannelHistory(key, startFrom) {
        key = key.trim();
        let param = {};
        if (typeof key === 'number') {
            param.id = key;
        } else {
            param.link = key;
        }
        let channel = await channelModel.findOne({
            where: param
        });
        let messages = await messageModel.findAll({
            include: ['media'],
            where: {
                channel_id: channel.id
            }
        });
        return messages;
    }
}

module.exports = getChannelHistory