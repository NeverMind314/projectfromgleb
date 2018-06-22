'use strict';

const channel = require('../../models/channel');

module.exports = {
    addChannel (newChannel) {
        channel.create(newChannel);
    },

    getChannels (callback, selectParams) {
        channel.findAll({where: selectParams}).then(channels => {
            callback(channels);
        }); 
    }
} 