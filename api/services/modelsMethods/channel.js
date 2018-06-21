'use strict';

const channel = require('../../models/channel');

module.exports = {
    addChannel (newChannel) {
        channel.create(newChannel);
    },

    getChannels (callback, selectParams) {
        channel.findAll(selectParams).then(channels => {
            callback(channels);
        }); 
    }
} 