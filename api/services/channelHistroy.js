const channelModel = require('../models/channel');
const channelMethods = require('./modelsMethods/channel');
const messageModel = require('../models/message');
const messageMethods = require('./modelsMethods/message');

module.exports = {
    channelHistory(channelParams) {
        return new Promise(function (res, rej) {
            channelMethods.getChannels(function (channel) {
                messageMethods.getMessages(function (messages) {
                    res(messages);
                }, {
                    channel_id: channel[0].id
                });
            }, channelParams);
        })
    }
}